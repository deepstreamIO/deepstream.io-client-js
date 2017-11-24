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
  private messageQueue: Array<{ message: Message, success?: Function, failure?: Function }>
  private timeout: number | null

  constructor (options: Options, services: Services) {
    this.options = options
    this.services = services
    this.messageQueue = []
    this.onTimeout = this.onTimeout.bind(this)
    this.services.connection.onReestablished(this.flush.bind(this))
  }

  public submit (message: Message, successCallback?: Function, failureCallback?: Function): void {
    this.messageQueue.push({ message, success: successCallback, failure: failureCallback })
    if (!this.timeout) {
      this.timeout = this.services.timerRegistry.add({
        callback: this.onTimeout,
        duration: this.options.offlineBufferTimeout,
        context: this,
      })
    }
  }

  private flush (message: Message): void {
    for (let i = 0; i < this.messageQueue.length; i++) {
      const item = this.messageQueue[i]
      this.services.connection.sendMessage(this.messageQueue[i].message)
      if (item.success) {
        item.success()
      }
    }
    this.services.timerRegistry.remove(this.timeout as number)
    this.timeout = null
  }

  private onTimeout () {
    for (let i = 0; i < this.messageQueue.length; i++) {
      const msg = this.messageQueue[i]
      if (msg.failure) {
        msg.failure()
      }
    }
    this.messageQueue = []
    this.timeout = null
  }

}
