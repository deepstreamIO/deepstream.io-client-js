import { Services, EVENT, Client } from '../client'
import { Options } from '../client-options'
import { TOPIC, PRESENCE_ACTIONS as PRESENCE_ACTION, PresenceMessage, Message } from '../../binary-protocol/src/message-constants'
import * as Emitter from 'component-emitter2'

export type QueryResult = Array<string>
export interface IndividualQueryResult { [key: string]: boolean }
export type SubscribeCallback = (user: string, online: boolean) => void

const ONLY_EVENT = 'OE'

function validateQueryArguments (rest: Array<any>): { users: Array<string> | null, callback: null | ((error: EVENT, data?: QueryResult | IndividualQueryResult) => void) } {
  let users: Array<string> | null = null
  let cb: ((error: EVENT, data: QueryResult | IndividualQueryResult) => void) | null = null

  if (rest.length === 1) {
    if (Array.isArray(rest[0])) {
      users = rest[0]
    } else {
      if (typeof rest[0] !== 'function') {
        throw new Error('invalid argument: "callback"')
      }
      cb = rest[0]
    }
  } else if (rest.length === 2) {
    users = rest[0]
    cb = rest[1]
    if (!Array.isArray(users) || typeof cb !== 'function') {
      throw new Error('invalid argument: "users" or "callback"')
    }
  }
  return { users, callback: cb }
}

export class PresenceHandler {
  private services: Services
  private globalSubscriptionEmitter: Emitter
  private subscriptionEmitter: Emitter
  private queryEmitter: Emitter
  private queryAllEmitter: Emitter
  private options: Options
  private counter: number
  private pendingSubscribes: Set<string>
  private pendingUnsubscribes: Set<string>
  private limboQueue: Array<Message>
  private flushTimeout: number | null

  constructor (services: Services, options: Options) {
    this.services = services
    this.options = options
    this.subscriptionEmitter = new Emitter()
    this.globalSubscriptionEmitter = new Emitter()
    this.queryEmitter = new Emitter()
    this.queryAllEmitter = new Emitter()

    this.services.connection.registerHandler(TOPIC.PRESENCE, this.handle.bind(this))
    this.services.connection.onExitLimbo(this.onExitLimbo.bind(this))
    this.services.connection.onLost(this.onExitLimbo.bind(this))
    this.services.connection.onReestablished(this.onConnectionReestablished.bind(this))

    this.counter = 0
    this.pendingSubscribes = new Set()
    this.pendingUnsubscribes = new Set()
    this.limboQueue = []
  }

  public subscribe (callback: SubscribeCallback): void
  public subscribe (user: string, callback: SubscribeCallback): void
  public subscribe (userOrCallback: string | SubscribeCallback, callback?: SubscribeCallback): void {
    if (typeof userOrCallback === 'string' && userOrCallback.length > 0 && typeof callback === 'function') {
      const user = userOrCallback
      if (!this.subscriptionEmitter.hasListeners(user)) {
        this.pendingSubscribes.add(user)
      }
      this.subscriptionEmitter.on(user, callback)
      this.pendingUnsubscribes.delete(user)
      this.registerFlushTimeout()
      return
    }

    if (typeof userOrCallback === 'function' && typeof callback === 'undefined') {
      if (!this.subscriptionEmitter.hasListeners(ONLY_EVENT)) {
        this.subscribeToAllChanges()
      }
      this.globalSubscriptionEmitter.on(ONLY_EVENT, userOrCallback)
      return
    }

    throw new Error('invalid arguments: "user" or "callback"')
  }

  public unsubscribe (userOrCallback?: string | SubscribeCallback, callback?: SubscribeCallback): void {
    if (userOrCallback && typeof userOrCallback === 'string' && userOrCallback.length > 0) {
      const user = userOrCallback
      if (callback) {
        if (typeof callback !== 'function') {
          throw new Error('invalid argument: "callback"')
        }
        this.subscriptionEmitter.off(user, callback)
      } else {
        this.subscriptionEmitter.off(user)
      }
      if (!this.subscriptionEmitter.hasListeners(user)) {
        this.pendingSubscribes.delete(user)
        this.pendingUnsubscribes.add(user)
        this.registerFlushTimeout()
      }
      return
    }

    if (userOrCallback && typeof userOrCallback === 'function') {
      callback = userOrCallback
      this.globalSubscriptionEmitter.off(ONLY_EVENT, callback)
      if (!this.subscriptionEmitter.hasListeners(ONLY_EVENT)) {
        this.unsubscribeToAllChanges()
      }
      return
    }

    if (typeof userOrCallback === 'undefined' && typeof callback === 'undefined') {
      this.subscriptionEmitter.off()
      this.globalSubscriptionEmitter.off()

      this.pendingSubscribes.clear()
      const users = this.subscriptionEmitter.eventNames()
      for (let i = 0; i < users.length; i++) {
        this.pendingUnsubscribes.add(users[i])
      }
      this.registerFlushTimeout()
      this.unsubscribeToAllChanges()
      return
    }

    throw new Error('invalid argument: "user" or "callback"')
  }

  public getAll (): Promise<QueryResult>
  public getAll (users: Array<string>): Promise<IndividualQueryResult>
  public getAll (callback: (error: { reason: EVENT }, result?: QueryResult) => void): void
  public getAll (users: Array<string>, callback: (error: { reason: EVENT }, result?: IndividualQueryResult) => void): void
  public getAll (...rest: Array<any>): Promise<QueryResult | IndividualQueryResult> | void {
    const { callback, users } = validateQueryArguments(rest)

    let message: Message
    let emitter: Emitter
    let emitterAction: string

    if (users) {
      const queryId = (this.counter++).toString()
      message = {
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTION.QUERY,
        correlationId: queryId,
        names: users
      }
      emitter = this.queryEmitter
      emitterAction = queryId
    } else {
      message = {
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTION.QUERY_ALL
      }
      emitter = this.queryAllEmitter
      emitterAction = ONLY_EVENT
    }

    if (this.services.connection.isConnected) {
      this.sendQuery(message)
    } else if (this.services.connection.isInLimbo) {
      this.limboQueue.push(message)
    } else {
      this.services.timerRegistry.requestIdleCallback(() => {
        emitter.emit(emitterAction, EVENT.CLIENT_OFFLINE)
      })
    }

    if (callback) {
      emitter.once(emitterAction, callback)
      return
    }

    return new Promise<QueryResult | IndividualQueryResult>((resolve, reject) => {
      emitter.once(
        emitterAction,
        (error: { reason: string }, results: QueryResult | IndividualQueryResult) => error ? reject(error) : resolve(results)
      )
    })
  }

  public handle (message: Message): void {
    if (message.isAck) {
      this.services.timeoutRegistry.remove(message)
      return
    }

    if (message.action === PRESENCE_ACTION.QUERY_ALL_RESPONSE) {
      this.queryAllEmitter.emit(ONLY_EVENT, null, message.names)
      this.services.timeoutRegistry.remove(message)
      return
    }

    if (message.action === PRESENCE_ACTION.QUERY_RESPONSE) {
      this.queryEmitter.emit(message.correlationId as string, null, message.parsedData)
      this.services.timeoutRegistry.remove(message)
      return
    }

    if (message.action === PRESENCE_ACTION.PRESENCE_JOIN) {
      this.subscriptionEmitter.emit(message.name as string, message.name, true)
      return
    }

    if (message.action === PRESENCE_ACTION.PRESENCE_JOIN_ALL) {
      this.globalSubscriptionEmitter.emit(ONLY_EVENT, message.name, true)
      return
    }

    if (message.action === PRESENCE_ACTION.PRESENCE_LEAVE) {
      this.subscriptionEmitter.emit(message.name as string, message.name, false)
      return
    }

    if (message.action === PRESENCE_ACTION.PRESENCE_LEAVE_ALL) {
      this.globalSubscriptionEmitter.emit(ONLY_EVENT, message.name, false)
      return
    }

    if (message.isError) {
      this.services.timeoutRegistry.remove(message)
      if (message.originalAction === PRESENCE_ACTION.QUERY) {
        this.queryEmitter.emit(message.correlationId as string, PRESENCE_ACTION[message.action])
      } else if (message.originalAction === PRESENCE_ACTION.QUERY_ALL) {
        this.queryAllEmitter.emit(ONLY_EVENT, PRESENCE_ACTION[message.action])
      } else {
        this.services.logger.error(message)
      }
      return
    }

    this.services.logger.error(message, EVENT.UNSOLICITED_MESSAGE)
  }

  private sendQuery (message: Message) {
    this.services.connection.sendMessage(message)
    this.services.timeoutRegistry.add({ message })
  }

  private flush () {
    if (!this.services.connection.isConnected) {
      // will be handled by resubscribe
      return
    }
    const subUsers = Array.from(this.pendingSubscribes.keys())

    if (subUsers.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.SUBSCRIBE, subUsers)
      this.pendingSubscribes.clear()
    }

    const unsubUsers = Array.from(this.pendingUnsubscribes.keys())
    if (unsubUsers.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.UNSUBSCRIBE, unsubUsers)
      this.pendingUnsubscribes.clear()
    }
    this.flushTimeout = null
  }

  private bulkSubscription (action: PRESENCE_ACTION.SUBSCRIBE | PRESENCE_ACTION.UNSUBSCRIBE, names: Array<string>) {
    const correlationId = this.counter++
    const message: Message = {
      topic: TOPIC.PRESENCE,
      action,
      correlationId: correlationId.toString(),
      names
    }
    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
  }

  private subscribeToAllChanges () {
    if (!this.services.connection.isConnected) {
      return
    }
    const message = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTION.SUBSCRIBE_ALL }
    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
  }

  private unsubscribeToAllChanges () {
    if (!this.services.connection.isConnected) {
      return
    }
    const message = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTION.UNSUBSCRIBE_ALL }
    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
  }

  private registerFlushTimeout () {
    if (!this.flushTimeout) {
      this.flushTimeout = this.services.timerRegistry.add({
        duration: 0,
        context: this,
        callback: this.flush
      })
    }
  }

  private onConnectionReestablished () {
    const keys = this.subscriptionEmitter.eventNames()
    if (keys.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.SUBSCRIBE, keys)
    }

    const hasGlobalSubscription = this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT)
    if (hasGlobalSubscription) {
      this.subscribeToAllChanges()
    }

    for (let i = 0; i < this.limboQueue.length; i++) {
      this.sendQuery(this.limboQueue[i])
    }
    this.limboQueue = []
  }

  private onExitLimbo () {
    this.queryEmitter.eventNames().forEach(correlationId => {
      this.queryEmitter.emit(correlationId, EVENT.CLIENT_OFFLINE)
    })
    this.queryAllEmitter.emit(ONLY_EVENT, EVENT.CLIENT_OFFLINE)
    this.limboQueue = []
    this.queryAllEmitter.off()
    this.queryEmitter.off()
  }
}
