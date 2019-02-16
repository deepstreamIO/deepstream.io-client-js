import { Services } from '../client';
import { Options } from '../client-options';
import { EVENT } from '../constants';
import { RECORD_ACTIONS as RECORD_ACTION, RPC_ACTIONS as RPC_ACTION, Message } from '../../binary-protocol/src/message-constants';
import * as EventEmitter from 'component-emitter2';
export declare type TimeoutAction = EVENT | RPC_ACTION | RECORD_ACTION;
export interface Timeout {
    event?: TimeoutAction;
    message: Message;
    callback?: (event: TimeoutAction, message: Message) => void;
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
     */
    private onTimeout;
    /**
     * Returns a unique name from the timeout
     */
    private getUniqueName;
    /**
     * Remote all timeouts when connection disconnects
     */
    onConnectionLost(): void;
}
