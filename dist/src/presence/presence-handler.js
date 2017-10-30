"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter = require("component-emitter2");
class PresenceHandler {
    constructor(services, options) {
        this.services = services;
        this.options = options;
        this.emitter = new Emitter();
    }
    // tslint:disable-next-line:no-empty
    handle() {
    }
}
exports.PresenceHandler = PresenceHandler;
//# sourceMappingURL=presence-handler.js.map