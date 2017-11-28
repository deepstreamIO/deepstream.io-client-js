"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Storage {
    constructor(options) {
        if (typeof localStorage === "undefined" || localStorage === null) {
            const LocalStorage = require('node-localstorage').LocalStorage;
            this.storage = new LocalStorage(options.nodeStoragePath, options.nodeStorageSize * 1024 * 1024);
        }
        else {
            this.storage = window.localStorage;
        }
    }
    get(recordName, callback) {
        const item = this.storage.getItem(recordName);
        if (item) {
            const doc = JSON.parse(item);
            callback(recordName, doc.version, doc.data);
            return;
        }
        callback(recordName, -1, null);
    }
    set(recordName, version, data, callback) {
        this.storage.setItem(recordName, JSON.stringify({ recordName, version, data }));
        callback();
    }
    delete(recordName, callback) {
        this.storage.removeItem(recordName);
        callback();
    }
}
exports.Storage = Storage;
//# sourceMappingURL=storage-service.js.map