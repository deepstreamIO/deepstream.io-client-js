import { TOPIC, EventMessage, RecordMessage } from '../../binary-protocol/src/message-constants';
import { Services } from '../client';
export interface ListenResponse {
    accept: () => void;
    reject: (reason?: string) => void;
    onStop: (callback: (subscriptionName: string) => void) => void;
}
export declare type ListenCallback = (subscriptionName: string, listenResponse: ListenResponse) => void;
export declare class Listener {
    private topic;
    private actions;
    private services;
    private listeners;
    private stopCallbacks;
    constructor(topic: TOPIC, services: Services);
    listen(pattern: string, callback: ListenCallback): void;
    unlisten(pattern: string): void;
    private accept(pattern, subscription);
    private reject(pattern, subscription);
    private stop(subscription, callback);
    handle(message: EventMessage | RecordMessage): void;
    private onConnectionLost();
    private onConnectionReestablished();
    private sendListen(pattern);
    private sendUnlisten(pattern);
}
