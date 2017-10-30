import { Services } from '../client';
export declare class Record {
    private services;
    private emitter;
    private data;
    constructor(services: Services);
    get(): object;
}
