"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const message_constants_1 = require("../../binary-protocol/src/message-constants");
const Emitter = require("component-emitter2");
const ONLY_EVENT = 'OE';
function validateQueryArguments(rest) {
    let users = null;
    let callback = null;
    if (rest.length === 1) {
        if (Array.isArray(rest[0])) {
            users = rest[0];
        }
        else {
            if (typeof rest[0] !== 'function') {
                throw new Error('invalid argument: "callback"');
            }
            callback = rest[0];
        }
    }
    else if (rest.length === 2) {
        users = rest[0];
        callback = rest[1];
        if (!Array.isArray(users) || typeof callback !== 'function') {
            throw new Error('invalid argument: "users" or "callback"');
        }
    }
    return { users, callback };
}
class PresenceHandler {
    constructor(services, options) {
        this.services = services;
        this.subscriptionEmitter = new Emitter();
        this.globalSubscriptionEmitter = new Emitter();
        this.queryEmitter = new Emitter();
        this.queryAllEmitter = new Emitter();
        this.services.connection.registerHandler(message_constants_1.TOPIC.PRESENCE, this.handle.bind(this));
        this.services.connection.onExitLimbo(this.onExitLimbo.bind(this));
        this.services.connection.onLost(this.onExitLimbo.bind(this));
        this.services.connection.onReestablished(this.onConnectionReestablished.bind(this));
        this.counter = 0;
        this.pendingSubscribes = new Set();
        this.pendingUnsubscribes = new Set();
        this.limboQueue = [];
        this.flushTimeout = null;
    }
    subscribe(userOrCallback, callback) {
        if (typeof userOrCallback === 'string' && userOrCallback.length > 0 && typeof callback === 'function') {
            const user = userOrCallback;
            if (!this.subscriptionEmitter.hasListeners(user)) {
                this.pendingSubscribes.add(user);
            }
            this.subscriptionEmitter.on(user, callback);
            this.pendingUnsubscribes.delete(user);
            this.registerFlushTimeout();
            return;
        }
        if (typeof userOrCallback === 'function' && typeof callback === 'undefined') {
            if (!this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT)) {
                this.subscribeToAllChanges();
            }
            this.globalSubscriptionEmitter.on(ONLY_EVENT, userOrCallback);
            return;
        }
        throw new Error('invalid arguments: "user" or "callback"');
    }
    unsubscribe(userOrCallback, callback) {
        if (userOrCallback && typeof userOrCallback === 'string' && userOrCallback.length > 0) {
            const user = userOrCallback;
            if (callback) {
                if (typeof callback !== 'function') {
                    throw new Error('invalid argument: "callback"');
                }
                this.subscriptionEmitter.off(user, callback);
            }
            else {
                this.subscriptionEmitter.off(user);
            }
            if (!this.subscriptionEmitter.hasListeners(user)) {
                this.pendingSubscribes.delete(user);
                this.pendingUnsubscribes.add(user);
                this.registerFlushTimeout();
            }
            return;
        }
        if (userOrCallback && typeof userOrCallback === 'function') {
            callback = userOrCallback;
            this.globalSubscriptionEmitter.off(ONLY_EVENT, callback);
            if (!this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT)) {
                this.unsubscribeToAllChanges();
            }
            return;
        }
        if (typeof userOrCallback === 'undefined' && typeof callback === 'undefined') {
            this.subscriptionEmitter.off();
            this.globalSubscriptionEmitter.off();
            this.pendingSubscribes.clear();
            const users = this.subscriptionEmitter.eventNames();
            for (let i = 0; i < users.length; i++) {
                this.pendingUnsubscribes.add(users[i]);
            }
            this.registerFlushTimeout();
            this.unsubscribeToAllChanges();
            return;
        }
        throw new Error('invalid argument: "user" or "callback"');
    }
    getAll(...rest) {
        const { callback, users } = validateQueryArguments(rest);
        let message;
        let emitter;
        let emitterAction;
        if (users) {
            const queryId = (this.counter++).toString();
            message = {
                topic: message_constants_1.TOPIC.PRESENCE,
                action: message_constants_1.PRESENCE_ACTIONS.QUERY,
                correlationId: queryId,
                names: users
            };
            emitter = this.queryEmitter;
            emitterAction = queryId;
        }
        else {
            message = {
                topic: message_constants_1.TOPIC.PRESENCE,
                action: message_constants_1.PRESENCE_ACTIONS.QUERY_ALL
            };
            emitter = this.queryAllEmitter;
            emitterAction = ONLY_EVENT;
        }
        if (this.services.connection.isConnected) {
            this.sendQuery(message);
        }
        else if (this.services.connection.isInLimbo) {
            this.limboQueue.push(message);
        }
        else {
            this.services.timerRegistry.requestIdleCallback(() => {
                emitter.emit(emitterAction, constants_1.EVENT.CLIENT_OFFLINE);
            });
        }
        if (callback) {
            emitter.once(emitterAction, callback);
            return;
        }
        return new Promise((resolve, reject) => {
            emitter.once(emitterAction, (error, results) => error ? reject(error) : resolve(results));
        });
    }
    handle(message) {
        if (message.isAck) {
            this.services.timeoutRegistry.remove(message);
            return;
        }
        if (message.action === message_constants_1.PRESENCE_ACTIONS.QUERY_ALL_RESPONSE) {
            this.queryAllEmitter.emit(ONLY_EVENT, null, message.names);
            this.services.timeoutRegistry.remove(message);
            return;
        }
        if (message.action === message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE) {
            this.queryEmitter.emit(message.correlationId, null, message.parsedData);
            this.services.timeoutRegistry.remove(message);
            return;
        }
        if (message.action === message_constants_1.PRESENCE_ACTIONS.PRESENCE_JOIN) {
            this.subscriptionEmitter.emit(message.name, message.name, true);
            return;
        }
        if (message.action === message_constants_1.PRESENCE_ACTIONS.PRESENCE_JOIN_ALL) {
            this.globalSubscriptionEmitter.emit(ONLY_EVENT, message.name, true);
            return;
        }
        if (message.action === message_constants_1.PRESENCE_ACTIONS.PRESENCE_LEAVE) {
            this.subscriptionEmitter.emit(message.name, message.name, false);
            return;
        }
        if (message.action === message_constants_1.PRESENCE_ACTIONS.PRESENCE_LEAVE_ALL) {
            this.globalSubscriptionEmitter.emit(ONLY_EVENT, message.name, false);
            return;
        }
        if (message.isError) {
            this.services.timeoutRegistry.remove(message);
            if (message.originalAction === message_constants_1.PRESENCE_ACTIONS.QUERY) {
                this.queryEmitter.emit(message.correlationId, message_constants_1.PRESENCE_ACTIONS[message.action]);
            }
            else if (message.originalAction === message_constants_1.PRESENCE_ACTIONS.QUERY_ALL) {
                this.queryAllEmitter.emit(ONLY_EVENT, message_constants_1.PRESENCE_ACTIONS[message.action]);
            }
            else {
                this.services.logger.error(message);
            }
            return;
        }
        this.services.logger.error(message, constants_1.EVENT.UNSOLICITED_MESSAGE);
    }
    sendQuery(message) {
        this.services.connection.sendMessage(message);
        this.services.timeoutRegistry.add({ message });
    }
    flush() {
        if (!this.services.connection.isConnected) {
            // will be handled by resubscribe
            return;
        }
        const subUsers = Array.from(this.pendingSubscribes.keys());
        if (subUsers.length > 0) {
            this.bulkSubscription(message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE, subUsers);
            this.pendingSubscribes.clear();
        }
        const unsubUsers = Array.from(this.pendingUnsubscribes.keys());
        if (unsubUsers.length > 0) {
            this.bulkSubscription(message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE, unsubUsers);
            this.pendingUnsubscribes.clear();
        }
        this.flushTimeout = null;
    }
    bulkSubscription(action, names) {
        const correlationId = this.counter++;
        const message = {
            topic: message_constants_1.TOPIC.PRESENCE,
            action,
            correlationId: correlationId.toString(),
            names
        };
        this.services.timeoutRegistry.add({ message });
        this.services.connection.sendMessage(message);
    }
    subscribeToAllChanges() {
        if (!this.services.connection.isConnected) {
            return;
        }
        const message = { topic: message_constants_1.TOPIC.PRESENCE, action: message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ALL };
        this.services.timeoutRegistry.add({ message });
        this.services.connection.sendMessage(message);
    }
    unsubscribeToAllChanges() {
        if (!this.services.connection.isConnected) {
            return;
        }
        const message = { topic: message_constants_1.TOPIC.PRESENCE, action: message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ALL };
        this.services.timeoutRegistry.add({ message });
        this.services.connection.sendMessage(message);
    }
    registerFlushTimeout() {
        if (!this.flushTimeout) {
            this.flushTimeout = this.services.timerRegistry.add({
                duration: 0,
                context: this,
                callback: this.flush
            });
        }
    }
    onConnectionReestablished() {
        const keys = this.subscriptionEmitter.eventNames();
        if (keys.length > 0) {
            this.bulkSubscription(message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE, keys);
        }
        const hasGlobalSubscription = this.globalSubscriptionEmitter.hasListeners(ONLY_EVENT);
        if (hasGlobalSubscription) {
            this.subscribeToAllChanges();
        }
        for (let i = 0; i < this.limboQueue.length; i++) {
            this.sendQuery(this.limboQueue[i]);
        }
        this.limboQueue = [];
    }
    onExitLimbo() {
        this.queryEmitter.eventNames().forEach(correlationId => {
            this.queryEmitter.emit(correlationId, constants_1.EVENT.CLIENT_OFFLINE);
        });
        this.queryAllEmitter.emit(ONLY_EVENT, constants_1.EVENT.CLIENT_OFFLINE);
        this.limboQueue = [];
        this.queryAllEmitter.off();
        this.queryEmitter.off();
    }
}
exports.PresenceHandler = PresenceHandler;
//# sourceMappingURL=presence-handler.js.map