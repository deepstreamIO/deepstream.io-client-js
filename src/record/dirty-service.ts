import * as Emitter from 'component-emitter2'
import { Options } from '../client-options'
import { RecordOfflineStore, offlineStoreWriteResponse } from '../client'
export type DirtyRecords = { [recordName: string]: boolean }

const version = 1
const DIRTY_SERVICE_LOADED = 'dirty-service-loaded'

export class DirtyService {
  private name: string
  private storage: RecordOfflineStore
  private dirtyRecords: DirtyRecords
  private loaded: boolean
  private emitter: Emitter

  constructor (storage: RecordOfflineStore, dirtyStorageName: string) {
    this.storage = storage
    this.name = dirtyStorageName
    this.loaded = false
    this.emitter = new Emitter()
    this.load()
  }

  public isDirty (recordName: string): boolean {
    if (this.dirtyRecords[recordName] !== undefined) {
      return this.dirtyRecords[recordName]
    }
    return false
  }

  public setDirty (recordName: string, isDirty: boolean, callback: offlineStoreWriteResponse): void {
    if (this.loaded) {
      this.updateDirtyRecords(recordName, isDirty, callback)
      return
    }
    this.emitter.once(DIRTY_SERVICE_LOADED, () => {
      this.updateDirtyRecords(recordName, isDirty, callback)
    })
  }

  public whenLoaded (callback: (data: DirtyRecords) => void): void {
    if (this.loaded) {
      callback(this.dirtyRecords)
      return
    }
    this.emitter.once(DIRTY_SERVICE_LOADED, () => {
      callback(this.dirtyRecords)
    })
  }

  private load (): void {
    if (this.loaded) {
      return
    }
    this.storage.get(this.name, (recordName, version, data) => {
      this.dirtyRecords = version !== -1 ? data as DirtyRecords : {}
      this.loaded = true
      this.emitter.emit(DIRTY_SERVICE_LOADED)
    })
  }

  private updateDirtyRecords (recordName: string, isDirty: boolean, callback: offlineStoreWriteResponse): void {
    this.dirtyRecords[recordName] = isDirty
    this.storage.set(this.name, version, this.dirtyRecords, callback)
  }

}
