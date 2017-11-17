import { RECORD_ACTIONS as RA } from './message-constants';
export declare function isWriteAck(action: RA): boolean;
export declare const ACTION_TO_WRITE_ACK: {
    [key: number]: RA;
};
/**
 * Like reverseMap but the values will be cast using Number(k)
 */
export declare function reverseMapNumeric(map: {
    [k: number]: number;
}): {
    [k: number]: number;
};
export declare const WRITE_ACK_TO_ACTION: {
    [k: number]: number;
};
