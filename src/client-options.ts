import { MergeStrategy, REMOTE_WINS } from './record/merge-strategy'

export interface Options {
    /**
     * A global merge strategy that is applied whenever two clients write to the same record at the same time. Can be overwritten on a per record level.
     * Default merge strategies are exposed by the client constructor. It's also possible to write custom merge strategies as functions. You can find
     * more on handling data conflicts here
     * Default: MERGE_STRATEGIES.REMOTE_WINS
     */
    mergeStrategy: MergeStrategy
    /**
     * Specifies the number of milliseconds by which the time until the next reconnection attempt will be incremented after every unsuccessful attempt.
     * E.g.for 1500: if the connection is lost,the client will attempt to reconnect immediately, if that fails it will try again after 1.5 seconds,
     * if that fails it will try again after 3 seconds and so on...
     * Default: 4000
     */
    reconnectIntervalIncrement: number
    /**
     * The number of reconnection attempts until the client gives up and declares the connection closed.
     * Default: 5
     */
    maxReconnectAttempts: number
    /** The number of milliseconds after which a RPC will error if no Ack-message has been received.
     * Default: 6000
     */
    rpcAcceptTimeout: number
    /** The number of milliseconds after which a RPC will error if no response-message has been received.
     * Default: 10000
     */
    rpcResponseTimeout: number
    /** The number of milliseconds that can pass after providing/unproviding a RPC or subscribing/unsubscribing/listening to a record or event before an error is thrown.
     * Default: 2000
     */
    subscriptionTimeout: number
    /** The number of milliseconds from the moment client.record.getRecord() is called until an error is thrown since no ack message has been received.
     * Default: 1000
     */
    recordReadAckTimeout: number
    /**
     * The number of milliseconds from the moment client.record.getRecord() is called until an error is thrown since no data has been received.
     * Default: 3000
     */
    recordReadTimeout: number
    /** The number of milliseconds from the moment record.delete() is called until an error is thrown since no delete ack message has been received. Please
     * take into account that the deletion is only complete after the record has been deleted from both cache and storage.
     * Default: 3000
     */
    recordDeleteTimeout: number
    /**
     * The number of milliseconds operations will wait for the connection to become stable before returning with `CLIENT_OFFLINE`
     * Default: 2000
     */
    offlineBufferTimeout: number
    /**
     * The path to connect to for browser connections.
     * Default: /deepstream
     */
    path: string,
    /**
     * How often you expect the heartbeat to be sent.
     *                                             If two heatbeats are missed in a row the client
     *                                             will consider the server to have disconnected
     *                                             and will close the connection in order to
     *                                             establish a new one.
     */
    heartbeatInterval: number,
    /**
     * Specifies the maximum number of milliseconds for
     *                                             the reconnectIntervalIncrement
     *                                             The amount of reconnections will reach this value
     *                                             then reconnectIntervalIncrement will be ignored.
     */
    maxReconnectInterval: number,

    recordDeepCopy: boolean,
    discardTimeout: 5000,

    /**
     * Options for the provided socket factory
     */
    socketOptions: any,
    /**
     * dirtyStorageName is used as a key to save offline dirty records states
     * Default: __ds__dirty_records
     */
    dirtyStorageName: string,
    /**
     * nodeStoragePath specifies the disk location to save records
     * Default: ./local-storage
     */
    nodeStoragePath: string,
    /**
     * nodeStorageSize specifies maximum database size in megabytes
     * Default: 5
     */
    nodeStorageSize: number

    /**
     * blbalbla
     */
    lazyConnect: boolean
}

export const DefaultOptions: Options = {
    heartbeatInterval: 30000,
    reconnectIntervalIncrement: 4000,
    maxReconnectInterval: 180000,
    maxReconnectAttempts: 5,
    rpcAcceptTimeout: 6000,
    rpcResponseTimeout: 10000,
    subscriptionTimeout: 2000,
    recordReadAckTimeout: 15000,
    recordReadTimeout: 15000,
    recordDeleteTimeout: 15000,
    offlineBufferTimeout: 2000,
    discardTimeout: 5000,
    path: '/deepstream',
    mergeStrategy: REMOTE_WINS,
    recordDeepCopy: true,
    socketOptions: null,
    dirtyStorageName: '__ds__dirty_records',
    nodeStoragePath: './local-storage',
    nodeStorageSize: 5,
    lazyConnect: false
}
