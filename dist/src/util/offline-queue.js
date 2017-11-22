"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Allows building up a queue of operations to be done on reconnect. This
 * includes messages to be sent or functions to be run. Often it is helpful
 * to allow functions to be run to account for timeouts being set.
 */
class OfflineQueue {
    constructor(options, services) {
        this.options = options;
        this.services = services;
        this.messageQueue = [];
        this.functionQueue = [];
        this.onTimeout = this.onTimeout.bind(this);
    }
    submitMessage(message, failureCallback) {
        this.messageQueue.push({ message, callback: failureCallback });
        if (!this.timeout) {
            this.timeout = this.services.timerRegistry.add({
                callback: this.onTimeout,
                duration: this.options.offlineBufferTimeout,
                context: this,
            });
        }
    }
    submitFunction(callback) {
        this.functionQueue.push(callback);
        if (!this.timeout) {
            this.timeout = this.services.timerRegistry.add({
                callback: this.onTimeout,
                duration: this.options.offlineBufferTimeout,
                context: this,
            });
        }
    }
    flush(message) {
        for (let i = 0; i < this.messageQueue.length; i++) {
            this.services.connection.sendMessage(this.messageQueue[i].message);
        }
        this.messageQueue = [];
        for (let i = 0; i < this.functionQueue.length; i++) {
            this.functionQueue[i]();
        }
        this.services.timerRegistry.remove(this.timeout);
    }
    onTimeout() {
        for (let i = 0; i < this.messageQueue.length; i++) {
            const msg = this.messageQueue[i];
            if (msg.callback) {
                msg.callback();
            }
        }
        this.messageQueue = [];
        this.functionQueue = [];
    }
}
exports.default = OfflineQueue;
//# sourceMappingURL=offline-queue.js.map