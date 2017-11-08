import { Services, EVENT, Client } from '../client'
import { Options } from '../client-options'
import { TOPIC, PRESENCE_ACTIONS as PRESENCE_ACTION, PresenceMessage, Message } from '../../binary-protocol/src/message-constants'
import ResubscribeNotifier from '../util/resubscribe-notifier'
import * as Emitter from 'component-emitter2'

const allResponse: string = PRESENCE_ACTION.QUERY_ALL_RESPONSE.toString()
const response: string = PRESENCE_ACTION.QUERY_ALL.toString()
const allSubscribe: string = PRESENCE_ACTION.SUBSCRIBE_ALL.toString()

export type QueryResult = string[]
export type IndividualQueryResult = { [key: string]: boolean }
export type SubscribeCallback = (user: string, online: boolean) => void

function validateArguments (user: any, cb: any) {
  let userId: string | undefined
  let callback: SubscribeCallback
  if (typeof user === 'function' && cb === undefined) {
    callback = user
  } else if (typeof user === 'string' && typeof cb === 'function') {
    userId = user
    callback = cb
  } else {
    throw new Error('invalid arguments: "user" or "callback"')
  }
  return { userId, callback }
}

function validateQueryArguments (rest: any[]) : { users: string[] | null, callback: null | ((error: { reason: EVENT }, data?: QueryResult | IndividualQueryResult) => void) } {
  let users: string[] | null = null
  let cb: ((error: { reason: EVENT }, data: QueryResult | IndividualQueryResult) => void) | null = null

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
  private pendingSubscribes: Map<string, boolean>
  private pendingUnsubscribes: Map<string, boolean>
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
    this.pendingSubscribes = new Map()
    this.pendingUnsubscribes = new Map()
    this.flush = this.flush.bind(this)
  }

  public subscribe (callback: SubscribeCallback) : void
  public subscribe (user: string, callback: SubscribeCallback) : void
  public subscribe (user: string | SubscribeCallback, callback?: SubscribeCallback) : void {
    const { userId, callback: cb } = validateArguments(user, callback)

    if (!userId) {
      this.globalSubscription(PRESENCE_ACTION.SUBSCRIBE_ALL, cb)
      return
    }

    this.pendingUnsubscribes.delete(userId)
    this.pendingSubscribes.set(userId, true)
    this.subscriptionEmitter.on(userId, cb)
    if (!this.flushTimeout) {
      this.flushTimeout = this.services.timerRegistry.add({
        duration: 0,
        context: this,
        callback: this.flush
      })
    }
  }

  public unsubscribe (callback: SubscribeCallback) : void
  public unsubscribe (user: string, callback: SubscribeCallback) : void
  public unsubscribe (user: string | SubscribeCallback, callback?: SubscribeCallback) : void {
    const { userId, callback: cb } = validateArguments(user, callback)

    if (!userId) {
      this.globalSubscription(PRESENCE_ACTION.UNSUBSCRIBE_ALL, cb)
      return
    }

    this.pendingSubscribes.delete(userId)
    this.pendingUnsubscribes.set(userId, true)
    this.subscriptionEmitter.off(userId, cb)
    if (!this.flushTimeout) {
      this.flushTimeout = this.services.timerRegistry.add({
        duration: 0,
        context: this,
        callback: this.flush
      })
    }
  }

  public getAll () : Promise<QueryResult>
  public getAll (users: string[]) : Promise<IndividualQueryResult>
  public getAll (callback: (error: { reason: EVENT }, result?: QueryResult) => void): void
  public getAll (users: string[], callback: (error: { reason: EVENT }, result?: IndividualQueryResult) => void) : void
  public getAll (...rest: any[]) : Promise<QueryResult | IndividualQueryResult> | void {
    const { callback, users } = validateQueryArguments(rest)

    if (!this.services.connection.isConnected) {
      if (callback) {
        callback({ reason: EVENT.CLIENT_OFFLINE })
        return
      }
      return Promise.reject({ reason: EVENT.CLIENT_OFFLINE })
    }

    const queryId = this.counter++
    let message: PresenceMessage
    let responseType: string

    if (!users) {
      message = {
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTION.QUERY_ALL,
        correlationId: queryId.toString()
      }
      responseType = allResponse
    } else {
      message = {
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTION.QUERY,
        correlationId: queryId.toString(),
        parsedData: users
      }
      responseType = response
    }

    if (!this.queryEmitter.hasListeners(responseType)) {
      this.services.connection.sendMessage(message)
      this.services.timeoutRegistry.add({ message })
    }

    if (!callback) {
      return new Promise<QueryResult | IndividualQueryResult>((resolve, reject) => {
        this.queryEmitter.once(responseType, (error: { reason: string }, results: QueryResult | IndividualQueryResult) => {
          if (error) {
            reject(error)
            return
          }
          resolve(results)
        })
      })
    } else {
      this.queryEmitter.once(responseType, callback)
    }
  }

  public handle (message: Message): void {
    if (message.isAck) {
      this.services.timeoutRegistry.remove(message)
    } else if (message.action === PRESENCE_ACTION.QUERY_ALL_RESPONSE) {
      this.queryEmitter.emit(allResponse, null, message.parsedData)
      this.services.timeoutRegistry.remove(message)
    } else if (message.action === PRESENCE_ACTION.QUERY_RESPONSE) {
      this.queryEmitter.emit(response, null, message.parsedData)
      this.services.timeoutRegistry.remove(message)
    } else if (message.action === PRESENCE_ACTION.PRESENCE_JOIN) {
      message.name = message.name as string
      this.subscriptionEmitter.emit(allSubscribe, message.name, true)
      this.subscriptionEmitter.emit(message.name, true, message.name)
    } else if (message.action === PRESENCE_ACTION.PRESENCE_LEAVE) {
      message.name = message.name as string
      this.subscriptionEmitter.emit(allSubscribe, message.name, false)
      this.subscriptionEmitter.emit(message.name, false, message.name)
    }
  }

  private globalSubscription (action: PRESENCE_ACTION.SUBSCRIBE_ALL | PRESENCE_ACTION.UNSUBSCRIBE_ALL, callback: SubscribeCallback) {
    if (action === PRESENCE_ACTION.SUBSCRIBE_ALL) {
      this.subscriptionEmitter.on(allSubscribe, callback)
    } else {
      this.subscriptionEmitter.off(allSubscribe, callback)
    }
    const message = {
      topic: TOPIC.PRESENCE,
      action: action
    }
    if (this.services.connection.isConnected) {
      this.services.timeoutRegistry.add({ message })
      this.services.connection.sendMessage(message)
    }
  }

  private bulkSubscription (action: PRESENCE_ACTION.SUBSCRIBE | PRESENCE_ACTION.UNSUBSCRIBE, names: string[]) {
    const correlationId = this.counter++
    const message: Message = {
      topic: TOPIC.PRESENCE,
      action,
      correlationId: correlationId.toString(),
      parsedData: names
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
    if (subUsers.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.SUBSCRIBE, subUsers)
      this.pendingSubscribes.clear()
    }
    const unsubUsers = Array.from(this.pendingUnsubscribes.keys())
    if (unsubUsers.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.UNSUBSCRIBE, subUsers)
      this.pendingUnsubscribes.clear()
    }
    this.flushTimeout = null
  }

  private resubscribe () {
    const keys = Object.keys(this.subscriptionEmitter._callbacks || {})
    const index = keys.indexOf(allSubscribe)
    if (index !== -1) {
      keys.splice(index, 1)
      const callback = this.subscriptionEmitter._callbacks[keys[index]] as SubscribeCallback
      this.globalSubscription(PRESENCE_ACTION.SUBSCRIBE_ALL, callback)
    }
    if (keys.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.SUBSCRIBE, keys)
    }
    if (!this.flushTimeout) {
      this.flushTimeout = this.services.timerRegistry.add({
        duration: 0,
        context: this,
        callback: this.flush
      })
    }
  }
}
