import { RecordCore, WriteAckCallback } from './record-core';
import { MergeStrategy } from './merge-strategy';
import * as Emitter from 'component-emitter2';
export declare class Record extends Emitter {
    private record;
    private subscriptions;
    constructor(record: RecordCore);
    readonly name: string;
    readonly isReady: boolean;
    readonly version: number;
    whenReady(callback?: ((record: Record) => void)): void | Promise<Record>;
    get(path?: string): any;
    set(data: any, callback?: WriteAckCallback): void;
    setWithAck(data: any, callback?: ((error: string) => void)): Promise<void> | void;
    subscribe(path: string, callback: (data: any) => void, triggerNow?: boolean): void;
    unsubscribe(path: string, callback: (data: any) => void): void;
    discard(): void;
    delete(callback?: (error: string | null) => void): void | Promise<void>;
    setMergeStrategy(mergeStrategy: MergeStrategy): void;
}
