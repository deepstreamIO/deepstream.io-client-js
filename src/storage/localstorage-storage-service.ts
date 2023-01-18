import { RecordOfflineStore, offlineStoreWriteResponse } from '../deepstream-client'
import { Options } from '../client-options'
import { RecordData } from '../constants'

export class LocalstorageStorage implements RecordOfflineStore {
  public isReady = true
  private storage: any

  constructor (private options: Options) {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      try {
        const LocalStorage = require('node-localstorage').LocalStorage
        this.storage = new LocalStorage(options.localstorage.nodeStoragePath, options.localstorage.nodeStorageSize * 1024 * 1024)
      } catch (e) {
        throw new Error('Attempting to use localStorage outside of browser without node-localstorage polyfill')
      }
    } else {
      this.storage = localStorage
    }
  }

  public get (recordName: string, callback: ((recordName: string, version: number, data: RecordData) => void)) {
    const ignore = this.options.ignorePrefixes.some(prefix => recordName.startsWith(prefix))
    if (ignore) {
        callback(recordName, -1, null)
        return
    }

    const item = this.storage.getItem(recordName)
    if (item) {
      const doc = JSON.parse(item)
      setTimeout(callback.bind(this, recordName, doc.version, doc.data), 0)
      return
    }
    setTimeout(callback.bind(this, recordName, -1, null), 0)
  }

  public set (recordName: string, version: number, data: RecordData, callback: offlineStoreWriteResponse) {
    const ignore = this.options.ignorePrefixes.some(prefix => recordName.startsWith(prefix))
    if (ignore) {
        callback(null, recordName)
        return
    }

    this.storage.setItem(recordName, JSON.stringify({ recordName, version, data }))
    setTimeout(callback, 0)
  }

  public delete (recordName: string, callback: offlineStoreWriteResponse) {
    const ignore = this.options.ignorePrefixes.some(prefix => recordName.startsWith(prefix))
    if (ignore) {
        callback(null, recordName)
        return
    }

    this.storage.removeItem(recordName)
    setTimeout(callback, 0)
  }

  public reset (callback: (error: string | null) => void) {
    try {
      this.storage.clear()
      callback(null)
    } catch (error: any) {
      callback(error)
    }
  }
}
