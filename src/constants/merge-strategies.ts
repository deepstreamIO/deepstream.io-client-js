import { Record } from "../record/record";

export interface MergeStrategy {
	(record: Record, remoteValue: any, remoteVersion: number, callback: any): void; // TODO: Callback type
}

/**
 *	Choose the server's state over the client's
 **/
export function remoteWins(record: Record, remoteValue: any, remoteVersion: number, callback: any): void {

}

/**
 *	Choose the local state over the server's
 **/
export function localWins(record: Record, remoteValue: any, remoteVersion: number, callback: any): void {

}
