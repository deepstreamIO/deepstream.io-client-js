"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter = require("component-emitter2");
const version = 1;
const DIRTY_SERVICE_LOADED = 'dirty-service-loaded';
class DirtyService {
    constructor(storage, dirtyStorageName) {
        this.storage = storage;
        this.name = dirtyStorageName;
        this.loaded = false;
        this.emitter = new Emitter();
        this.load();
    }
    isDirty(recordName) {
        if (this.dirtyRecords[recordName] !== undefined) {
            return this.dirtyRecords[recordName];
        }
        return false;
    }
    setDirty(recordName, isDirty, callback) {
        if (this.loaded) {
            this.updateDirtyRecords(recordName, isDirty, callback);
            return;
        }
        this.emitter.once(DIRTY_SERVICE_LOADED, () => {
            this.updateDirtyRecords(recordName, isDirty, callback);
        });
    }
    whenLoaded(callback) {
        if (this.loaded) {
            callback(this.dirtyRecords);
            return;
        }
        this.emitter.once(DIRTY_SERVICE_LOADED, () => {
            callback(this.dirtyRecords);
        });
    }
    load() {
        if (this.loaded) {
            return;
        }
        this.storage.get(this.name, (recordName, version, data) => {
            this.dirtyRecords = version !== -1 ? data : {};
            this.loaded = true;
            this.emitter.emit(DIRTY_SERVICE_LOADED);
        });
    }
    updateDirtyRecords(recordName, isDirty, callback) {
        this.dirtyRecords[recordName] = isDirty;
        this.storage.set(this.name, version, this.dirtyRecords, callback);
    }
}
exports.DirtyService = DirtyService;
//# sourceMappingURL=dirty-service.js.map