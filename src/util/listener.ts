import { TOPIC, EVENT_ACTION, RECORD_ACTION, EVENT } from '../constants'
import { Services } from '../client'

export interface ListenResponse {
  accept: () => void
  reject: (reason?: string) => void
  onStop: (subscriptionName: string, callback: Function) => void
}

export type ListenCallback = (subscriptionName: string, listenResponse: ListenResponse) => void

export class Listener {
  private topic: TOPIC
  private actions: any
  private services: Services
  private listeners: Map<string, ListenCallback> // <patterm, callback>
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
  }

  public listen (pattern: string, callback: ListenCallback): void {
    if (this.listeners.has(pattern)) {
      this.services.logger.warn({
        topic: this.topic,
        action: this.actions.LISTENER_EXISTS,
        name: pattern
      })
      return
    }

    this.listeners.set(pattern, callback)
    this.sendListen(pattern)
  }

  public unlisten (pattern: string): void {
    if (!this.listeners.has(pattern)) {
      this.services.logger.warn({
        topic: this.topic,
        action: this.actions.NOT_LISTENING,
        name: pattern
      })
      return
    }

    this.listeners.delete(pattern)
    this.sendUnlisten(pattern)
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

  public handle (message: Message) {
    const pattern = message.name as string
    if (message.action === this.actions.SUBSCRIPTION_FOR_PATTERN_FOUND) {
      const listener = this.listeners.get(pattern)
      if (listener) {
        listener(
          message.subscription as string, {
            accept: this.accept.bind(this, pattern, message.subscription),
            reject: this.reject.bind(this, pattern, message.subscription),
            onStop: this.stop.bind(this, pattern, message.subscription)
          }
        )
      }
      return
    } else if (message.action === this.actions.SUBSCRIPTION_FOR_PATTERN_REMOVED) {
      const stopCallback = this.stopCallbacks.get(message.subscription as string)
      if (stopCallback) {
        stopCallback()
      } else {
          // warn no stop callback provided ?
      }
      return
    }

    this.services.logger.error(message, EVENT.UNSOLICITED_MESSAGE)
  }

}
