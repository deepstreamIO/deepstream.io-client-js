import { MergeStrategy } from './merge-strategy';
export declare class MergeStrategyService {
    private strategiesByRecord;
    private strategiesByPattern;
    private defaultStrategy;
    constructor(defaultStrategy: MergeStrategy | null);
    setMergeStrategyByRecord(recordName: string, strategy: MergeStrategy): void;
    setMergeStrategyByPattern(recordName: string, strategy: MergeStrategy): void;
    merge(recordNameOrPattern: string, localVersion: number, localData: object, remoteVersion: number, remoteData: object, callback: (error: any, data: object) => void): void;
}
