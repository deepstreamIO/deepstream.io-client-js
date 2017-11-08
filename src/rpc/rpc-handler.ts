import { Services } from '../client'
import { Options } from '../client-options'
import { TOPIC, RPC_ACTIONS as RPC_ACTION, RPCMessage } from '../../binary-protocol/src/message-constants'
import { EVENT } from '../constants'
import { RPC, RPCMakeCallback } from '../rpc/rpc'
import { RPCResponse } from '../rpc/rpc-response'
import { getUid } from '../util/utils'

import * as Emitter from 'component-emitter2'

export type RPCProvider = (rpcData: any, response: RPCResponse) => void

export class RPCHandler {
  private services: Services
  private options: Options
  private rpcs: Map<string, RPC>
  private providers: Map<string, RPCProvider>

  constructor (services: Services, options: Options) {
    this.services = services
    this.options = options

    this.rpcs = new Map<string, RPC>()
    this.providers = new Map<string, RPCProvider>()
    this.services.connection.registerHandler(TOPIC.RPC, this.handle.bind(this))
  }

  /**
   * Registers a callback function as a RPC provider. If another connected client calls
   * client.rpc.make() the request will be routed to this method
   *
   * The callback will be invoked with two arguments:
   *     {Mixed} data The data passed to the client.rpc.make function
   *     {RpcResponse} rpcResponse An object with methods to response,
   *                               acknowledge or reject the request
   *
   * Only one callback can be registered for a RPC at a time
   *
   * Please note: Deepstream tries to deliver data in its original format.
   * Data passed to client.rpc.make as a String will arrive as a String,
   * numbers or implicitly JSON serialized objects will arrive in their
   * respective format as well
   */
  public provide (name: string, callback: RPCProvider): void {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }
    if (this.providers.has(name)) {
      throw new Error(`RPC ${name} already registered`)
    }
    if (typeof callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    const message = {
      topic: TOPIC.RPC,
      action: RPC_ACTION.PROVIDE,
      name
    }
    this.services.timeoutRegistry.add({ message })
    this.services.connection.sendMessage(message)
    this.providers.set(name, callback)
  }

  /**
   * Unregisters this client as a provider for a remote procedure call
   */
  public unprovide (name: string) {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }

    if (this.providers.has(name)) {
      this.providers.delete(name)
      const message = {
        topic: TOPIC.RPC,
        action: RPC_ACTION.UNPROVIDE,
        name
      }
      this.services.timeoutRegistry.add({ message })
      this.services.connection.sendMessage(message)
    }
  }

  /**
   * Executes the actual remote procedure call
   *
   * @param   {String}   name     The name of the rpc
   * @param   {Mixed}    data     Serializable data that will be passed to the provider
   * @param   {Function} callback Will be invoked with the returned result or if the rpc failed
   *                              receives to arguments: error or null and the result
   */
  public make (name: string, data: any, callback?: RPCMakeCallback): Promise<any> | undefined {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }
    if (callback && typeof callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    if (this.services.connection.isConnected === false) {
      if (callback) {
        this.services.timerRegistry.requestIdleCallback(callback.bind(this, EVENT.CLIENT_OFFLINE))
        return
      }
      return Promise.reject(EVENT.CLIENT_OFFLINE)
    }

    const correlationId = getUid()

    this.services.connection.sendMessage({
      topic: TOPIC.RPC,
      action: RPC_ACTION.REQUEST,
      correlationId,
      name,
      parsedData: data
    })

    if (callback) {
      this.rpcs.set(correlationId, new RPC(name, correlationId, callback, this.options, this.services))
      return
    }

    return new Promise((resolve, reject) => {
      this.rpcs.set(correlationId, new RPC(name, correlationId, (error: string, result: any) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }, this.options, this.services))
    })
  }

  /**
   * Handles incoming rpc REQUEST messages. Instantiates a new response object
   * and invokes the provider callback or rejects the request if no rpc provider
   * is present (which shouldn't really happen, but might be the result of a race condition
   * if this client sends a unprovide message whilst an incoming request is already in flight)
   */
  private respondToRpc (message: RPCMessage) {
    const provider = this.providers.get(message.name)
    if (provider) {
      provider(message.parsedData, new RPCResponse(message, this.options, this.services))
    } else {
      this.services.connection.sendMessage({
        topic: TOPIC.RPC,
        action: RPC_ACTION.REJECT,
        name: message.name,
        correlationId: message.correlationId
      })
    }
  }

  /**
   * Distributes incoming messages from the server
   * based on their action
   */
  private handle (message: RPCMessage): void {
    // RPC Requests
    if (message.action === RPC_ACTION.REQUEST) {
      this.respondToRpc(message)
      return
    }

    // RPC subscription Acks
    if (message.isAck) {
      this.services.timeoutRegistry.remove(message)
      return
    }

    // handle auth/denied subscription errors
    if (message.action === RPC_ACTION.MESSAGE_PERMISSION_ERROR || message.action === RPC_ACTION.MESSAGE_DENIED) {
      if (message.originalAction === RPC_ACTION.PROVIDE || message.originalAction === RPC_ACTION.UNPROVIDE) {
        this.services.timeoutRegistry.remove(message)
        this.providers.delete(message.name)
        this.services.logger.warn(message)
        return
      }
      if (message.originalAction === RPC_ACTION.REQUEST) {
        const rpcInvalid = this.getRPC(message)
        if (!rpcInvalid) {
          return
        }
        rpcInvalid.error(RPC_ACTION[message.action])
        this.rpcs.delete(message.correlationId)
        return
      }
      return
    }

    // RPC Responses
    const rpc = this.getRPC(message)
    if (rpc) {
      if (message.action === RPC_ACTION.ACCEPT) {
        rpc.accept()
        return
      } else if (message.action === RPC_ACTION.RESPONSE) {
        rpc.respond(message.parsedData)
      } else if (message.action === RPC_ACTION.REQUEST_ERROR) {
        rpc.error(message.parsedData)
      } else if (
        message.action === RPC_ACTION.RESPONSE_TIMEOUT ||
        message.action === RPC_ACTION.NO_RPC_PROVIDER
      ) {
        rpc.error(RPC_ACTION[message.action])
      }
      this.rpcs.delete(message.correlationId as string)
    }
  }

  private getRPC (message: RPCMessage): RPC | undefined {
    const rpc = this.rpcs.get(message.correlationId as string)
    if (rpc === undefined) {
      this.services.logger.error(message, EVENT.UNKNOWN_CORRELATION_ID)
    }
    return rpc
  }

}
