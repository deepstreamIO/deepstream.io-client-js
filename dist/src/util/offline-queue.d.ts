import { Services } from '../client';
import { Options } from '../client-options';
import { Message } from '../../binary-protocol/src/message-constants';
/**
 * Allows building up a queue of operations to be done on reconnect. This
 * includes messages to be sent or functions to be run. Often it is helpful
 * to allow functions to be run to account for timeouts being set.
 */
export default class OfflineQueue {
    private options;
    private services;
    private messageQueue;
    private functionQueue;
    private timeout;
    constructor(options: Options, services: Services);
    submitMessage(message: Message, failureCallback?: Function): void;
    submitFunction(callback: Function): void;
    flush(message: Message): void;
    private onTimeout();
}
