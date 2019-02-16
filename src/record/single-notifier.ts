import { TOPIC, Message, RECORD_ACTIONS as RECORD_ACTION } from '../../binary-protocol/src/message-constants'

import { EVENT } from '../constants'
import { Services } from '../client'

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
  private requests: Map<string, Array<(error?: any, result?: any) => void>>
  private action: RECORD_ACTION.READ | RECORD_ACTION.HEAD
  private internalRequests: Map<string, Array<(message: Message) => void>>
  private limboQueue: Array<Message>

  constructor (services: Services, action: RECORD_ACTION.READ | RECORD_ACTION.HEAD, timeoutDuration: number) {
    this.services = services
    this.action = action
    this.requests = new Map()
    this.internalRequests = new Map()
    this.limboQueue = []

    this.services.connection.onLost(this.onConnectionLost.bind(this))
    this.services.connection.onExitLimbo(this.onExitLimbo.bind(this))
    this.services.connection.onReestablished(this.onConnectionReestablished.bind(this))
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
  public request (name: string, callback: (error?: any, result?: any) => void): void {
    const message = {
      topic: TOPIC.RECORD,
      action: this.action,
      name
    }

    const req = this.requests.get(name)
    if (req) {
      req.push(callback)
      return
    }

    this.requests.set(name, [callback])

    if (this.services.connection.isConnected) {
      this.services.connection.sendMessage(message)
      this.services.timeoutRegistry.add({ message })
    } else if (this.services.connection.isInLimbo) {
      this.limboQueue.push(message)
    } else {
      callback(EVENT.CLIENT_OFFLINE)
    }
  }

  /**
   * Adds a callback to a (possibly) inflight request that will be called
   * on the response.
   */
  public register (name: string, callback: (message: Message) => void): void {
    const request = this.internalRequests.get(name)
    if (!request) {
      this.internalRequests.set(name, [callback])
    } else {
      request.push(callback)
    }
  }

  public recieve (message: Message, error?: any, data?: any): void {
    this.services.timeoutRegistry.remove(message)
    const name = message.name as string
    const responses = this.requests.get(name) || []
    const internalResponses = this.internalRequests.get(name) || []
    if (!responses && !internalResponses) {
      return
    }

    for (let i = 0; i < internalResponses.length; i++) {
      internalResponses[i](message)
    }
    this.internalRequests.delete(name)

    // todo we can clean this up and do cb = (error, data) => error ? reject(error) : resolve()
    for (let i = 0; i < responses.length; i++) {
      responses[i](error, data)
    }
    this.requests.delete(name)
    return
  }

  private onConnectionLost (): void {
    this.requests.forEach(responses => {
      responses.forEach(response => response(EVENT.CLIENT_OFFLINE))
    })
    this.requests.clear()
  }

  private onExitLimbo (): void {
    for (let i = 0; i < this.limboQueue.length; i++) {
      const message = this.limboQueue[i]
      const requests = this.requests.get(message.name as string)
      if (requests) {
        requests.forEach(cb => cb(EVENT.CLIENT_OFFLINE))
      }
    }
    this.requests.clear()
    this.limboQueue = []
  }

  private onConnectionReestablished (): void {
    for (let i = 0; i < this.limboQueue.length; i++) {
      const message = this.limboQueue[i]
      this.services.connection.sendMessage(message)
      this.services.timeoutRegistry.add({ message })
    }
  }
}
