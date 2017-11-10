import { Services, EVENT, Client } from '../client'
import { Options } from '../client-options'
import { TOPIC, PRESENCE_ACTIONS as PRESENCE_ACTION, PresenceMessage, Message } from '../../binary-protocol/src/message-constants'
import ResubscribeNotifier from '../util/resubscribe-notifier'
import * as Emitter from 'component-emitter2'

const allResponse: string = PRESENCE_ACTION.QUERY_ALL_RESPONSE.toString()
const response: string = PRESENCE_ACTION.QUERY_ALL.toString()
const allSubscribe: string = PRESENCE_ACTION.SUBSCRIBE_ALL.toString()

export type QueryResult = Array<string>
export interface IndividualQueryResult { [key: string]: boolean }
export type SubscribeCallback = (user: string, online: boolean) => void

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
  private subscriptionEmitter: Emitter
  private queryEmitter: Emitter
  private options: Options
  private counter: number
  private pendingSubscribes: Set<string>
  private pendingUnsubscribes: Set<string>
  private flushTimeout: number | null
  private emitter: Emitter
  private resubscribeNotifier: ResubscribeNotifier

  constructor (emitter: Emitter, services: Services, options: Options) {
    this.emitter = emitter
    this.services = services
    this.options = options
    this.subscriptionEmitter = new Emitter()
    this.queryEmitter = new Emitter()
    this.resubscribe = this.resubscribe.bind(this)
    this.resubscribeNotifier = new ResubscribeNotifier(this.emitter, this.services, this.options, this.resubscribe)
    this.services.connection.registerHandler(TOPIC.PRESENCE, this.handle.bind(this))
    this.counter = 0
    this.pendingSubscribes = new Set()
    this.pendingUnsubscribes = new Set()
    this.flush = this.flush.bind(this)
  }

  public subscribe (callback: SubscribeCallback): void
  public subscribe (user: string, callback: SubscribeCallback): void
  public subscribe (user: string | SubscribeCallback, callback?: SubscribeCallback): void {
    if (typeof user === 'string' && user.length > 0 && typeof callback === 'function') {
      if (!this.subscriptionEmitter.hasListeners(user)) {
        this.pendingSubscribes.add(user)
      }
      this.subscriptionEmitter.on(user, callback)
      this.pendingUnsubscribes.delete(user)
    } else if (typeof user === 'function') {
      if (!this.subscriptionEmitter.hasListeners(allSubscribe)) {
        this.pendingSubscribes.add(allSubscribe)
      }
      this.subscriptionEmitter.on(allSubscribe, user)
      this.pendingUnsubscribes.delete(allSubscribe)
    } else {
      throw new Error('invalid arguments: "user" or "callback"')
    }
    if (!this.flushTimeout) {
      this.flushTimeout = this.services.timerRegistry.add({
        duration: 0,
        context: this,
        callback: this.flush
      })
    }
  }

  public unsubscribe (userOrCallback?: string | SubscribeCallback): void
  public unsubscribe (user: string, callback: SubscribeCallback): void
  public unsubscribe (user?: string | SubscribeCallback, callback?: SubscribeCallback): void {
    if (user && typeof user === 'string' && user.length > 0) {
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
      }
    } else if (user && typeof user === 'function') {
      this.subscriptionEmitter.off(allSubscribe, user)
      if (!this.subscriptionEmitter.hasListeners(allSubscribe)) {
        this.pendingSubscribes.delete(allSubscribe)
        this.pendingUnsubscribes.add(allSubscribe)
      }
    } else if (typeof user === 'undefined' && typeof callback === 'undefined') {
      const users = this.subscriptionEmitter.eventNames()
      this.subscriptionEmitter.off()
      this.pendingSubscribes.clear()
      for (let i = 0; i < users.length; i++) {
        this.pendingUnsubscribes.add(users[i])
      }
      this.pendingUnsubscribes.add(allSubscribe)
    } else {
      throw new Error('invalid argument: "user" or "callback"')
    }

    if (!this.flushTimeout) {
      this.flushTimeout = this.services.timerRegistry.add({
        duration: 0,
        context: this,
        callback: this.flush
      })
    }
  }

  public getAll (): Promise<QueryResult>
  public getAll (users: Array<string>): Promise<IndividualQueryResult>
  public getAll (callback: (error: { reason: EVENT }, result?: QueryResult) => void): void
  public getAll (users: Array<string>, callback: (error: { reason: EVENT }, result?: IndividualQueryResult) => void): void
  public getAll (...rest: Array<any>): Promise<QueryResult | IndividualQueryResult> | void {
    const { callback, users } = validateQueryArguments(rest)

    if (!this.services.connection.isConnected) {
      if (callback) {
        this.services.timerRegistry.requestIdleCallback(callback.bind(this, EVENT.CLIENT_OFFLINE))
        return
      }
      return Promise.reject(EVENT.CLIENT_OFFLINE)
    }

    let message: Message
    let emitterAction: string

    if (!users) {
      message = {
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTION.QUERY_ALL
      }
      emitterAction = allResponse
    } else {
      const queryId = (this.counter++).toString()
      message = {
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTION.QUERY,
        correlationId: queryId,
        names: users
      }
      emitterAction = `${response}-${queryId}`
    }

    this.services.connection.sendMessage(message)

    if (!callback) {
      return new Promise<QueryResult | IndividualQueryResult>((resolve, reject) => {
        this.queryEmitter.once(emitterAction, (error: { reason: string }, results: QueryResult | IndividualQueryResult) => {
          if (error) {
            reject(error)
            return
          }
          resolve(results)
        })
      })
    } else {
      this.queryEmitter.once(emitterAction, callback)
    }
  }

  public handle (message: Message): void {
    if (message.isAck) {
      this.services.timeoutRegistry.remove(message)
    } else if (message.action === PRESENCE_ACTION.QUERY_ALL_RESPONSE) {
      this.queryEmitter.emit(allResponse, null, message.names)
      this.services.timeoutRegistry.remove(message)
    } else if (message.action === PRESENCE_ACTION.QUERY_RESPONSE) {
      this.queryEmitter.emit(`${response}-${message.correlationId}`, null, message.parsedData)
      this.services.timeoutRegistry.remove(message)
    } else if (message.action === PRESENCE_ACTION.PRESENCE_JOIN) {
      this.subscriptionEmitter.emit(message.name as string, message.name, true)
    } else if (message.action === PRESENCE_ACTION.PRESENCE_JOIN_ALL) {
      this.subscriptionEmitter.emit(allSubscribe, message.name, true)
    } else if (message.action === PRESENCE_ACTION.PRESENCE_LEAVE) {
      this.subscriptionEmitter.emit(message.name as string, message.name, false)
    } else if (message.action === PRESENCE_ACTION.PRESENCE_LEAVE_ALL) {
      this.subscriptionEmitter.emit(allSubscribe, message.name, false)
    } else if (message.isError) {
      if (message.originalAction === PRESENCE_ACTION.QUERY) {
        this.queryEmitter.emit(`${response}-${message.correlationId}`, PRESENCE_ACTION[message.action])
      } else if (message.originalAction === PRESENCE_ACTION.QUERY_ALL) {
        this.queryEmitter.emit(allResponse, PRESENCE_ACTION[message.action])
      } else {
        this.services.logger.error(message)
      }
    }
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

  private flush () {
    if (!this.services.connection.isConnected) {
      // will be handled by resubscribe
      return
    }
    const subUsers = Array.from(this.pendingSubscribes.keys())
    const allSubIndex = subUsers.indexOf(allSubscribe)
    if (allSubIndex !== -1) {
      subUsers.splice(allSubIndex, 1)
      const message = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTION.SUBSCRIBE_ALL }
      this.services.timeoutRegistry.add({ message })
      this.services.connection.sendMessage(message)
    }
    if (subUsers.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.SUBSCRIBE, subUsers)
      this.pendingSubscribes.clear()
    }

    const unsubUsers = Array.from(this.pendingUnsubscribes.keys())
    const allUnsubIndex = unsubUsers.indexOf(allSubscribe)
    if (allUnsubIndex !== -1) {
      unsubUsers.splice(allUnsubIndex, 1)
      const message = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTION.UNSUBSCRIBE_ALL }
      this.services.timeoutRegistry.add({ message })
      this.services.connection.sendMessage(message)
    }
    if (unsubUsers.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.UNSUBSCRIBE, unsubUsers)
      this.pendingUnsubscribes.clear()
    }
    this.flushTimeout = null
  }

  private resubscribe () {
    const keys = Object.keys(this.subscriptionEmitter._callbacks || {})
    const index = keys.indexOf(allSubscribe)
    if (index !== -1) {
      keys.splice(index, 1)
      const message = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTION.SUBSCRIBE_ALL }
      this.services.timeoutRegistry.add({ message })
      this.services.connection.sendMessage(message)
    }
    if (keys.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.SUBSCRIBE, keys)
    }
  }
}
