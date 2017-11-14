import { RECORD_ACTIONS as RA } from './message-constants';
export declare const HEADER_LENGTH = 8;
export declare const META_PAYLOAD_OVERFLOW_LENGTH: number;
export declare function isWriteAck(action: RA): boolean;
export declare const actionToWriteAck: {
    [key: number]: RA;
};
