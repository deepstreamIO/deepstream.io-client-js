import { RECORD_ACTIONS, Message } from '../../binary-protocol/src/message-constants'
import { ACTION_TO_WRITE_ACK } from '../../binary-protocol/src/utils'

import { EVENT } from '../constants'
import { Services } from '../client'
import { WriteAckCallback } from './record-core'

/**
 * @param {Services} services
 *
 * @constructor
 */
export class WriteAcknowledgementService {

  private services: Services
  private responses: Map<string, Function>
  private count: number

  constructor (services: Services) {
    this.services = services
    this.responses = new Map<string, WriteAckCallback>()
    this.count = 1

    this.services.connection.onLost(this.onConnectionLost.bind(this))
  }

    /**
   * Send message with write ack callback.
   *
   * @param {Message} message
   * @param {Function} callback
   *
   * @public
   * @returns {void}
   */
  public send (message: Message, callback: WriteAckCallback): void {
    if (this.services.connection.isConnected === false) {
      this.services.timerRegistry.requestIdleCallback(callback.bind(this, EVENT.CLIENT_OFFLINE))
      return
    }
    const correlationId = this.count.toString()
    this.responses.set(correlationId, callback)
    this.services.connection.sendMessage(Object.assign({}, message, { correlationId, action: ACTION_TO_WRITE_ACK[message.action] } ))
    this.count++
  }

  public recieve (message: Message): void {
    const id = message.correlationId as string
    const response = this.responses.get(id)
    if (
      !response ||
      (message.action !== RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT && !message.isError)
    ) {
      return
    }

    message.isError
      ? response(RECORD_ACTIONS[message.action as RECORD_ACTIONS])
      : response(null)

    this.responses.delete(id)
  }

  private onConnectionLost (): void {
    this.responses.forEach(response => response(EVENT.CLIENT_OFFLINE))
    this.responses.clear()
  }
}
