import { Record } from './record'

export type MergeStrategy = (record: Record, remoteValue: object, remoteVersion: number, callback: Function) => void

/**
 *  Choose the server's state over the client's
**/
export const REMOTE_WINS = (record: Record, remoteValue: object, remoteVersion: number, callback: Function): void => {
  callback(null, remoteValue)
}
/**
 *  Choose the local state over the server's
**/
export const LOCAL_WINS = (record: Record, remoteValue: object, remoteVersion: number, callback: Function): void  => {
  callback(null, record.get())
}
