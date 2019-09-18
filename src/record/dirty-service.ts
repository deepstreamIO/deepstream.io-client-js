import { RecordOfflineStore } from '../deepstream-client'

export type DirtyRecordsIndex = Map<string, boolean>

export class DirtyService {
  private dirtyRecords: DirtyRecordsIndex = new Map()
  private loaded: boolean
  private loadedCallback: Array<{ callback: Function, context: any }> = []
  private flushTimeout: any | null = null

  constructor (private storage: RecordOfflineStore, private readonly dirtyStorageName: string) {
    this.loaded = false
    this.save = this.save.bind(this)
    this.load()
  }

  public isDirty (recordName: string): boolean {
    return this.dirtyRecords.has(recordName)
  }

  public setDirty (recordName: string, isDirty: boolean): void {
    let changed = true
    if (isDirty) {
      this.dirtyRecords.set(recordName, true)
    } else {
      changed = this.dirtyRecords.delete(recordName)
    }
    if (!this.flushTimeout && changed) {
      this.flushTimeout = setTimeout(this.save, 1000)
    }
  }

  public save () {
    this.storage.set(this.dirtyStorageName, 1, [...this.dirtyRecords] as any, () => {})
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout)
    }
    this.flushTimeout = null
  }

  public whenLoaded (context: any, callback: () => void): void {
    if (this.loaded) {
      callback.call(context)
      return
    }
    this.loadedCallback.push({ callback, context })
  }

  public getAll (): DirtyRecordsIndex {
    return this.dirtyRecords
  }

  private load (): void {
    if (this.loaded) {
      return
    }
    this.storage.get(this.dirtyStorageName, (recordName: string, version: number, data: any) => {
      this.dirtyRecords = data ? new Map(data) : new Map()
      this.loaded = true
      this.loadedCallback.forEach(({ callback, context }) =>
        callback.call(context)
      )
    })
  }
}
