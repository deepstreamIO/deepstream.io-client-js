import * as Emitter from 'component-emitter2'
import { RecordOfflineStore } from '../client'
import {RecordData} from '../../binary-protocol/src/message-constants'

const DIRTY_SERVICE_LOADED = 'dirty-service-loaded'
export interface DirtyRecordsIndex { [index: string]: boolean }

export class DirtyService {
  private readonly name: string
  private storage: RecordOfflineStore
  private dirtyRecords: DirtyRecordsIndex
  private loaded: boolean
  private emitter: Emitter

  constructor (storage: RecordOfflineStore, dirtyStorageName: string) {
    this.storage = storage
    this.name = dirtyStorageName
    this.loaded = false
    this.emitter = new Emitter()
    this.dirtyRecords = {}
    this.load()
  }

  public isDirty (recordName: string): boolean {
    return !!this.dirtyRecords[recordName]
  }

  public setDirty (recordName: string, isDirty: boolean): void {
    if (isDirty) {
      this.dirtyRecords[recordName] = true
    } else {
      delete this.dirtyRecords[recordName]
    }
    this.storage.set(this.name, 1, this.dirtyRecords, () => {})
  }

  public whenLoaded (callback: () => void): void {
    if (this.loaded) {
      callback()
      return
    }
    this.emitter.once(DIRTY_SERVICE_LOADED, () => {
      callback()
    })
  }

  public getAll (): DirtyRecordsIndex {
    return this.dirtyRecords
  }

  private load (): void {
    if (this.loaded) {
      return
    }
    this.storage.get(this.name, (recordName: string, version: number, data: RecordData) => {
      // @ts-ignore
      this.dirtyRecords = data || {}
      this.loaded = true
      this.emitter.emit(DIRTY_SERVICE_LOADED)
    })
  }
}
