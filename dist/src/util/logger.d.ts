import { EVENT } from '../constants';
import { TOPIC, ALL_ACTIONS, Message } from '../../binary-protocol/src/message-constants';
export declare class Logger {
    private emitter;
    constructor(emitter: Emitter);
    warn(message: {
        topic: TOPIC;
    } | Message, event?: EVENT | ALL_ACTIONS, meta?: any): void;
    error(message: {
        topic: TOPIC;
    } | Message, event?: EVENT | ALL_ACTIONS, meta?: string | object): void;
}
