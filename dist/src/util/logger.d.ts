import { EVENT } from '../constants';
export declare class Logger {
    warn(message: Message, event?: EVENT, log?: string): void;
    error(message: Message, event?: EVENT, log?: string): void;
}
