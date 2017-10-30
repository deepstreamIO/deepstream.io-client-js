import { Record } from './record';
export declare type MergeStrategy = (record: Record, remoteValue: object, remoteVersion: number, callback: Function) => void;
/**
 *  Choose the server's state over the client's
**/
export declare const REMOTE_WINS: (record: Record, remoteValue: object, remoteVersion: number, callback: Function) => void;
/**
 *  Choose the local state over the server's
**/
export declare const LOCAL_WINS: (record: Record, remoteValue: object, remoteVersion: number, callback: Function) => void;
