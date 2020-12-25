import { Services } from '../deepstream-client'
import { Options } from '../client-options'
import { EVENT, RPC_ACTION, TOPIC, RPCResult, RPCMessage, Message } from '../constants'
import { RPC, RPCMakeCallback } from '../rpc/rpc'
import { RPCResponse } from '../rpc/rpc-response'
import { getUid } from '../util/utils'
import { BulkSubscriptionService } from '../util/bulk-subscription-service'

export type RPCProvider = (rpcData: any, response: RPCResponse) => void

export class RPCHandler {
  private rpcs = new Map<string, RPC>()
  private providers = new Map<string, RPCProvider>()
  private limboQueue: Array<{ name: string, data: any, correlationId: string, callback: RPCMakeCallback }> = []
  private bulkSubscription: BulkSubscriptionService<RPC_ACTION>

  constructor (private services: Services, private options: Options) {
    this.bulkSubscription = new BulkSubscriptionService<RPC_ACTION>(
      this.services, options.subscriptionInterval, TOPIC.RPC,
      RPC_ACTION.PROVIDE, RPC_ACTION.UNPROVIDE,
      this.onBulkSubscriptionSent.bind(this)
    )

    this.services.connection.registerHandler(TOPIC.RPC, this.handle.bind(this))
    this.services.connection.onReestablished(this.onConnectionReestablished.bind(this))
    this.services.connection.onExitLimbo(this.onExitLimbo.bind(this))
    this.services.connection.onLost(this.onConnectionLost.bind(this))
  }

  /**
   * Returns the names of all the RPCs provided
   */
  public providerNames (): string[] {
    return [...this.providers.keys()]
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

    this.providers.set(name, callback)
    if (this.services.connection.isConnected) {
      this.bulkSubscription.subscribe(name)
    }
  }

  /**
   * Unregisters this client as a provider for a remote procedure call
   */
  public unprovide (name: string) {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }

    if (!this.providers.has(name)) {
      this.services.logger.warn({
        topic: TOPIC.RPC,
        action: RPC_ACTION.NOT_PROVIDED,
        name
      })
      return
    }

    this.providers.delete(name)
    if (this.services.connection.isConnected) {
      this.bulkSubscription.unsubscribe(name)
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
  public make (name: string, data: any): Promise<any>
  public make (name: string, data: any, callback: RPCMakeCallback): void
  public make (name: string, data: any, callback?: RPCMakeCallback): Promise<any> | void {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }
    if (callback && typeof callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    const correlationId = getUid()

    if (this.services.connection.isConnected) {
      if (callback) {
        this.rpcs.set(correlationId, new RPC(name, correlationId, data, callback, this.options, this.services))
        return
      }

      return new Promise((resolve, reject) => {
        this.rpcs.set(
          correlationId,
          new RPC(
            name,
            correlationId,
            data,
            (error: string | null, result: any) => error ? reject(error) : resolve(result),
            this.options,
            this.services
          )
        )
      })
    } else if (this.services.connection.isInLimbo) {
      if (callback) {
        this.limboQueue.push({ correlationId, name, data, callback })
      } else {
        return new Promise((resolve, reject) => {
          this.limboQueue.push({ correlationId, name, data, callback: (error: string | null, result?: RPCResult) => error ? reject(error) : resolve(result) })
        })
      }
    } else {
      if (callback) {
        callback(EVENT.CLIENT_OFFLINE)
      } else {
        return Promise.reject(EVENT.CLIENT_OFFLINE)
      }
    }
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
        this.services.logger.error(message)
        return
      }
      if (message.originalAction === RPC_ACTION.REQUEST) {
        const invalidRPC = this.getRPC(message)
        if (invalidRPC) {
          invalidRPC.error(RPC_ACTION[message.action])
          this.rpcs.delete(message.correlationId)
          return
        }
      }
    }

    // RPC Responses
    const rpc = this.getRPC(message)
    if (rpc) {
      if (message.action === RPC_ACTION.ACCEPT) {
        rpc.accept()
        return
      }

      if (message.action === RPC_ACTION.RESPONSE) {
        rpc.respond(message.parsedData)
      } else if (message.action === RPC_ACTION.REQUEST_ERROR) {
        rpc.error(message.parsedData)
      } else if (
        message.action === RPC_ACTION.RESPONSE_TIMEOUT ||
        message.action === RPC_ACTION.ACCEPT_TIMEOUT ||
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

  private onConnectionReestablished (): void {
    this.bulkSubscription.subscribeList([...this.providers.keys()])
    for (let i = 0; i < this.limboQueue.length; i++) {
      const { correlationId, name, data, callback } = this.limboQueue[i]
      this.rpcs.set(correlationId, new RPC(name, correlationId, data, callback, this.options, this.services))
    }
    this.limboQueue = []
  }

  private onExitLimbo () {
    for (let i = 0; i < this.limboQueue.length; i++) {
      this.limboQueue[i].callback(EVENT.CLIENT_OFFLINE)
    }
    this.limboQueue = []
  }

  private onConnectionLost (): void {
    this.rpcs.forEach(rpc => {
      rpc.error(EVENT.CLIENT_OFFLINE)
    })
    this.rpcs.clear()
  }

  private onBulkSubscriptionSent (message: Message): void {
    this.services.timeoutRegistry.add({ message })
  }
}
