import { Record } from "../record/Record";

export type MergeCallback = (error?: string, data?: any) => void;

export interface MergeStrategy {
    (record: Record, remoteValue: any, remoteVersion: number, callback: MergeCallback): void;
}

/**
 *    Choose the server's state over the client's
 **/
export function RemoteWins(record: Record, remoteValue: any, remoteVersion: number, callback: MergeCallback): void {
    callback(undefined, remoteValue);
}

/**
 *    Choose the local state over the server's
 **/
export function LocalWins(record: Record, remoteValue: any, remoteVersion: number, callback: MergeCallback): void {
    callback(undefined, record.get());
}
