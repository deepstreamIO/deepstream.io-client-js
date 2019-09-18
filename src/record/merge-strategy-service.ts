import { Services } from '../deepstream-client'
import { EVENT, RecordData, TOPIC } from '../constants'

import { MergeStrategy } from './merge-strategy'

export type MergeCompleteInternal = (error: string | null, recordName: string, mergedData: RecordData, localVersion: number, localData: RecordData, remoteVersion: number, remoteData: RecordData) => void
export class MergeStrategyService {

  private services: Services
  private strategiesByRecord: Map<string, MergeStrategy>
  private strategiesByPattern: Map<RegExp, MergeStrategy>
  private defaultStrategy: MergeStrategy | null

  constructor (services: Services, defaultStrategy: MergeStrategy | null) {
    this.services = services
    this.defaultStrategy = defaultStrategy
    this.strategiesByRecord = new Map()
    this.strategiesByPattern = new Map()
  }

  public setMergeStrategyByName (recordName: string, strategy: MergeStrategy) {
    this.strategiesByRecord.set(recordName, strategy)
  }

  public setMergeStrategyByPattern (pattern: RegExp, strategy: MergeStrategy) {
    this.strategiesByPattern.set(pattern, strategy)
  }

  public merge (
    recordName: string, localVersion: number, localData: RecordData, remoteVersion: number, remoteData: RecordData, callback: MergeCompleteInternal, context: any
  ): void {
    const exactMergeStrategy = this.strategiesByRecord.get(recordName)
    if (exactMergeStrategy) {
      exactMergeStrategy(localData, localVersion, remoteData, remoteVersion, (error, data) => {
        callback.call(context, error, recordName, data, remoteVersion, remoteData, localVersion, localData)
      })
      return
    }

    for (const [pattern, patternMergeStrategy] of this.strategiesByPattern) {
      if (pattern.test(recordName)) {
        patternMergeStrategy(localData, localVersion, remoteData, remoteVersion, (error, data) => {
          callback.call(context, error, recordName, data, remoteVersion, remoteData, localVersion, localData)
        })
        return
      }
    }

    if (this.defaultStrategy) {
      this.defaultStrategy(localData, localVersion, remoteData, remoteVersion, (error, data) => {
        callback.call(context, error, recordName, data, remoteVersion, remoteData, localVersion, localData)
      })
      return
    }

    this.services.logger.error({ topic: TOPIC.RECORD }, EVENT.RECORD_VERSION_EXISTS, { remoteVersion, recordName })
  }
}
