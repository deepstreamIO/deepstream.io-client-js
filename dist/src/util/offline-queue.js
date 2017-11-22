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
        this.onTimeout = this.onTimeout.bind(this);
    }
    submit(message, successCallback, failureCallback) {
        this.messageQueue.push({ message, success: successCallback, failure: failureCallback });
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
            const item = this.messageQueue[i];
            this.services.connection.sendMessage(this.messageQueue[i].message);
            if (item.success) {
                item.success();
            }
        }
        this.services.timerRegistry.remove(this.timeout);
        this.timeout = null;
    }
    onTimeout() {
        for (let i = 0; i < this.messageQueue.length; i++) {
            const msg = this.messageQueue[i];
            if (msg.failure) {
                msg.failure();
            }
        }
        this.messageQueue = [];
        this.timeout = null;
    }
}
exports.default = OfflineQueue;
//# sourceMappingURL=offline-queue.js.map