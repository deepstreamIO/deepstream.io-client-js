import { RecordOfflineStore } from '../client';
export interface DirtyRecordsIndex {
    [index: string]: boolean;
}
export declare class DirtyService {
    private readonly name;
    private storage;
    private dirtyRecords;
    private loaded;
    private emitter;
    constructor(storage: RecordOfflineStore, dirtyStorageName: string);
    isDirty(recordName: string): boolean;
    setDirty(recordName: string, isDirty: boolean): void;
    whenLoaded(callback: () => void): void;
    getAll(): DirtyRecordsIndex;
    private load;
}
