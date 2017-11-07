import { Services } from '../client'
import { Options } from '../client-options'
import { TOPIC, PRESENCE_ACTIONS as PRESENCE_ACTION, PresenceMessage, Message } from '../../binary-protocol/src/message-constants'

import * as Emitter from 'component-emitter2'

const allResponse: string = PRESENCE_ACTION.QUERY_ALL_RESPONSE.toString()
const response: string = PRESENCE_ACTION.QUERY_ALL.toString()
const allSubscribe: string = PRESENCE_ACTION.SUBSCRIBE_ALL.toString()
const subscribe: string = PRESENCE_ACTION.SUBSCRIBE.toString()
const allUnsubscribe: string = PRESENCE_ACTION.UNSUBSCRIBE_ALL.toString()
const unsubscribe: string = PRESENCE_ACTION.UNSUBSCRIBE.toString()

export type QueryCallback = (users: string[]) => void
export type SubscribeCallback = (user: string, online: boolean) => void

type PendingSubscriptions = { [key: string]: boolean, user: boolean } | { [key: string]: boolean }

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

export class PresenceHandler {
  private services: Services
  private subscriptionEmitter: Emitter
  private queryEmitter: Emitter
  private options: Options
  private counter: number
  private pendingSubscribes: PendingSubscriptions
  private pendingUnsubscribes: PendingSubscriptions
  private flushTimeout: WindowTimers | NodeJS.Timer | null

  constructor (services: Services, options: Options) {
    this.services = services
    this.options = options
    this.subscriptionEmitter = new Emitter()
    this.queryEmitter = new Emitter()
    this.services.connection.registerHandler(TOPIC.PRESENCE, this.handle.bind(this))
    this.counter = 0
    this.pendingSubscribes = {}
    this.pendingUnsubscribes = {}
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
    
    this.pendingSubscribes[userId] = true
    this.subscriptionEmitter.on(userId, cb)
    if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(this.flush, 0)
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

    this.pendingUnsubscribes[userId] = true
    this.subscriptionEmitter.off(userId, cb)
    if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(this.flush, 0)
    }
  }

  public getAll (callback: QueryCallback): void
  public getAll (users: string[], callback: QueryCallback) : void
  public getAll (users: string[] | QueryCallback, callback?: QueryCallback)  : void {
    let userIds: string[] | undefined
    let cb: QueryCallback
    if (typeof users === 'function' && callback === undefined) {
      cb = users
    } else if (Array.isArray(users) && typeof callback === 'function') {
      userIds = users
      cb = callback
    } else {
      throw new Error('invalid arguments: "users" or "callback"')
    }

    const queryId = this.counter++
    let message: PresenceMessage
    let responseType: string

    if (!userIds) {
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
        parsedData: userIds
      }
      responseType = response
    }

    if (!this.queryEmitter.hasListeners(responseType)) {
      this.queryEmitter.once(responseType, cb)
      this.services.connection.sendMessage(message)
      this.services.timeoutRegistry.add({ message })
    }
  }

  // tslint:disable-next-line:no-empty
  public handle (message: Message): void {
    if (message.isAck) {
      this.services.timeoutRegistry.remove(message)
    } else if (message.action === PRESENCE_ACTION.QUERY_ALL_RESPONSE) {
      this.queryEmitter.emit(allResponse, message.parsedData)
      this.services.timeoutRegistry.remove(message)
    } else if (message.action === PRESENCE_ACTION.QUERY_RESPONSE) {
      this.queryEmitter.emit(response, message.parsedData)
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
    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
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
    const subUsers = Object.keys(this.pendingSubscribes)
    if (subUsers.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.SUBSCRIBE, subUsers)
      this.pendingSubscribes = {}
    }
    const unsubUsers = Object.keys(this.pendingUnsubscribes)
    if (unsubUsers.length > 0) {
      this.bulkSubscription(PRESENCE_ACTION.UNSUBSCRIBE, subUsers)
      this.pendingUnsubscribes = {}
    }
    this.flushTimeout = null
  }
}
