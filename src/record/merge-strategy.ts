import { Record } from './record'
import { List } from './list'
import { AnonymousRecord } from './anonymous-record'
import { RecordCore } from './record-core'

export type MergeCompleteCallback = (error: string | null, mergedData: any) => void
export type MergeStrategy = (localValue: object, localVersion: number, remoteValue: object, remoteVersion: number, callback: MergeCompleteCallback) => void

/**
 *  Choose the server's state over the client's
**/
export const REMOTE_WINS = (localValue: object, localVersion: number, remoteValue: object, remoteVersion: number, callback: MergeCompleteCallback): void => {
  callback(null, remoteValue)
}
/**
 *  Choose the local state over the server's
**/
export const LOCAL_WINS = (localValue: object, localVersion: number, remoteValue: object, remoteVersion: number, callback: MergeCompleteCallback): void  => {
  callback(null, localValue)
}
