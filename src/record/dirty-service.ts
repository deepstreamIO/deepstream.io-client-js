import * as Emitter from 'component-emitter2'
import { RecordOfflineStore } from '../client'

const DIRTY_SERVICE_LOADED = 'dirty-service-loaded'

export class DirtyService {
  private name: string
  private storage: RecordOfflineStore
  private dirtyRecords: any
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
    return !!this.dirtyRecords[recordName]
  }

  public setDirty (recordName: string, isDirty: boolean): void {
    this.updateDirtyRecords(recordName, isDirty)
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

  public getAll (): Map<string, boolean> {
    return this.dirtyRecords
  }

  private load (): void {
    if (this.loaded) {
      return
    }
    this.storage.get(this.name, (recordName: string, version: number, data: Array<string> | object | null) => {
      this.dirtyRecords = version !== -1 ? data : {}
      this.loaded = true
      this.emitter.emit(DIRTY_SERVICE_LOADED)
    })
  }

  private updateDirtyRecords (recordName: string, isDirty: boolean): void {
    if (isDirty) {
      this.dirtyRecords[recordName] = true
    } else {
      delete this.dirtyRecords[recordName]
    }
    this.storage.set(this.name, 1, this.dirtyRecords, () => {})
  }
}
