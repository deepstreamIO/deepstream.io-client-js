"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const listener_1 = require("../util/listener");
const Emitter = require("component-emitter2");
class EventHandler {
    constructor(services, options) {
        this.options = options;
        this.services = services;
        this.emitter = new Emitter();
        this.listeners = new listener_1.Listener(constants_1.TOPIC.EVENT, services);
        this.services.connection.registerHandler(constants_1.TOPIC.EVENT, this.handle.bind(this));
    }
    /**
    * Subscribe to an event. This will receive both locally emitted events
    * as well as events emitted by other connected clients.
    */
    subscribe(name, callback) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }
        if (typeof callback !== 'function') {
            throw new Error('invalid argument callback');
        }
        if (!this.emitter.hasListeners(name)) {
            const message = {
                topic: constants_1.TOPIC.EVENT,
                action: constants_1.EVENT_ACTION.SUBSCRIBE,
                name
            };
            this.services.timeoutRegistry.add({ message });
            this.services.connection.sendMessage(message);
        }
        this.emitter.on(name, callback);
    }
    /**
     * Removes a callback for a specified event. If all callbacks
     * for an event have been removed, the server will be notified
     * that the client is unsubscribed as a listener
     */
    unsubscribe(name, callback) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }
        if (callback !== undefined && typeof callback !== 'function') {
            throw new Error('invalid argument callback');
        }
        if (!this.emitter.hasListeners(name)) {
            this.services.logger.warn({
                topic: constants_1.TOPIC.EVENT,
                action: constants_1.EVENT_ACTION.NOT_SUBSCRIBED,
                name
            });
            return;
        }
        this.emitter.off(name, callback);
        if (!this.emitter.hasListeners(name)) {
            const message = {
                topic: constants_1.TOPIC.EVENT,
                action: constants_1.EVENT_ACTION.UNSUBSCRIBE,
                name
            };
            this.services.timeoutRegistry.add({ message });
            this.services.connection.sendMessage(message);
        }
    }
    /**
   * Emits an event locally and sends a message to the server to
   * broadcast the event to the other connected clients
   */
    emit(name, data) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }
        this.services.connection.sendMessage({
            topic: constants_1.TOPIC.EVENT,
            action: constants_1.EVENT_ACTION.EMIT,
            name,
            parsedData: data
        });
        this.emitter.emit(name, data);
    }
    /**
   * Allows to listen for event subscriptions made by this or other clients. This
   * is useful to create "active" data providers, e.g. providers that only provide
   * data for a particular event if a user is actually interested in it
   */
    listen(pattern, callback) {
        if (typeof pattern !== 'string' || pattern.length === 0) {
            throw new Error('invalid argument pattern');
        }
        if (typeof callback !== 'function') {
            throw new Error('invalid argument callback');
        }
        this.listeners.listen(pattern, callback);
    }
    /**
     * Removes a listener that was previously registered with listenForSubscriptions
     */
    unlisten(pattern) {
        if (typeof pattern !== 'string' || pattern.length === 0) {
            throw new Error('invalid argument pattern');
        }
        this.listeners.unlisten(pattern);
    }
    /**
   * Handles incoming messages from the server
   */
    handle(message) {
        if (message.isAck) {
            this.services.timeoutRegistry.remove(message);
            return;
        }
        if (message.action === constants_1.EVENT_ACTION.EMIT) {
            if (message.parsedData !== undefined) {
                this.emitter.emit(message.name, message.parsedData);
            }
            else {
                this.emitter.emit(message.name);
            }
            return;
        }
        if (message.action === constants_1.EVENT_ACTION.MESSAGE_DENIED) {
            this.services.timeoutRegistry.remove(message);
            this.emitter.off(message.name);
            return;
        }
        if (message.action === constants_1.EVENT_ACTION.NOT_SUBSCRIBED) {
            this.services.logger.warn(message);
            return;
        }
        this.services.logger.error(message, constants_1.EVENT.UNSOLICITED_MESSAGE);
    }
    /**
     * Resubscribes to events when connection is lost
     */
    resubscribe() {
        const callbacks = this.emitter._callbacks;
        for (const name in callbacks) {
            this.services.connection.sendMessage({
                topic: constants_1.TOPIC.EVENT,
                action: constants_1.EVENT_ACTION.SUBSCRIBE,
                name
            });
        }
    }
}
exports.EventHandler = EventHandler;
//# sourceMappingURL=event-handler.js.map