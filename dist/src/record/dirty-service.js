"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter = require("component-emitter2");
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
        console.log(this.dirtyRecords);
        return !!this.dirtyRecords[recordName];
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
            callback();
            return;
        }
        this.emitter.once(DIRTY_SERVICE_LOADED, () => {
            callback();
        });
    }
    getAll(callback) {
        this.storage.get(this.name, (recordName, version, data) => {
            callback(version !== -1 ? data : {});
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
        if (isDirty) {
            this.dirtyRecords[recordName] = true;
        }
        else {
            delete this.dirtyRecords[recordName];
        }
        this.storage.set(this.name, 1, this.dirtyRecords, callback);
    }
}
exports.DirtyService = DirtyService;
//# sourceMappingURL=dirty-service.js.map