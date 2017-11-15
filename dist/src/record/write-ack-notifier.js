"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_constants_1 = require("../../binary-protocol/src/message-constants");
const client_1 = require("../client");
/**
 * Provides a scaffold for subscriptionless requests to deepstream, such as the SNAPSHOT
 * and HAS functionality. The SingleNotifier multiplexes all the client requests so
 * that they can can be notified at once, and also includes reconnection funcionality
 * incase the connection drops.
 *
 * @param {Services} services          The deepstream client
 * @param {Options} options     Function to call to allow resubscribing
 *
 * @constructor
 */
class WriteAckNotifier {
    constructor(services) {
        this.services = services;
        this.responses = new Map();
        this.count = 1;
    }
    /**
   * Add a write ack nofity callback.
   *
   * @param {String} name An identifier for the request, e.g. a record name
   * @param {Object} callback An object with property `callback` or `resolve` and `reject`
   *
   * @public
   * @returns {void}
   */
    send(message, callback) {
        if (this.services.connection.isConnected === false) {
            this.services.timerRegistry.requestIdleCallback(callback.bind(this, client_1.EVENT.CLIENT_OFFLINE));
            return;
        }
        else {
            const correlationId = this.count.toString();
            this.responses.set(correlationId, callback);
            this.services.connection.sendMessage(Object.assign({}, message, { correlationId }));
            this.count++;
        }
    }
    recieve(message) {
        const id = message.correlationId;
        const response = this.responses.get(id);
        if (!response ||
            (message.action !== message_constants_1.RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT && !message.isError)) {
            this.services.logger.error(message, client_1.EVENT.UNSOLICITED_MESSAGE);
            return;
        }
        message.isError
            ? response(message_constants_1.RECORD_ACTIONS[message.action])
            : response(null);
        this.responses.delete(id);
    }
    onConnectionLost() {
        this.responses.forEach(response => {
        });
    }
}
exports.WriteAckNotifier = WriteAckNotifier;
//# sourceMappingURL=write-ack-notifier.js.map