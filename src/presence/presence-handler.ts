import { EVENT, Message, TOPIC, PRESENCE_ACTION as PA } from '../constants'
import { Services } from '../deepstream-client'
import { Options } from '../client-options'
import { Emitter } from '../util/emitter'
import {BulkSubscriptionService} from '../util/bulk-subscription-service'

export type QueryResult = string[]
export interface IndividualQueryResult { [key: string]: boolean }
export type SubscribeCallback = (user: string, online: boolean) => void

const ONLY_EVENT = 'OE'
type QueryCallback = (error: EVENT, data?: QueryResult | IndividualQueryResult) => void

function validateQueryArguments (rest: any[]): { users: string[] | null, callback: null | QueryCallback } {
  let users: string[] | null = null
  let callback: QueryCallback | null = null

  if (rest.length === 1) {
    if (Array.isArray(rest[0])) {
      users = rest[0]
    } else {
      if (typeof rest[0] !== 'function') {
        throw new Error('invalid argument: "callback"')
      }
      callback = rest[0]
    }
  } else if (rest.length === 2) {
    users = rest[0]
    callback = rest[1]
    if (!Array.isArray(users) || typeof callback !== 'function') {
      throw new Error('invalid argument: "users" or "callback"')
    }
  }
  return { users, callback }
}

export class PresenceHandler {
  private globalSubscriptionEmitter = new Emitter()
  private subscriptionEmitter = new Emitter()
  private queryEmitter = new Emitter()
  private queryAllEmitter = new Emitter()
  private counter: number = 0
  private limboQueue: Message[] = []
  private readonly bulkSubscription: BulkSubscriptionService<PA>

  constructor (private services: Services, options: Options) {
    this.bulkSubscription = new BulkSubscriptionService<PA>(
        this.services, options.subscriptionInterval, TOPIC.PRESENCE,
        PA.SUBSCRIBE, PA.UNSUBSCRIBE,
        this.onBulkSubscriptionSent.bind(this)
    )

    this.services.connection.registerHandler(TOPIC.PRESENCE, this.handle.bind(this))
    this.services.connection.onExitLimbo(this.onExitLimbo.bind(this))
    this.services.connection.onLost(this.onExitLimbo.bind(this))
    this.services.connection.onReestablished(this.onConnectionReestablished.bind(this))
  }

  public subscribe (callback: SubscribeCallback): void
  public subscribe (user: string, callback: SubscribeCallback): void
  public subscribe (userOrCallback: string | SubscribeCallback, callback?: SubscribeCallback): void {
    if (typeof userOrCallback === 'string' && userOrCallback.length > 0 && typeof callback === 'function') {
      const user = userOrCallback
      if (!this.subscriptionEmitter.hasListeners(user)) {
        this.bulkSubscription.subscribe(user)
      }
      this.subscriptionEmitter.on(user, callback)
      return
    }

    if (typeof userOrCallback === 'function' && typeof callback === 'undefined') {
      if (!this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT)) {
        this.subscribeToAllChanges()
      }
      this.globalSubscriptionEmitter.on(ONLY_EVENT, userOrCallback)
      return
    }

    throw new Error('invalid arguments: "user" or "callback"')
  }

  public unsubscribe (): void
  public unsubscribe (callback: SubscribeCallback): void
  public unsubscribe (user: string, callback?: SubscribeCallback): void
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
        this.bulkSubscription.unsubscribe(user)
        return
      }
    }

    if (userOrCallback && typeof userOrCallback === 'function') {
      callback = userOrCallback
      this.globalSubscriptionEmitter.off(ONLY_EVENT, callback)
      if (!this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT)) {
        this.unsubscribeToAllChanges()
      }
      return
    }

    if (typeof userOrCallback === 'undefined' && typeof callback === 'undefined') {
      this.subscriptionEmitter.off()
      this.globalSubscriptionEmitter.off()

      this.bulkSubscription.unsubscribeList(this.subscriptionEmitter.eventNames())
      this.unsubscribeToAllChanges()
      return
    }

    throw new Error('invalid argument: "user" or "callback"')
  }

  public getAll (): Promise<QueryResult>
  public getAll (users: string[]): Promise<IndividualQueryResult>
  public getAll (callback: (error: { reason: EVENT }, result?: QueryResult) => void): void
  public getAll (users: string[], callback: (error: { reason: EVENT }, result?: IndividualQueryResult) => void): void
  public getAll (...rest: any[]): Promise<QueryResult | IndividualQueryResult> | void {
    const { callback, users } = validateQueryArguments(rest)

    let message: Message
    let emitter: Emitter
    let emitterAction: string

    if (users) {
      const queryId = (this.counter++).toString()
      message = {
        topic: TOPIC.PRESENCE,
        action: PA.QUERY,
        correlationId: queryId,
        names: users
      }
      emitter = this.queryEmitter
      emitterAction = queryId
    } else {
      message = {
        topic: TOPIC.PRESENCE,
        action: PA.QUERY_ALL
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

  private handle (message: Message): void {
    if (message.isAck) {
      this.services.timeoutRegistry.remove(message)
      return
    }

    if (message.action === PA.QUERY_ALL_RESPONSE) {
      this.queryAllEmitter.emit(ONLY_EVENT, null, message.names)
      this.services.timeoutRegistry.remove(message)
      return
    }

    if (message.action === PA.QUERY_RESPONSE) {
      this.queryEmitter.emit(message.correlationId as string, null, message.parsedData)
      this.services.timeoutRegistry.remove(message)
      return
    }

    if (message.action === PA.PRESENCE_JOIN) {
      this.subscriptionEmitter.emit(message.name as string, message.name, true)
      return
    }

    if (message.action === PA.PRESENCE_JOIN_ALL) {
      this.globalSubscriptionEmitter.emit(ONLY_EVENT, message.name, true)
      return
    }

    if (message.action === PA.PRESENCE_LEAVE) {
      this.subscriptionEmitter.emit(message.name as string, message.name, false)
      return
    }

    if (message.action === PA.PRESENCE_LEAVE_ALL) {
      this.globalSubscriptionEmitter.emit(ONLY_EVENT, message.name, false)
      return
    }

    if (message.isError) {
      this.services.timeoutRegistry.remove(message)
      if (message.originalAction === PA.QUERY) {
        this.queryEmitter.emit(message.correlationId as string, PA[message.action])
      } else if (message.originalAction === PA.QUERY_ALL) {
        this.queryAllEmitter.emit(ONLY_EVENT, PA[message.action])
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

  private subscribeToAllChanges () {
    if (!this.services.connection.isConnected) {
      return
    }
    const message = { topic: TOPIC.PRESENCE, action: PA.SUBSCRIBE_ALL }
    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
  }

  private unsubscribeToAllChanges () {
    if (!this.services.connection.isConnected) {
      return
    }
    const message = { topic: TOPIC.PRESENCE, action: PA.UNSUBSCRIBE_ALL }
    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
  }

  private onConnectionReestablished () {
    const keys = this.subscriptionEmitter.eventNames()
    if (keys.length > 0) {
      this.bulkSubscription.subscribeList(keys)
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

  private onBulkSubscriptionSent (message: Message) {
    this.services.timeoutRegistry.add({ message })
  }
}
