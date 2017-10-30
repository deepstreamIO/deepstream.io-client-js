import { TOPIC } from '../constants';
import { Services } from '../client';
export interface ListenResponse {
    accept: () => void;
    reject: (reason?: string) => void;
    onStop: (subscriptionName: string) => void;
}
export declare type ListenCallback = (subscriptionName: string, listenResponse: ListenResponse) => void;
export declare class Listener {
    private topic;
    private services;
    private listeners;
    constructor(topic: TOPIC, services: Services);
    listen(pattern: string, callback: ListenCallback): void;
    unlisten(pattern: string): void;
}
