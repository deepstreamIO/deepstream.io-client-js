import { Message, RECORD_ACTIONS as RECORD_ACTION } from '../../binary-protocol/src/message-constants';
import { Services } from '../client';
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
export declare class SingleNotifier {
    private services;
    private requests;
    private action;
    private internalRequests;
    private limboQueue;
    constructor(services: Services, action: RECORD_ACTION.READ | RECORD_ACTION.HEAD, timeoutDuration: number);
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
    request(name: string, callback: (error?: any, result?: any) => void): void;
    /**
     * Adds a callback to a (possibly) inflight request that will be called
     * on the response.
     *
     * @param name
     * @param response
     */
    register(name: string, callback: (message: Message) => void): void;
    recieve(message: Message, error?: any, data?: any): void;
    private onConnectionLost();
    private onExitLimbo();
    private onConnectionReestablished();
}
