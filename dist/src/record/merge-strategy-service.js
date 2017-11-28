"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MergeStrategyService {
    constructor(defaultStrategy) {
        this.defaultStrategy = defaultStrategy;
        this.strategiesByRecord = new Map();
        this.strategiesByPattern = new Map();
    }
    setMergeStrategyByRecord(recordName, strategy) {
        this.strategiesByRecord.set(recordName, strategy);
    }
    setMergeStrategyByPattern(recordName, strategy) {
        this.strategiesByPattern.set(recordName, strategy);
    }
    merge(recordNameOrPattern, localVersion, localData, remoteVersion, remoteData, callback) {
        let strategy = this.strategiesByRecord.get(recordNameOrPattern);
        if (strategy) {
            return;
        }
        //  this.services.logger.error(message, EVENT.RECORD_VERSION_EXISTS, { remoteVersion, record: this })
    }
}
exports.MergeStrategyService = MergeStrategyService;
//# sourceMappingURL=merge-strategy-service.js.map