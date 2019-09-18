import { Services } from '../deepstream-client'
import { Options } from '../client-options'
import { EVENT, RESPONSE_TO_REQUEST } from '../constants'

import { Emitter } from '../util/emitter'
import { RECORD_ACTION, RPC_ACTION } from '@deepstream/protobuf/dist/types/all'
import { Message } from '@deepstream/protobuf/dist/types/messages'

export type TimeoutId = string | null
export type TimeoutAction = EVENT | RPC_ACTION | RECORD_ACTION

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
export class TimeoutRegistry extends Emitter {
  private register: Map<string, InternalTimeout> = new Map()

  constructor (private services: Services, private options: Options) {
    super()
  }

  /**
   * Add an entry
   */
  public add (timeout: Timeout): TimeoutId {
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
      return null
    }

    this.remove(timeout.message)

    const internalTimeout: InternalTimeout = {
      timerId: -1,
      uniqueName: this.getUniqueName(timeout.message)!,
      // event: timeout.event,
      timeout
    }

    internalTimeout.timerId = this.services.timerRegistry.add({
        context: this,
        callback: this.onTimeout,
        duration: timeout.duration!,
        data: internalTimeout
    })
    this.register.set(internalTimeout.uniqueName, internalTimeout)
    return internalTimeout.uniqueName
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
      requestMsg = { ...message, action }
    }
    const uniqueName = this.getUniqueName(requestMsg)
    this.clear(uniqueName)
  }

  /**
   * Processes an incoming ACK-message and removes the corresponding subscription
   */
  public clear (uniqueName: TimeoutId): void {
    const timeout = this.register.get(uniqueName!)
    if (timeout) {
      this.register.delete(uniqueName!)
      this.services.timerRegistry.remove(timeout.timerId)
    }
  }

  /**
   * Will be invoked if the timeout has occured before the ack message was received
   */
  private onTimeout (internalTimeout: InternalTimeout): void {
    this.register.delete(internalTimeout.uniqueName)
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
  private getUniqueName (message: Message): TimeoutId {
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
    for (const [ uniqueName, timeout ] of this.register) {
      this.services.timerRegistry.remove(timeout.timerId)
      this.register.delete(uniqueName)
    }
  }
}
