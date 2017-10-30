import { Services } from '../client'
import { Options } from '../client-options'
import { TOPIC, RPC_ACTION, EVENT } from '../constants'

/**
 * This class represents a single remote procedure
 * call made from the client to the server. It's main function
 * is to encapsulate the logic around timeouts and to convert the
 * incoming response data
 */
export class RPC {
    private services: Services
    private options: Options
    private name: string
    private response: any
    private acceptTimeout: number
    private responseTimeout: number

    constructor (name: string, response: any, options: Options, services: Services) {
        this.options = options
        this.services = services
        this.name = name
        this.response = response

        this.acceptTimeout = this.services.timeoutRegistry.add({
            message: {
              topic: TOPIC.RPC,
              action: RPC_ACTION.ACCEPT,
              name
            },
            event: RPC_ACTION.ACCEPT_TIMEOUT,
            duration: this.options.rpcAckTimeout,
            callback: this.onTimeout.bind(this)
        })

        this.responseTimeout = this.services.timeoutRegistry.add({
            message: {
              topic: TOPIC.RPC,
              action: RPC_ACTION.REQUEST,
              name
            },
            event: RPC_ACTION.RESPONSE_TIMEOUT,
            duration: this.options.rpcResponseTimeout,
            callback: this.onTimeout.bind(this)
          })
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
      this.response.callback(null, data)
      this.complete()
    }

    /**
     * Called once an error is received from the server.
     */
    public error (data: any) {
      this.response.callback(data, data)
      this.complete()
    }

    /**
     * Callback for error messages received from the server. Once
     * an error is received the request is considered completed. Even
     * if a response arrives later on it will be ignored / cause an
     * UNSOLICITED_MESSAGE error
     */
    private onTimeout (event: EVENT, message: Message) {
      this.response.callback(event)
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
