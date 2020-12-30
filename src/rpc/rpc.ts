import { Services } from '../deepstream-client'
import { Options } from '../client-options'
import { RPCResult, TOPIC, RPC_ACTION } from '../constants'

export type RPCMakeCallback = (error: string | null, result?: RPCResult) => void

/**
 * This class represents a single remote procedure
 * call made from the client to the server. It's main function
 * is to encapsulate the logic and to convert the
 * incoming response data
 */
export class RPC {
    constructor (name: string, correlationId: string, data: any, private response: RPCMakeCallback, options: Options, private services: Services) {
      const message = {
        topic: TOPIC.RPC,
        action: RPC_ACTION.REQUEST,
        correlationId,
        name,
        parsedData: data
      }

      this.services.connection.sendMessage(message)
    }

    /**
     * Called once an ack message is received from the server
     */
    public accept (): void {
    }

    /**
     * Called once a response message is received from the server.
     */
    public respond (data: any) {
      this.response(null, data)
    }

    /**
     * Called once an error is received from the server.
     */
    public error (data: any) {
      this.response(data)
    }
}
