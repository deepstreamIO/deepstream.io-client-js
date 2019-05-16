import { RecordOfflineStore, offlineStoreWriteResponse } from '../client'
import { Options } from '../client-options'
import {RecordData} from '../../binary-protocol/src/message-constants'

enum Operation {
    GET,
    SET,
    DELETE
}

interface Request {
    operation: Operation,
    recordName: string,
    version?: number,
    data?: RecordData,
    callback: any
}

export class Storage implements RecordOfflineStore {
  public isReady: boolean = false
  private db: any
  private queuedRequests: Array<Request> = []
  private flushTimeout: NodeJS.Timeout | null = null

  private indexedDB = window.indexedDB

  constructor (options: Options) {
    if (typeof this.indexedDB === 'undefined' || this.indexedDB === null) {
      throw new Error('IndexDB currently not supported when deepstream in node')
    }
    this.flush = this.flush.bind(this)

    const request = window.indexedDB.open(options.storageDatabaseName, 1)
    request.onerror = event => {
        // TODO: Workflow for lack of permissions to use indexDB
    }
    request.onsuccess = (event: any) => {
        this.db = event.target.result
        this.onReady()
    }
    request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('records')) {
            db.createObjectStore('records', { keyPath: 'name' })
        }
    }
  }

  public get (recordName: string, callback: ((recordName: string, version: number, data: RecordData) => void)) {
    this.queuedRequests.push({ recordName, callback, operation: Operation.GET })
    this.registerFlush()
  }

  public set (recordName: string, version: number, data: RecordData, callback: offlineStoreWriteResponse) {
    this.queuedRequests.push({ recordName, version, callback, operation: Operation.SET })
    this.registerFlush()
  }

  public delete (recordName: string, callback: offlineStoreWriteResponse) {
    this.queuedRequests.push({ recordName, callback, operation: Operation.DELETE })
    this.registerFlush()
  }

  private registerFlush () {
      if (this.isReady && !this.flushTimeout) {
        this.flushTimeout = setTimeout(this.flush, 50)
      }
  }

  private flush () {
      const transaction = this.db.transaction(['records'], 'readwrite')
      const objectStore = transaction.objectStore('records')

      this.queuedRequests.forEach(({ operation, recordName, version, data, callback }) => {
          switch (operation) {
              case Operation.GET: {
                  const request = objectStore.get(recordName)
                  // The api doesn't support get errors yet!
                  request.onerror = (event: any) => {
                      console.log(event)
                      throw new Error(`Requesting record ${recordName} failed`)
                  }
                  request.onsuccess = () => {
                      if (request.result) {
                          callback(request.result.name, request.result.version, request.result.data)
                      } else {
                          callback(recordName, -1, null)
                      }
                  }
                  break
              }
              case Operation.DELETE: {
                  const request = objectStore.delete(recordName)
                  request.onsuccess = () => callback(null)
                  request.onerror = (event: any) => callback(event.errorCode)
                  break
              }
              case Operation.SET: {
                  const request = objectStore.put({ name: recordName, version, data })
                  request.onsuccess = () => callback(null)
                  request.onerror = (event: any) => callback(event.errorCode)
                  break
              }
          }
      })
      this.queuedRequests = []
      this.flushTimeout = null
  }

  private onReady () {
      this.isReady = true
      this.flush()
  }
}
