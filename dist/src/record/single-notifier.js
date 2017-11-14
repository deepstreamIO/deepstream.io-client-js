"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class SingleNotifier {
    constructor(services, topic, action, timeoutDuration) {
        this.services = services;
        this.topic = topic;
        this.action = action;
        this.timeoutDuration = timeoutDuration;
        this.requests = new Map();
    }
    /**
   * Add a request. If one has already been made it will skip the server request
   * and multiplex the response
   *
   * @param {String} name An identifier for the request, e.g. a record name
   * @param {Object} response An object with property `callback` or `resolve` and `reject`
   *
   * @public
   * @returns {void}
   */
    request(name, response) {
        if (this.services.connection.isConnected === false) {
            if (response.callback) {
                this.services.timerRegistry.requestIdleCallback(response.callback.bind(this, client_1.EVENT.CLIENT_OFFLINE));
            }
            else if (response.reject) {
                response.reject(client_1.EVENT.CLIENT_OFFLINE);
            }
            return;
        }
        const message = {
            topic: this.topic,
            action: this.action,
            name
        };
        this.services.timeoutRegistry.add({ message });
        const req = this.requests.get(name);
        if (req === undefined) {
            this.requests.set(name, [response]);
            this.services.connection.sendMessage(message);
        }
        else {
            req.push(response);
        }
    }
    recieve(message, error, data) {
        const name = message.name;
        const responses = this.requests.get(name);
        if (!responses) {
            this.services.logger.error(message, client_1.EVENT.UNSOLICITED_MESSAGE);
            return;
        }
        for (let i = 0; i < responses.length; i++) {
            const response = responses[i];
            if (response.callback) {
                response.callback(error, data);
            }
            else if (error && response.reject) {
                response.reject(error);
            }
            else if (response.resolve) {
                response.resolve(data);
            }
        }
        this.requests.delete(name);
    }
}
exports.SingleNotifier = SingleNotifier;
//# sourceMappingURL=single-notifier.js.map