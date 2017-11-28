import { RecordOfflineStore, offlineStoreWriteResponse } from '../client'
import { Options } from '../client-options'

export class Storage implements RecordOfflineStore {
  private storage: any

  constructor (options: Options) {
    if (typeof localStorage === "undefined" || localStorage === null) {
      const LocalStorage = require('node-localstorage').LocalStorage
      this.storage = new LocalStorage(options.nodeStoragePath, options.nodeStorageSize * 1024 * 1024)
    } else {
      this.storage = window.localStorage
    }
  }

  public get (recordName: string, callback: ((recordName: string, version: number, data: Array<string> | object | null) => void)) {
    const item = this.storage.getItem(recordName)
    if (item) {
      const doc = JSON.parse(item)
      callback(recordName, doc.version, doc.data)
      return
    }
    callback(recordName, -1, null)
  }

  public set (recordName: string, version: number, data: Array<string> | object, callback: offlineStoreWriteResponse) {
    this.storage.setItem(recordName, JSON.stringify({ recordName, version, data }))
    callback()
  }

  public delete (recordName: string, callback: offlineStoreWriteResponse) {
    this.storage.removeItem(recordName)
    callback()
  }
}
