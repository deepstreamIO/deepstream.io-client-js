"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter = require("component-emitter2");
class Record {
    constructor(services) {
        this.services = services;
        this.emitter = new Emitter();
        this.data = {};
    }
    get() {
        return this.data;
    }
}
exports.Record = Record;
//# sourceMappingURL=record.js.map