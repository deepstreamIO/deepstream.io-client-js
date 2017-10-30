import { Services } from '../client';
import { Options } from '../client-options';
export declare class RecordHandler {
    private services;
    private emitter;
    private options;
    constructor(services: Services, options: Options);
    handle(): void;
}
