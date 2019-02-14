import { EVENT } from '../constants';
import { Services } from '../client';
import { Options } from '../client-options';
export declare type QueryResult = Array<string>;
export interface IndividualQueryResult {
    [key: string]: boolean;
}
export declare type SubscribeCallback = (user: string, online: boolean) => void;
export declare class PresenceHandler {
    private services;
    private globalSubscriptionEmitter;
    private subscriptionEmitter;
    private queryEmitter;
    private queryAllEmitter;
    private counter;
    private pendingSubscribes;
    private pendingUnsubscribes;
    private limboQueue;
    private flushTimeout;
    constructor(services: Services, options: Options);
    subscribe(callback: SubscribeCallback): void;
    subscribe(user: string, callback: SubscribeCallback): void;
    unsubscribe(userOrCallback?: string | SubscribeCallback, callback?: SubscribeCallback): void;
    getAll(): Promise<QueryResult>;
    getAll(users: Array<string>): Promise<IndividualQueryResult>;
    getAll(callback: (error: {
        reason: EVENT;
    }, result?: QueryResult) => void): void;
    getAll(users: Array<string>, callback: (error: {
        reason: EVENT;
    }, result?: IndividualQueryResult) => void): void;
    private handle;
    private sendQuery;
    private flush;
    private bulkSubscription;
    private subscribeToAllChanges;
    private unsubscribeToAllChanges;
    private registerFlushTimeout;
    private onConnectionReestablished;
    private onExitLimbo;
}
