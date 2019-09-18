import { EVENT, TOPIC, ListenMessage, RECORD_ACTION, EVENT_ACTION } from '../constants'
import { Services } from '../deepstream-client'

export interface ListenResponse {
  accept: () => void
  reject: (reason?: string) => void
  onStop: (callback: (subscriptionName: string) => void) => void
}

export type ListenCallback = (subscriptionName: string, listenResponse: ListenResponse) => void

export class Listener {
  private topic: TOPIC
  private actions: any
  private services: Services
  private listeners: Map<string, ListenCallback> // <pattern, callback>
  private stopCallbacks: Map<string, Function> // <subscription, callback>

  constructor (topic: TOPIC, services: Services) {
    this.topic = topic
    this.services = services
    this.listeners = new Map<string, ListenCallback>()
    this.stopCallbacks = new Map<string, Function>()

    if (topic === TOPIC.RECORD) {
      this.actions = RECORD_ACTION
    } else if (topic === TOPIC.EVENT) {
      this.actions = EVENT_ACTION
    }

    this.services.connection.onLost(this.onConnectionLost.bind(this))
    this.services.connection.onReestablished(this.onConnectionReestablished.bind(this))
  }

  public listen (pattern: string, callback: ListenCallback): void {
    if (typeof pattern !== 'string' || pattern.length === 0) {
      throw new Error('invalid argument pattern')
    }
    if (typeof callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    if (this.listeners.has(pattern)) {
      this.services.logger.warn({
        topic: this.topic,
        action: this.actions.LISTEN,
        name: pattern
      }, EVENT.LISTENER_EXISTS)
      return
    }

    this.listeners.set(pattern, callback)
    this.sendListen(pattern)
  }

  public unlisten (pattern: string): void {
    if (typeof pattern !== 'string' || pattern.length === 0) {
      throw new Error('invalid argument pattern')
    }

    if (!this.listeners.has(pattern)) {
      this.services.logger.warn({
        topic: this.topic,
        action: this.actions.UNLISTEN,
        name: pattern
      }, EVENT.NOT_LISTENING)
      return
    }

    this.listeners.delete(pattern)
    this.sendUnlisten(pattern)
  }

  /*
 * Accepting a listener request informs deepstream that the current provider is willing to
 * provide the record or event matching the subscriptionName . This will establish the current
 * provider as the only publisher for the actual subscription with the deepstream cluster.
 * Either accept or reject needs to be called by the listener
 */
  private accept (pattern: string, subscription: string): void {
    this.services.connection.sendMessage({
      topic: this.topic,
      action: this.actions.LISTEN_ACCEPT,
      name: pattern,
      subscription
    })
  }

 /*
 * Rejecting a listener request informs deepstream that the current provider is not willing
 * to provide the record or event matching the subscriptionName . This will result in deepstream
 * requesting another provider to do so instead. If no other provider accepts or exists, the
 * resource will remain unprovided.
 * Either accept or reject needs to be called by the listener
 */
  private reject (pattern: string, subscription: string): void {
    this.services.connection.sendMessage({
      topic: this.topic,
      action: this.actions.LISTEN_REJECT,
      name: pattern,
      subscription
    })
  }

  private stop (subscription: string, callback: Function): void {
    this.stopCallbacks.set(subscription, callback)
  }

  public handle (message: ListenMessage) {
    if (message.isAck) {
      this.services.timeoutRegistry.remove(message)
      return
    }
    if (message.action === this.actions.SUBSCRIPTION_FOR_PATTERN_FOUND) {
      const listener = this.listeners.get(message.name as string)
      if (listener) {
        listener(
          message.subscription as string, {
            accept: this.accept.bind(this, message.name, message.subscription),
            reject: this.reject.bind(this, message.name, message.subscription),
            onStop: this.stop.bind(this, message.subscription)
          }
        )
      }
      return
    }

    if (message.action === this.actions.SUBSCRIPTION_FOR_PATTERN_REMOVED) {
      const stopCallback = this.stopCallbacks.get(message.subscription as string)
      if (stopCallback) {
        stopCallback(message.subscription)
        this.stopCallbacks.delete(message.subscription as string)
      }
      return
    }

    this.services.logger.error(message, EVENT.UNSOLICITED_MESSAGE)
  }

  private onConnectionLost () {
    this.stopCallbacks.forEach((callback, subscription) => {
      callback(subscription)
    })
    this.stopCallbacks.clear()
  }

  private onConnectionReestablished () {
    this.listeners.forEach((callback, pattern) => {
      this.sendListen(pattern)
    })
  }

  /*
  * Sends a C.ACTIONS.LISTEN to deepstream.
  */
  private sendListen (pattern: string): void {
    const message = {
      topic: this.topic,
      action: this.actions.LISTEN,
      name: pattern
    }
    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
  }

  private sendUnlisten (pattern: string): void {
    const message = {
      topic: this.topic,
      action: this.actions.UNLISTEN,
      name: pattern
    }
    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
  }
}
