import { Services } from '../client';
import { Options } from '../client-options';
import { EVENT } from '../constants';
import * as EventEmitter from 'component-emitter';
export interface Timeout {
    event?: EVENT;
    message: Message;
    callback?: Function;
    duration?: number;
}
/**
 * Subscriptions to events are in a pending state until deepstream acknowledges
 * them. This is a pattern that's used by numerour classes. This registry aims
 * to centralise the functionality necessary to keep track of subscriptions and
 * their respective timeouts.
 */
export declare class TimeoutRegistry extends EventEmitter {
    private options;
    private services;
    private register;
    private counter;
    constructor(services: Services, options: Options);
    /**
     * Add an entry
     */
    add(timeout: Timeout): number;
    /**
     * Remove an entry
     */
    remove(message: Message): void;
    /**
     * Processes an incoming ACK-message and removes the corresponding subscription
     */
    clear(timerId: number): void;
    /**
     * Will be invoked if the timeout has occured before the ack message was received
     *
     * @param {Object} name The timeout object registered
     */
    private onTimeout(internalTimeout);
    /**
     * Returns a unique name from the timeout
     */
    private getUniqueName(message);
    /**
     * Remote all timeouts when connection disconnects
     */
    private onConnectionStateChanged(connectionState);
}
