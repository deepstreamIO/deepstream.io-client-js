import { Services } from '../client';
import { Options } from '../client-options';
import { RPCResult } from '../../binary-protocol/src/message-constants';
export declare type RPCMakeCallback = (error: string | null, result?: RPCResult) => void;
/**
 * This class represents a single remote procedure
 * call made from the client to the server. It's main function
 * is to encapsulate the logic around timeouts and to convert the
 * incoming response data
 */
export declare class RPC {
    private services;
    private options;
    private name;
    private correlationId;
    private response;
    private acceptTimeout;
    private responseTimeout;
    constructor(name: string, correlationId: string, data: any, response: RPCMakeCallback, options: Options, services: Services);
    /**
     * Called once an ack message is received from the server
     */
    accept(): void;
    /**
     * Called once a response message is received from the server.
     */
    respond(data: any): void;
    /**
     * Called once an error is received from the server.
     */
    error(data: any): void;
    /**
     * Callback for error messages received from the server. Once
     * an error is received the request is considered completed. Even
     * if a response arrives later on it will be ignored / cause an
     * UNSOLICITED_MESSAGE error
     */
    private onTimeout;
    /**
     * Called after either an error or a response
     * was received
    */
    private complete;
}
