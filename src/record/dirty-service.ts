import { RecordOfflineStore } from '../client'

export type DirtyRecordsIndex = Map<string, boolean>

export class DirtyService {
  private dirtyRecords: DirtyRecordsIndex = new Map()
  private loaded: boolean
  private loadedCallback: Array<{ callback: Function, context: any }> = []

  constructor (private storage: RecordOfflineStore, private readonly dirtyStorageName: string) {
    this.loaded = false
    this.load()
  }

  public isDirty (recordName: string): boolean {
    return this.dirtyRecords.has(recordName)
  }

  public setDirty (recordName: string, isDirty: boolean): void {
    if (isDirty) {
      this.dirtyRecords.set(recordName, true)
    } else {
      this.dirtyRecords.delete(recordName)
    }
    this.storage.set(this.dirtyStorageName, 1, [...this.dirtyRecords] as any, () => {})
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
