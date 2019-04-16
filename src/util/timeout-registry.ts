import { Services } from '../client'
import { Options } from '../client-options'
import { EVENT } from '../constants'
import {
  RECORD_ACTIONS as RECORD_ACTION,
  RPC_ACTIONS as RPC_ACTION,
  Message
} from '../../binary-protocol/src/message-constants'
import { RESPONSE_TO_REQUEST } from '../../binary-protocol/src/utils'

import * as EventEmitter from 'component-emitter2'

export type TimeoutAction = EVENT | RPC_ACTION | RECORD_ACTION;

export interface Timeout {
    event?: TimeoutAction
    message: Message,
    callback?: (event: TimeoutAction, message: Message) => void,
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

  constructor (services: Services, options: Options) {
    super()
    this.options = options
    this.services = services
    this.register = new Map()
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

    /*
    if (timeout.duration < 1) {
      should we throw an error?
      return -1
    }
    */

    if (!this.services.connection.isConnected) {
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
    }) as unknown as number
    this.register.set(internalTimeout.timerId, internalTimeout)
    return internalTimeout.timerId
  }

  /**
   * Remove an entry
   */
  public remove (message: Message): void {
    let requestMsg
    const action = RESPONSE_TO_REQUEST[message.topic][message.action]
    if (!action) {
      requestMsg = message
    } else {
      requestMsg = Object.assign({}, message, { action })
    }
    const uniqueName = this.getUniqueName(requestMsg)
    for (const [timerId, timeout] of this.register) {
      if (timeout.uniqueName === uniqueName) {
        this.services.timerRegistry.remove(timerId)
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
    const action = message.originalAction || message.action
    let name = `${message.topic}${action}_`
    if (message.correlationId) {
      name += message.correlationId
    } else if (message.name) {
      name += message.name
    }
    return name
  }

  /**
   * Remote all timeouts when connection disconnects
   */
  public onConnectionLost (): void {
    for (const [ timerId ] of this.register) {
      clearTimeout(timerId)
      this.register.delete(timerId)
    }
  }
}
