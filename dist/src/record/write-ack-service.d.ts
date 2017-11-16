import { Message } from '../../binary-protocol/src/message-constants';
import { Services } from '../client';
import { WriteAckCallback } from './record-core';
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
export declare class WriteAcknowledgementService {
    private services;
    private responses;
    private count;
    constructor(services: Services);
    /**
   * Add a write ack nofity callback.
   *
   * @param {String} name An identifier for the request, e.g. a record name
   * @param {Object} callback An object with property `callback` or `resolve` and `reject`
   *
   * @public
   * @returns {void}
   */
    send(message: Message, callback: WriteAckCallback): void;
    recieve(message: Message): boolean;
    private onConnectionLost();
}
