import { RecordCore, WriteAckCallback } from './record-core';
import { MergeStrategy } from './merge-strategy';
import * as Emitter from 'component-emitter2';
export declare class AnonymousRecord extends Emitter {
    private record;
    private subscriptions;
    private getRecordCore;
    constructor(getRecordCore: (recordName: string) => RecordCore);
    readonly name: string;
    readonly isReady: boolean;
    readonly version: number;
    whenReady(callback?: ((record: AnonymousRecord) => void)): void | Promise<AnonymousRecord>;
    setName(recordName: string, callback: (record: AnonymousRecord) => void): void | Promise<AnonymousRecord>;
    get(path?: string): any;
    set(data: any, callback?: WriteAckCallback): void;
    setWithAck(data: any, callback?: ((error: string) => void)): Promise<void> | void;
    erase(path: string): void;
    eraseWithAck(path: string, callback?: ((error: string) => void)): Promise<void> | void;
    subscribe(path: string, callback: (data: any) => void, triggerNow?: boolean): void;
    unsubscribe(path: string, callback: (data: any) => void): void;
    discard(): void;
    delete(callback?: (error: string | null) => void): void | Promise<void>;
    setMergeStrategy(mergeStrategy: MergeStrategy): void;
}
