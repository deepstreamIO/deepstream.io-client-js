"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_options_1 = require("./client-options");
const constants_1 = require("./constants");
const logger_1 = require("./util/logger");
const timeout_registry_1 = require("./util/timeout-registry");
const timer_registry_1 = require("./util/timer-registry");
const connection_1 = require("./connection/connection");
const event_handler_1 = require("./event/event-handler");
const rpc_handler_1 = require("./rpc/rpc-handler");
const record_handler_1 = require("./record/record-handler");
const presence_handler_1 = require("./presence/presence-handler");
const EventEmitter = require("component-emitter2");
class Client extends EventEmitter {
    constructor(url) {
        super();
        this.options = client_options_1.DefaultOptions;
        const services = {};
        services.logger = new logger_1.Logger();
        services.timerRegistry = new timer_registry_1.TimerRegistry();
        services.ackTimeoutRegistry = new timeout_registry_1.TimeoutRegistry(services, client_options_1.DefaultOptions);
        services.connection = new connection_1.Connection(services, client_options_1.DefaultOptions, url, this);
        this.services = services;
        this.event = new event_handler_1.EventHandler(this.services, this.options);
        this.rpc = new rpc_handler_1.RPCHandler(this.services, this.options);
        this.record = new record_handler_1.RecordHandler(this.services, this.options);
        this.presence = new presence_handler_1.PresenceHandler(this.services, this.options);
        this.services.rpc = this.rpc;
        this.services.event = this.event;
        this.services.record = this.record;
        this.services.presence = this.presence;
    }
    login(details, callback) {
        this.services.connection.authenticate(details, callback);
    }
    getConnectionState() {
        return constants_1.CONNECTION_STATE.OPEN;
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map