import { RecordOfflineStore, offlineStoreWriteResponse } from '../client';
import { Options } from '../client-options';
export declare class Storage implements RecordOfflineStore {
    private storage;
    constructor(options: Options);
    get(recordName: string, callback: ((recordName: string, version: number, data: Array<string> | object | null) => void)): void;
    set(recordName: string, version: number, data: Array<string> | object, callback: offlineStoreWriteResponse): void;
    delete(recordName: string, callback: offlineStoreWriteResponse): void;
}
