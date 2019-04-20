import { RecordOfflineStore, offlineStoreWriteResponse } from '../client'
import { Options } from '../client-options'
import {RecordData} from '../../binary-protocol/src/message-constants'

export class Storage implements RecordOfflineStore {
  private storage: any

  constructor (options: Options) {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      const LocalStorage = require('node-localstorage').LocalStorage
      this.storage = new LocalStorage(options.nodeStoragePath, options.nodeStorageSize * 1024 * 1024)
    } else {
      this.storage = window.localStorage
    }
  }

  public get (recordName: string, callback: ((recordName: string, version: number, data: RecordData) => void)) {
    const item = this.storage.getItem(recordName)
    if (item) {
      const doc = JSON.parse(item)
      setTimeout(callback.bind(this, recordName, doc.version, doc.data), 0)
      return
    }
    setTimeout(callback.bind(this, recordName, -1, null), 0)
  }

  public set (recordName: string, version: number, data: RecordData, callback: offlineStoreWriteResponse) {
    this.storage.setItem(recordName, JSON.stringify({ recordName, version, data }))
    setTimeout(callback, 0)
  }

  public delete (recordName: string, callback: offlineStoreWriteResponse) {
    this.storage.removeItem(recordName)
    setTimeout(callback, 0)
  }
}
