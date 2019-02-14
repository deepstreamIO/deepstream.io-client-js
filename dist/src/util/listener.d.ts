import { TOPIC, ListenMessage } from '../../binary-protocol/src/message-constants';
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
    private accept;
    private reject;
    private stop;
    handle(message: ListenMessage): void;
    private onConnectionLost;
    private onConnectionReestablished;
    private sendListen;
    private sendUnlisten;
}
