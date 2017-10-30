"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const EventEmitter = require("component-emitter");
/**
 * Subscriptions to events are in a pending state until deepstream acknowledges
 * them. This is a pattern that's used by numerour classes. This registry aims
 * to centralise the functionality necessary to keep track of subscriptions and
 * their respective timeouts.
 */
class TimeoutRegistry extends EventEmitter {
    constructor(services, options) {
        super();
        this.options = options;
        this.services = services;
        this.register = new Map();
        // services.connection.on(EVENT.CONNECTION_STATE_CHANGED, this.onConnectionStateChanged.bind(this))
    }
    /**
     * Add an entry
     */
    add(timeout) {
        if (timeout.duration === undefined) {
            timeout.duration = this.options.subscriptionTimeout;
        }
        if (this.services.connection.getConnectionState() !== constants_1.CONNECTION_STATE.OPEN || timeout.duration < 1) {
            return -1;
        }
        this.remove(timeout.message);
        const timerId = this.services.timerRegistry.add({
            callback: timeout.callback ? timeout.callback : this.onTimeout,
            duration: timeout.duration,
            context: this,
            data: timeout
        });
        this.register.set(timerId, Object.assign({}, {
            timerId,
            uniqueName: this.getUniqueName(timeout.message)
        }, { timeout }));
        return timerId;
    }
    /**
     * Remove an entry
     */
    remove(message) {
        const uniqueName = this.getUniqueName(message);
        const timer = this.register.get(uniqueName);
        if (timer) {
            clearTimeout(timer.timerId);
            this.register.delete(uniqueName);
        }
    }
    /**
     * Processes an incoming ACK-message and removes the corresponding subscription
     */
    clear(timerId) {
        this.services.timerRegistry.remove(timerId);
        this.register.delete(timerId);
    }
    /**
     * Will be invoked if the timeout has occured before the ack message was received
     *
     * @param {Object} name The timeout object registered
     */
    onTimeout(internalTimeout) {
        this.register.delete(internalTimeout.timerId);
        const timeout = internalTimeout.timeout;
        if (timeout.callback) {
            timeout.callback(timeout);
        }
        else {
            this.services.logger.warn(timeout.message, timeout.event);
        }
    }
    /**
     * Returns a unique name from the timeout
     */
    getUniqueName(message) {
        return message.topic + message.action + (message.name ? message.name : '');
    }
    /**
     * Remote all timeouts when connection disconnects
     */
    onConnectionStateChanged(connectionState) {
        if (connectionState !== constants_1.CONNECTION_STATE.OPEN) {
            for (const [timerId, timer] of this.register) {
                clearTimeout(timer.timerId);
            }
        }
    }
}
exports.TimeoutRegistry = TimeoutRegistry;
//# sourceMappingURL=timeout-registry.js.map