import { MergeStrategy } from './merge-strategy'

export class MergeStrategyService {

  private strategiesByRecord: Map<string, MergeStrategy>
  private strategiesByPattern: Map<string, MergeStrategy>
  private defaultStrategy: MergeStrategy | null

  constructor (defaultStrategy: MergeStrategy | null) {
    this.defaultStrategy = defaultStrategy
    this.strategiesByRecord = new Map()
    this.strategiesByPattern = new Map()
  }

  public setMergeStrategyByRecord (recordName: string, strategy: MergeStrategy) {
    this.strategiesByRecord.set(recordName, strategy)
  }

  public setMergeStrategyByPattern (recordName: string, strategy: MergeStrategy) {
    this.strategiesByPattern.set(recordName, strategy)
  }

  public merge (
    recordNameOrPattern: string, localVersion: number, localData: object, remoteVersion: number, remoteData: object, callback: (error: any, data: object) => void
  ): void {
    let strategy = this.strategiesByRecord.get(recordNameOrPattern)
    if (strategy) {
      return
    }

  //  this.services.logger.error(message, EVENT.RECORD_VERSION_EXISTS, { remoteVersion, record: this })
  }
}