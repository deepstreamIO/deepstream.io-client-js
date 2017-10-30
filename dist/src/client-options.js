"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge_strategy_1 = require("./record/merge-strategy");
exports.DefaultOptions = {
    heartbeatInterval: 30000,
    reconnectIntervalIncrement: 4000,
    maxReconnectInterval: 180000,
    maxReconnectAttempts: 5,
    rpcAckTimeout: 6000,
    rpcResponseTimeout: 10000,
    subscriptionTimeout: 2000,
    recordReadAckTimeout: 15000,
    recordReadTimeout: 15000,
    recordDeleteTimeout: 15000,
    path: '/deepstream',
    mergeStrategy: merge_strategy_1.REMOTE_WINS,
    nodeSocketOptions: null
};
//# sourceMappingURL=client-options.js.map