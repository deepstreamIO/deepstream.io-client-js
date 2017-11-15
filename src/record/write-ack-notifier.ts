import { RECORD_ACTIONS, Message } from '../../binary-protocol/src/message-constants'

import { Services, Client, EVENT } from '../client'
import { Options } from '../client-options'
import { WriteAckCallback } from './record-core'

/**
 * Provides a scaffold for subscriptionless requests to deepstream, such as the SNAPSHOT
 * and HAS functionality. The SingleNotifier multiplexes all the client requests so
 * that they can can be notified at once, and also includes reconnection funcionality
 * incase the connection drops.
 *
 * @param {Services} services          The deepstream client
 * @param {Options} options     Function to call to allow resubscribing
 *
 * @constructor
 */
export class WriteAckNotifier {

  private services: Services
  private responses: Map<string, Function>
  private count: number

  constructor (services: Services) {
    this.services = services
    this.responses = new Map<string, WriteAckCallback>()
    this.count = 1
  }

    /**
   * Add a write ack nofity callback.
   *
   * @param {String} name An identifier for the request, e.g. a record name
   * @param {Object} callback An object with property `callback` or `resolve` and `reject`
   *
   * @public
   * @returns {void}
   */
  public send (message: Message, callback: WriteAckCallback): void {
    if (this.services.connection.isConnected === false) {
      this.services.timerRegistry.requestIdleCallback(callback.bind(this, EVENT.CLIENT_OFFLINE))
      return
    } else {
      const correlationId = this.count.toString()
      this.responses.set(correlationId, callback)
      this.services.connection.sendMessage(Object.assign({}, message, { correlationId } ))

      this.count++
    }

  }

  public recieve (message: Message): void {
    const id = message.correlationId as string
    const response = this.responses.get(id)
    if (!response || message.action !== RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT) {
      this.services.logger.error(message, EVENT.UNSOLICITED_MESSAGE)
      return
    }

    message.isError
      ? response(RECORD_ACTIONS[message.action as RECORD_ACTIONS])
      : response(null)

    this.responses.delete(id)
  }

  private onConnectionLost (): void {
    this.responses.forEach(response => {

    })
  }

}
