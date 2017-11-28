import { Record } from './record'
import { List } from './list'
import { AnonymousRecord } from './anonymous-record'
import { RecordCore } from './record-core'

export type MergeStrategy = (localValue: object, localVersion: number, remoteValue: object, remoteVersion: number, callback: Function) => void

/**
 *  Choose the server's state over the client's
**/
export const REMOTE_WINS = (localValue: object, localVersion: number, remoteValue: object, remoteVersion: number, callback: Function): void => {
  callback(null, remoteValue)
}
/**
 *  Choose the local state over the server's
**/
export const LOCAL_WINS = (localValue: object, localVersion: number, remoteValue: object, remoteVersion: number, callback: Function): void  => {
  callback(null, localValue)
}
