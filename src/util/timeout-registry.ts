import { Services } from '../client'
import { Options } from '../client-options'
import { EVENT, CONNECTION_STATE, RPC_ACTION, RECORD_ACTION } from '../constants'
import * as EventEmitter from 'component-emitter2'

export interface Timeout {
    event?: EVENT | RPC_ACTION | RECORD_ACTION
    message: Message,
    callback?: (event: EVENT | RPC_ACTION | RECORD_ACTION, message: Message) => void,
    duration?: number
}

interface InternalTimeout {
  timerId: number,
  uniqueName: string,
  timeout: Timeout
}

/**
 * Subscriptions to events are in a pending state until deepstream acknowledges
 * them. This is a pattern that's used by numerour classes. This registry aims
 * to centralise the functionality necessary to keep track of subscriptions and
 * their respective timeouts.
 */
export class TimeoutRegistry extends EventEmitter {
    private options: Options
    private services: Services
    private register: Map<number, InternalTimeout>
    private counter: number

    constructor (services: Services, options: Options) {
        super()
        this.options = options
        this.services = services
        this.register = new Map()
        // services.connection.on(EVENT.CONNECTION_STATE_CHANGED, this.onConnectionStateChanged.bind(this))
    }

    /**
     * Add an entry
     */
    public add (timeout: Timeout): number {
      if (timeout.duration === undefined) {
        timeout.duration = this.options.subscriptionTimeout
      }
      if (timeout.event === undefined) {
        timeout.event = EVENT.ACK_TIMEOUT
      }

      if (this.services.connection.getConnectionState() !== CONNECTION_STATE.OPEN || timeout.duration < 1) {
        return -1
      }

      this.remove(timeout.message)

      const internalTimeout: InternalTimeout = Object.assign({}, {
        timerId: -1,
        uniqueName: this.getUniqueName(timeout.message),
        event: timeout.event
      }, { timeout })

      internalTimeout.timerId = this.services.timerRegistry.add({
        context: this,
        callback: this.onTimeout,
        duration: timeout.duration,
        data: internalTimeout
      })
      this.register.set(internalTimeout.timerId, internalTimeout)
      return internalTimeout.timerId
  }

  /**
   * Remove an entry
   */
  public remove (message: Message): void {
    const uniqueName = this.getUniqueName(message)
    for (const [timerId, timeout] of this.register) {
      if (timeout.uniqueName === uniqueName) {
        clearTimeout(timerId)
        this.register.delete(timerId)
      }
    }
  }

  /**
   * Processes an incoming ACK-message and removes the corresponding subscription
   */
  public clear (timerId: number): void {
    this.services.timerRegistry.remove(timerId)
    this.register.delete(timerId)
  }

  /**
   * Will be invoked if the timeout has occured before the ack message was received
   *
   * @param {Object} name The timeout object registered
   */
  private onTimeout (internalTimeout: InternalTimeout): void {
    this.register.delete(internalTimeout.timerId)
    const timeout = internalTimeout.timeout

    if (timeout.callback) {
      timeout.callback(timeout.event as EVENT, timeout.message)
    } else {
      this.services.logger.warn(timeout.message, timeout.event)
    }
  }

  /**
   * Returns a unique name from the timeout
   */
  private getUniqueName (message: Message): string {
    return message.topic + message.action + (message.name ? message.name : '')
  }

  /**
   * Remote all timeouts when connection disconnects
   */
  private onConnectionStateChanged (connectionState: CONNECTION_STATE): void {
    if (connectionState !== CONNECTION_STATE.OPEN) {
      for (const [ timerId, timer ] of this.register) {
        clearTimeout(timer.timerId)
        this.register.delete(timer.timerId)
      }
    }
  }
}
