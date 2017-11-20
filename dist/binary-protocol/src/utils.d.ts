import { RECORD_ACTIONS as RA } from './message-constants';
export declare function isWriteAck(action: RA): boolean;
export declare const ACTION_TO_WRITE_ACK: {
    [key: number]: RA;
};
