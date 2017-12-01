import { RecordOfflineStore } from '../client';
export declare class DirtyService {
    private name;
    private storage;
    private dirtyRecords;
    private loaded;
    private emitter;
    constructor(storage: RecordOfflineStore, dirtyStorageName: string);
    isDirty(recordName: string): boolean;
    setDirty(recordName: string, isDirty: boolean): void;
    whenLoaded(callback: () => void): void;
    getAll(): Map<string, boolean>;
    private load();
    private updateDirtyRecords(recordName, isDirty);
}
