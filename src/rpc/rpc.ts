import { Services } from '../client'
import { Options } from '../client-options'
import {TimeoutAction, TimeoutId} from '../util/timeout-registry'
import { RPCResult, TOPIC, RPC_ACTION, Message } from '../constants'

export type RPCMakeCallback = (error: string | null, result?: RPCResult) => void

/**
 * This class represents a single remote procedure
 * call made from the client to the server. It's main function
 * is to encapsulate the logic around timeouts and to convert the
 * incoming response data
 */
export class RPC {
    private readonly acceptTimeout: TimeoutId
    private readonly responseTimeout: TimeoutId

    constructor (private name: string, private correlationId: string, data: any, private response: RPCMakeCallback, private options: Options, private services: Services) {
      this.onTimeout = this.onTimeout.bind(this)

      const message = {
        topic: TOPIC.RPC,
        action: RPC_ACTION.REQUEST,
        correlationId,
        name,
        parsedData: data
      }

      this.acceptTimeout = this.services.timeoutRegistry.add({
        message: {
          topic: TOPIC.RPC,
          action: RPC_ACTION.ACCEPT,
          name: this.name,
          correlationId: this.correlationId
        },
        event: RPC_ACTION.ACCEPT_TIMEOUT,
        duration: this.options.rpcAcceptTimeout,
        callback: this.onTimeout
      })

      this.responseTimeout = this.services.timeoutRegistry.add({
        message: {
          topic: TOPIC.RPC,
          action: RPC_ACTION.REQUEST,
          name: this.name,
          correlationId: this.correlationId
        },
        event: RPC_ACTION.RESPONSE_TIMEOUT,
        duration: this.options.rpcResponseTimeout,
        callback: this.onTimeout
      })

      this.services.connection.sendMessage(message)
    }

    /**
     * Called once an ack message is received from the server
     */
    public accept (): void {
      this.services.timeoutRegistry.clear(this.acceptTimeout)
    }

    /**
     * Called once a response message is received from the server.
     */
    public respond (data: any) {
      this.response(null, data)
      this.complete()
    }

    /**
     * Called once an error is received from the server.
     */
    public error (data: any) {
      this.response(data)
      this.complete()
    }

    /**
     * Callback for error messages received from the server. Once
     * an error is received the request is considered completed. Even
     * if a response arrives later on it will be ignored / cause an
     * UNSOLICITED_MESSAGE error
     */
    private onTimeout (event: TimeoutAction, message: Message) {
      this.response(RPC_ACTION[event as RPC_ACTION])
      this.complete()
    }

    /**
     * Called after either an error or a response
     * was received
    */
    private complete () {
      this.services.timeoutRegistry.clear(this.acceptTimeout)
      this.services.timeoutRegistry.clear(this.responseTimeout)
  }
}
