export declare type MergeCompleteCallback = (error: string | null, mergedData: any) => void;
export declare type MergeStrategy = (localValue: object, localVersion: number, remoteValue: object, remoteVersion: number, callback: MergeCompleteCallback) => void;
/**
 *  Choose the server's state over the client's
**/
export declare const REMOTE_WINS: (localValue: object, localVersion: number, remoteValue: object, remoteVersion: number, callback: MergeCompleteCallback) => void;
/**
 *  Choose the local state over the server's
**/
export declare const LOCAL_WINS: (localValue: object, localVersion: number, remoteValue: object, remoteVersion: number, callback: MergeCompleteCallback) => void;
