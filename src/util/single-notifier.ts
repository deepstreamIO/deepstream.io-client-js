import { TOPIC, Message, EVENT_ACTIONS, ALL_ACTIONS } from '../../binary-protocol/src/message-constants'

import { Services, Client, EVENT } from '../client'
import { Options } from '../client-options'

export interface SingleNotifierResponse {
  callback?: (error?: any, result?: any) => void,
  resolve?: (result: any) => void,
  reject?: (error: any) => void,
}

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
export class SingleNotifier {

  private services: Services
  private options: Options
  private requests: Map<string, Array<SingleNotifierResponse>>
  private action: ALL_ACTIONS
  private topic: TOPIC
  private timeoutDuration: number

  constructor (services: Services, options: Options, topic: TOPIC, action: ALL_ACTIONS, timeoutDuration: number) {
    this.services = services
    this.options = options
    this.topic = topic
    this.action = action
    this.timeoutDuration = timeoutDuration
    this.requests = new Map<string, Array<SingleNotifierResponse>>()
  }

    /**
   * Add a request. If one has already been made it will skip the server request
   * and multiplex the response
   *
   * @param {String} name An identifier for the request, e.g. a record name
   * @param {Object} response An object with property `callback` or `resolve` and `reject`
   *
   * @public
   * @returns {void}
   */
  public request (name: string, response: SingleNotifierResponse): void {
    if (this.services.connection.isConnected === false) {
      if (response.callback) {
        this.services.timerRegistry.requestIdleCallback(response.callback.bind(this, EVENT.CLIENT_OFFLINE))
      } else if (response.reject) {
        response.reject(EVENT.CLIENT_OFFLINE)
      }
      return
    }
    const message = {
      topic: this.topic,
      action: this.action,
      name
    }
    this.services.timeoutRegistry.add({ message })
    const req = this.requests.get(name)
    if (req === undefined) {
      this.requests.set(name, [response])
      this.services.connection.sendMessage(message)
    } else {
      req.push(response)
    }
  }

  public recieve (message: Message, error?: any, data?: any): void {
    const name = message.name as string
    const responses = this.requests.get(name)
    if (!responses) {
      this.services.logger.error(message, EVENT.UNSOLICITED_MESSAGE)
      return
    }

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i]
      if (response.callback) {
        response.callback(error, data)
      } else if (error && response.reject) {
        response.reject(data)
      } else if (response.resolve) {
        response.resolve(data)
      }
    }
    this.requests.delete(name)
  }
}
