import { RecordOfflineStore, offlineStoreWriteResponse } from '../deepstream-client'
import { Options } from '../client-options'
import { RecordData } from '../constants'

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
  private isReady: boolean = false
  private db: any
  private queuedRequests: Map<string, Request[]> = new Map()
  private flushTimeout: number | null = null

  constructor (private options: Options) {
    if (typeof indexedDB === 'undefined' || indexedDB === null) {
      throw new Error('IndexDB currently not supported when deepstream in node')
    }
    this.flush = this.flush.bind(this)

    const { objectStoreNames, storageDatabaseName, defaultObjectStoreName, primaryKey } = options.indexdb

    if (!objectStoreNames.includes(defaultObjectStoreName)) {
        objectStoreNames.push(defaultObjectStoreName)
    }

    let dbVersion = options.indexdb.dbVersion
    if (options.indexdb.autoVersion) {
        const previousDBStructureSerialized = localStorage.getItem(`deepstream-db/${storageDatabaseName}`)
        if (previousDBStructureSerialized) {
            const previousDBStructure = JSON.parse(previousDBStructureSerialized)
            const objectStoreChanged = (
                previousDBStructure.objectStoreNames.length !== objectStoreNames.length ||
                previousDBStructure.objectStoreNames.some((name: string) => !objectStoreNames.includes(name))
            )
            if (objectStoreChanged) {
                dbVersion = previousDBStructure.dbVersion + 1
            } else {
                dbVersion = previousDBStructure.dbVersion
            }
        } else {
            dbVersion = 1
        }
    }

    const request = indexedDB.open(storageDatabaseName, dbVersion)
    request.onerror = event => {
        console.error(`Error opening index ${storageDatabaseName}`, event)
        // TODO: Workflow for lack of permissions to use indexDB
    }
    request.onsuccess = (event: any) => {
        this.db = event.target.result
        this.onReady()
    }
    request.onupgradeneeded = () => {
        const db = request.result

        objectStoreNames.forEach(objectStoreName => {
            if (!db.objectStoreNames.contains(objectStoreName)) {
                db.createObjectStore(objectStoreName, { keyPath: primaryKey })
            }
        })

        for (let i = 0; i < db.objectStoreNames.length; i++) {
            if (objectStoreNames.includes(db.objectStoreNames[i]) === false) {
                db.deleteObjectStore(db.objectStoreNames[i])
            }
        }

        if (options.indexdb.autoVersion) {
            localStorage.setItem(`deepstream-db/${storageDatabaseName}`, JSON.stringify({ dbVersion, objectStoreNames }))
        }
    }
  }

  public get (recordName: string, callback: ((recordName: string, version: number, data: RecordData) => void)) {
    const ignore = this.options.indexdb.ignorePrefixes.some(prefix => recordName.startsWith(prefix))
    if (ignore) {
        callback(recordName, -1, null)
        return
    }

    this.insertRequest({ recordName, callback, operation: Operation.GET })
  }

  public set (recordName: string, version: number, data: RecordData, callback: offlineStoreWriteResponse) {
    const ignore = this.options.indexdb.ignorePrefixes.some(prefix => recordName.startsWith(prefix))
    if (ignore) {
        callback(null, recordName)
        return
    }

    this.insertRequest({ recordName, version, callback, data, operation: Operation.SET })
  }

  public delete (recordName: string, callback: offlineStoreWriteResponse) {
    const ignore = this.options.indexdb.ignorePrefixes.some(prefix => recordName.startsWith(prefix))
    if (ignore) {
        callback(null, recordName)
        return
    }

    this.insertRequest({ recordName, callback, operation: Operation.DELETE })
  }

  public reset (callback: (error: string | null) => void) {
    if (this.db) {
        this.db.close()
        this.db = null
    }

    const deleteDBReqeust = indexedDB.deleteDatabase(this.options.indexdb.storageDatabaseName)
    deleteDBReqeust.onblocked = () => setTimeout(() => this.reset(callback), 1000)
    deleteDBReqeust.onsuccess = () => callback(null)
    deleteDBReqeust.onerror = event => {
        const errorMessage = `Error deleting database ${this.options.indexdb.storageDatabaseName}`
        console.error(errorMessage, event)
        callback(errorMessage)
    }
  }

  private registerFlush () {
      if (this.isReady && !this.flushTimeout) {
        this.flushTimeout = setTimeout(this.flush, this.options.indexdb.flushTimeout) as never as number
      }
  }

  private flush () {
      const transaction = this.db.transaction(this.queuedRequests.keys(), 'readwrite')

      for (const [key, queuedRequests] of this.queuedRequests) {
        const objectStore = transaction.objectStore(key)
        queuedRequests.forEach(({ operation, recordName, version, data, callback }) => {
            switch (operation) {
                case Operation.GET: {
                    const request = objectStore.get(recordName)
                    // The api doesn't support get errors yet!
                    request.onerror = (event: any) => {
                        throw new Error(`Requesting record ${recordName} failed`)
                    }
                    request.onsuccess = () => {
                        if (request.result) {
                            callback(recordName, request.result.version, request.result.data)
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
                    const request = objectStore.put({ [this.options.indexdb.primaryKey]: recordName, version, data })
                    request.onsuccess = () => callback(null)
                    request.onerror = (event: any) => callback(event.errorCode)
                    break
                }
            }
        })
      }
      this.queuedRequests.clear()
      this.flushTimeout = null
  }

  private onReady () {
      this.isReady = true
      this.flush()
  }

  private insertRequest (request: Request) {
    const firstSlashIndex = request.recordName.indexOf('/')
    let objectStoreName
    if (firstSlashIndex > -1) {
        objectStoreName = request.recordName.substring(0, firstSlashIndex)
        if (this.options.indexdb.objectStoreNames.indexOf(objectStoreName) === -1) {
            console.error(`Object store names need to be predefined, missing ${objectStoreName}. Using default objectStore instead.`)
            objectStoreName = this.options.indexdb.defaultObjectStoreName
        } else {
            request.recordName = request.recordName.substring(firstSlashIndex + 1, request.recordName.length)
        }
    } else {
        objectStoreName = this.options.indexdb.defaultObjectStoreName
    }
    const requests = this.queuedRequests.get(objectStoreName)
    if (requests === undefined) {
        this.queuedRequests.set(objectStoreName, [request])
    } else {
        requests.push(request)
    }
    this.registerFlush()
  }
}
