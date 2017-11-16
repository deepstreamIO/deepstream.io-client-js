import { Message } from '../../binary-protocol/src/message-constants';
import { Services } from '../client';
import { WriteAckCallback } from './record-core';
/**
 * @param {Services} services
 *
 * @constructor
 */
export declare class WriteAckNotifier {
    private services;
    private responses;
    private count;
    constructor(services: Services);
    /**
   * Send message with write ack callback.
   *
   * @param {Message} message
   * @param {Function} callback
   *
   * @public
   * @returns {void}
   */
    send(message: Message, callback: WriteAckCallback): void;
    recieve(message: Message): void;
    private onConnectionLost();
}
