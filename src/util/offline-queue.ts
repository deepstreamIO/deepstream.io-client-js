import { Services } from '../client'
import { Options } from '../client-options'
import { EVENT, CONNECTION_STATE } from '../constants'
import {
  TOPIC,
  RECORD_ACTIONS as RECORD_ACTION,
  RPC_ACTIONS as RPC_ACTION,
  Message
} from '../../binary-protocol/src/message-constants'
import { RESPONSE_TO_REQUEST } from '../../binary-protocol/src/utils'

import * as EventEmitter from 'component-emitter2'

/**
 * Allows building up a queue of operations to be done on reconnect. This
 * includes messages to be sent or functions to be run. Often it is helpful
 * to allow functions to be run to account for timeouts being set.
 */
export default class OfflineQueue {

  private options: Options
  private services: Services
  private messageQueue: Array<{ message: Message, callback?: Function }>
  private functionQueue: Array<Function>
  private timeout: number

  constructor (options: Options, services: Services) {
    this.options = options
    this.services = services
    this.messageQueue = []
    this.functionQueue = []
    this.onTimeout = this.onTimeout.bind(this)
  }

  public submitMessage (message: Message, failureCallback?: Function): void {
    this.messageQueue.push({ message, callback: failureCallback })
    if (!this.timeout) {
      this.timeout = this.services.timerRegistry.add({
        callback: this.onTimeout,
        duration: this.options.offlineBufferTimeout,
        context: this,
      })
    }
  }

  public submitFunction (callback: Function): void {
    this.functionQueue.push(callback)
    if (!this.timeout) {
      this.timeout = this.services.timerRegistry.add({
        callback: this.onTimeout,
        duration: this.options.offlineBufferTimeout,
        context: this,
      })
    }
  }

  public flush (message: Message): void {
    for (let i = 0; i < this.messageQueue.length; i++) {
      this.services.connection.sendMessage(this.messageQueue[i].message)
    }
    this.messageQueue = []
    for (let i = 0; i < this.functionQueue.length; i++) {
      this.functionQueue[i]()
    }
    this.services.timerRegistry.remove(this.timeout)
  }

  private onTimeout () {
    for (let i = 0; i < this.messageQueue.length; i++) {
      const msg = this.messageQueue[i]
      if (msg.callback) {
        msg.callback()
      }
    }
    this.messageQueue = []
    this.functionQueue = []
  }

}
