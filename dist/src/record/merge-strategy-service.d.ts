import { Services } from '../client';
import { MergeStrategy } from './merge-strategy';
export declare type MergeCompleteInternal = (error: string | null, recordName: string, mergedData: any, localVersion: number, localData: object, remoteVersion: number, remoteData: object) => void;
export declare class MergeStrategyService {
    private services;
    private strategiesByRecord;
    private strategiesByPattern;
    private defaultStrategy;
    constructor(services: Services, defaultStrategy: MergeStrategy | null);
    setMergeStrategyByName(recordName: string, strategy: MergeStrategy): void;
    setMergeStrategyByPattern(pattern: RegExp, strategy: MergeStrategy): void;
    merge(recordName: string, localVersion: number, localData: object, remoteVersion: number, remoteData: object, callback: MergeCompleteInternal): void;
}
