import { RecordOfflineStore, offlineStoreWriteResponse } from '../client';
import { Options } from '../client-options';
import { RecordData } from '../../binary-protocol/src/message-constants';
export declare class Storage implements RecordOfflineStore {
    private storage;
    constructor(options: Options);
    get(recordName: string, callback: ((recordName: string, version: number, data: RecordData) => void)): void;
    set(recordName: string, version: number, data: RecordData, callback: offlineStoreWriteResponse): void;
    delete(recordName: string, callback: offlineStoreWriteResponse): void;
}
