import { RecordOfflineStore, offlineStoreWriteResponse } from '../client';
export declare type DirtyRecords = {
    [recordName: string]: boolean;
};
export declare class DirtyService {
    private name;
    private storage;
    private dirtyRecords;
    private loaded;
    private emitter;
    constructor(storage: RecordOfflineStore, dirtyStorageName: string);
    isDirty(recordName: string): boolean;
    setDirty(recordName: string, isDirty: boolean, callback: offlineStoreWriteResponse): void;
    whenLoaded(callback: () => void): void;
    private load();
    private updateDirtyRecords(recordName, isDirty, callback);
}
