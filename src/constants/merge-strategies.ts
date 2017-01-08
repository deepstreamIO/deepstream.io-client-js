import { Record } from "../record/record";

export type MergeCallback = (error?: string, data?: any) => void;

export interface MergeStrategy {
	(record: Record, remoteValue: any, remoteVersion: number, callback: MergeCallback): void;
}

/**
 *	Choose the server's state over the client's
 **/
export function remoteWins(record: Record, remoteValue: any, remoteVersion: number, callback: MergeCallback): void {
	callback(undefined, remoteValue);
}

/**
 *	Choose the local state over the server's
 **/
export function localWins(record: Record, remoteValue: any, remoteVersion: number, callback: MergeCallback): void {
	callback(undefined, record.get());
}
