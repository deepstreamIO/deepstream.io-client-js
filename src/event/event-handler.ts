import { Services } from '../client'
import { Options } from '../client-options'
import {
  TOPIC,
  EVENT_ACTIONS as EVENT_ACTION,
  EventMessage,
  ListenMessage
} from '../../binary-protocol/src/message-constants'
import { EVENT } from '../constants'
import { Listener, ListenCallback } from '../util/listener'
import * as Emitter from 'component-emitter2'

export class EventHandler {

  private services: Services
  private emitter: Emitter
  private listeners: Listener
  private limboQueue: Array<EventMessage>

  constructor (services: Services, options: Options, listeners?: Listener) {
    this.services = services
    this.listeners = listeners || new Listener(TOPIC.EVENT, services)
    this.emitter = new Emitter()
    this.limboQueue = []
    this.services.connection.registerHandler(TOPIC.EVENT, this.handle.bind(this))
    this.services.connection.onExitLimbo(this.onExitLimbo.bind(this))
    this.services.connection.onReestablished(this.onConnectionReestablished.bind(this))
  }

  /**
  * Subscribe to an event. This will receive both locally emitted events
  * as well as events emitted by other connected clients.
  */
  public subscribe (name: string, callback: (data: any) => void) {
    if (typeof name !== 'string' || name.length === 0) {
        throw new Error('invalid argument name')
    }
    if (typeof callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    if (!this.emitter.hasListeners(name)) {
      if (this.services.connection.isConnected) {
        this.sendSubscriptionMessage(name)
      }
    }
    this.emitter.on(name, callback)
  }

/**
 * Removes a callback for a specified event. If all callbacks
 * for an event have been removed, the server will be notified
 * that the client is unsubscribed as a listener
 */
public unsubscribe (name: string, callback: (data: any) => void): void {
    if (!name || typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }
    if (callback !== undefined && typeof callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    if (!this.emitter.hasListeners(name)) {
      this.services.logger.warn({
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.NOT_SUBSCRIBED,
        name
      })
      return
    }

    this.emitter.off(name, callback)

    if (!this.emitter.hasListeners(name)) {
      const message = {
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.UNSUBSCRIBE,
        name
      }
      this.services.timeoutRegistry.add({ message })
      this.services.connection.sendMessage(message)
    }
  }

  /**
   * Emits an event locally and sends a message to the server to
   * broadcast the event to the other connected clients
   */
  public emit (name: string, data: any): void {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }

    const message = {
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.EMIT,
      name,
      parsedData: data
    }

    if (this.services.connection.isConnected) {
      this.services.connection.sendMessage(message)
    } else if (this.services.connection.isInLimbo) {
      this.limboQueue.push(message)
    }

    this.emitter.emit(name, data)
  }

  /**
 * Allows to listen for event subscriptions made by this or other clients. This
 * is useful to create "active" data providers, e.g. providers that only provide
 * data for a particular event if a user is actually interested in it
 */
public listen (pattern: string, callback: ListenCallback) {
  this.listeners.listen(pattern, callback)
}

/**
 * Removes a listener that was previously registered
 */
public unlisten (pattern: string) {
  this.listeners.unlisten(pattern)
}

  /**
 * Handles incoming messages from the server
 */
private handle (message: EventMessage): void {
    if (message.isAck) {
      this.services.timeoutRegistry.remove(message)
      return
    }

    if (message.action === EVENT_ACTION.EMIT) {
      if (message.parsedData !== undefined) {
        this.emitter.emit(message.name as string, message.parsedData)
      } else {
        this.emitter.emit(message.name as string, undefined)
      }
      return
    }

    if (message.action === EVENT_ACTION.MESSAGE_DENIED) {
      this.services.logger.error({ topic: TOPIC.EVENT }, EVENT_ACTION.MESSAGE_DENIED)
      this.services.timeoutRegistry.remove(message)
      if (message.originalAction === EVENT_ACTION.SUBSCRIBE) {
        this.emitter.off(message.name)
      }
      return
    }

    if (message.action === EVENT_ACTION.MULTIPLE_SUBSCRIPTIONS) {
      this.services.timeoutRegistry.remove(
        Object.assign({}, message, {
          action: EVENT_ACTION.SUBSCRIBE
        })
      )
      this.services.logger.warn(message)
      return
    }

    if (message.action === EVENT_ACTION.NOT_SUBSCRIBED) {
      this.services.timeoutRegistry.remove(
        Object.assign({}, message, {
          action: EVENT_ACTION.SUBSCRIBE
        })
      )
      this.services.logger.warn(message)
      return
    }

    if (
      message.action === EVENT_ACTION.SUBSCRIPTION_FOR_PATTERN_FOUND ||
      message.action === EVENT_ACTION.SUBSCRIPTION_FOR_PATTERN_REMOVED
    ) {
      this.listeners.handle(message as ListenMessage)
      return
    }

    if (message.action === EVENT_ACTION.INVALID_LISTEN_REGEX) {
      this.services.logger.error(message)
      return
    }

    this.services.logger.error(message, EVENT.UNSOLICITED_MESSAGE)
  }

  /**
   * Resubscribes to events when connection is lost
   */
  private onConnectionReestablished () {
    const callbacks = this.emitter.eventNames()
    for (const name of callbacks) {
      this.sendSubscriptionMessage(name)
    }
    for (let i = 0; i < this.limboQueue.length; i++) {
      this.services.connection.sendMessage(this.limboQueue[i])
    }
    this.limboQueue = []
  }

  private onExitLimbo () {
    this.limboQueue = []
  }

  private sendSubscriptionMessage (name: string) {
    const message = {
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.SUBSCRIBE,
      name
    }

    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
  }
}
