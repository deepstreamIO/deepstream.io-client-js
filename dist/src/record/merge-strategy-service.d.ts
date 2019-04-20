import { Services } from '../client';
import { RecordData } from '../../binary-protocol/src/message-constants';
import { MergeStrategy } from './merge-strategy';
export declare type MergeCompleteInternal = (error: string | null, recordName: string, mergedData: RecordData, localVersion: number, localData: RecordData, remoteVersion: number, remoteData: RecordData) => void;
export declare class MergeStrategyService {
    private services;
    private strategiesByRecord;
    private strategiesByPattern;
    private defaultStrategy;
    constructor(services: Services, defaultStrategy: MergeStrategy | null);
    setMergeStrategyByName(recordName: string, strategy: MergeStrategy): void;
    setMergeStrategyByPattern(pattern: RegExp, strategy: MergeStrategy): void;
    merge(recordName: string, localVersion: number, localData: RecordData, remoteVersion: number, remoteData: RecordData, callback: MergeCompleteInternal): void;
}
