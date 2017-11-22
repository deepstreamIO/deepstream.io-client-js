import { RECORD_ACTIONS as RA, PRESENCE_ACTIONS as PA, RPC_ACTIONS as RPC } from './message-constants';
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
export declare const RESPONSE_TO_REQUEST: {
    [topic: number]: {
        [action: number]: RA | PA | RPC;
    };
};
