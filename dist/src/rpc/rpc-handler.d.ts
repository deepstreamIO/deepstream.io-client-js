import { Services } from '../client';
import { Options } from '../client-options';
import { RPCMakeCallback } from '../rpc/rpc';
import { RPCResponse } from '../rpc/rpc-response';
export declare type RPCProvider = (rpcData: any, response: RPCResponse) => void;
export declare class RPCHandler {
    private services;
    private options;
    private rpcs;
    private providers;
    private limboQueue;
    constructor(services: Services, options: Options);
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
    provide(name: string, callback: RPCProvider): void;
    /**
     * Unregisters this client as a provider for a remote procedure call
     */
    unprovide(name: string): void;
    /**
     * Executes the actual remote procedure call
     *
     * @param   {String}   name     The name of the rpc
     * @param   {Mixed}    data     Serializable data that will be passed to the provider
     * @param   {Function} callback Will be invoked with the returned result or if the rpc failed
     *                              receives to arguments: error or null and the result
     */
    make(name: string, data: any): Promise<any>;
    make(name: string, data: any, callback: RPCMakeCallback): void;
    /**
     * Handles incoming rpc REQUEST messages. Instantiates a new response object
     * and invokes the provider callback or rejects the request if no rpc provider
     * is present (which shouldn't really happen, but might be the result of a race condition
     * if this client sends a unprovide message whilst an incoming request is already in flight)
     */
    private respondToRpc;
    /**
     * Distributes incoming messages from the server
     * based on their action
     */
    private handle;
    private getRPC;
    private sendProvide;
    private onConnectionReestablished;
    private onExitLimbo;
    private onConnectionLost;
}
