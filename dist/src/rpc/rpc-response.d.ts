import { Services } from '../client';
import { Options } from '../client-options';
import { RPCMessage } from '../../binary-protocol/src/message-constants';
/**
 * This class represents a single remote procedure
 * call made from the client to the server. It's main function
 * is to encapsulate the logic around timeouts and to convert the
 * incoming response data
 */
export declare class RPCResponse {
    private services;
    private name;
    private correlationId;
    private isAccepted;
    private isComplete;
    autoAccept: boolean;
    constructor(message: RPCMessage, options: Options, services: Services);
    /**
     * Acknowledges the receipt of the request. This
     * will happen implicitly unless the request callback
     * explicitly sets autoAck to false
     */
    accept(): void;
    /**
     * Reject the request. This might be necessary if the client
     * is already processing a large number of requests. If deepstream
     * receives a rejection message it will try to route the request to
     * another provider - or return a NO_RPC_PROVIDER error if there are no
     * providers left
     */
    reject(): void;
    /**
     * Notifies the server that an error has occured while trying to process the request.
     * This will complete the rpc.
     */
    error(error: any): void;
    /**
     * Completes the request by sending the response data
     * to the server. If data is an array or object it will
     * automatically be serialised.
     * If autoAck is disabled and the response is sent before
     * the ack message the request will still be completed and the
     * ack message ignored
     */
    send(data: any): void;
    /**
     * Callback for the autoAck timeout. Executes ack
     * if autoAck is not disabled
     */
    private performAutoAck();
}
