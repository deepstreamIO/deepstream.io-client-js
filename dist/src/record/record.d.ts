import { RecordCore, WriteAckCallback } from './record-core';
import { MergeStrategy } from './merge-strategy';
import * as Emitter from 'component-emitter2';
import { JSONObject, RecordData } from '../../binary-protocol/src/message-constants';
export declare class Record extends Emitter {
    private record;
    private subscriptions;
    constructor(record: RecordCore<Record>);
    readonly name: string;
    readonly isReady: boolean;
    readonly version: number;
    readonly hasProvider: boolean;
    whenReady(callback?: ((record: Record) => void)): void | Promise<Record>;
    get(path?: string): any;
    set(data: JSONObject, callback?: WriteAckCallback): void;
    set(path: string, data: RecordData, callback?: WriteAckCallback): void;
    setWithAck(data: JSONObject): Promise<void>;
    setWithAck(data: JSONObject, callback: ((error: string) => void)): void;
    setWithAck(path: string, data: RecordData): Promise<void>;
    setWithAck(path: string, data: RecordData, callback: ((error: string) => void)): void;
    setWithAck(data: JSONObject, callback?: ((error: string) => void)): Promise<void> | void;
    /**
     * Deletes a path from the record. Equivalent to doing `record.set(path, undefined)`
     *
     * @param {String} path The path to be deleted
     */
    erase(path: string): void;
    /**
     * Deletes a path from the record and either takes a callback that will be called when the
     * write has been done or returns a promise that will resolve when the write is done.
     */
    eraseWithAck(path: string): Promise<void>;
    eraseWithAck(path: string, callback: ((error: string) => void)): void;
    subscribe(path: string, callback: (data: any) => void, triggerNow?: boolean): void;
    unsubscribe(path: string, callback: (data: any) => void): void;
    discard(): void;
    delete(callback?: (error: string | null) => void): void | Promise<void>;
    setMergeStrategy(mergeStrategy: MergeStrategy): void;
}
