"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Listener {
    constructor(topic, services) {
        this.topic = topic;
        this.services = services;
        this.listeners = new Map();
        // if (topic === TOPIC.RECORD) {
        //     this.actions = RECORD_ACTION
        // } else if (topic === TOPIC.EVENT) {
        //     this.actions = EVENT_ACTION
        // }
    }
    listen(pattern, callback) {
        this.listeners.set(pattern, callback);
    }
    unlisten(pattern) {
        this.listeners.delete(pattern);
    }
}
exports.Listener = Listener;
//# sourceMappingURL=listener.js.map