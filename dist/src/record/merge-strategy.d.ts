import { Record } from './record';
import { List } from './list';
import { AnonymousRecord } from './anonymous-record';
import { RecordCore } from './record-core';
export declare type MergeStrategy = (record: Record | AnonymousRecord | List | RecordCore, remoteValue: object, remoteVersion: number, callback: Function) => void;
/**
 *  Choose the server's state over the client's
**/
export declare const REMOTE_WINS: (record: Record, remoteValue: object, remoteVersion: number, callback: Function) => void;
/**
 *  Choose the local state over the server's
**/
export declare const LOCAL_WINS: (record: Record, remoteValue: object, remoteVersion: number, callback: Function) => void;
