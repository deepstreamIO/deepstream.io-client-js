import { Services } from '../client';
import { Options } from '../client-options';
import { Listener, ListenCallback } from '../util/listener';
export declare class EventHandler {
    private services;
    private emitter;
    private listeners;
    private options;
    private limboQueue;
    constructor(services: Services, options: Options, listeners?: Listener);
    /**
    * Subscribe to an event. This will receive both locally emitted events
    * as well as events emitted by other connected clients.
    */
    subscribe(name: string, callback: (data: any) => void): void;
    /**
     * Removes a callback for a specified event. If all callbacks
     * for an event have been removed, the server will be notified
     * that the client is unsubscribed as a listener
     */
    unsubscribe(name: string, callback: (data: any) => void): void;
    /**
     * Emits an event locally and sends a message to the server to
     * broadcast the event to the other connected clients
     */
    emit(name: string, data: any): void;
    /**
   * Allows to listen for event subscriptions made by this or other clients. This
   * is useful to create "active" data providers, e.g. providers that only provide
   * data for a particular event if a user is actually interested in it
   */
    listen(pattern: string, callback: ListenCallback): void;
    /**
     * Removes a listener that was previously registered
     */
    unlisten(pattern: string): void;
    /**
   * Handles incoming messages from the server
   */
    private handle(message);
    /**
     * Resubscribes to events when connection is lost
     */
    private onConnectionReestablished();
    private onExitLimbo();
    private sendSubscriptionMessage(name);
}
