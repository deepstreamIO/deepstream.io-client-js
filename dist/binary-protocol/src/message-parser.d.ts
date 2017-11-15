/// <reference types="node" />
import { Message, ParseResult } from './message-constants';
export interface RawMessage {
    fin: boolean;
    topic: number;
    action: number;
    meta?: Buffer;
    payload?: Buffer;
    rawHeader: Buffer;
}
export declare function isError(message: Message): boolean;
export declare function parse(buffer: Buffer, queue?: Array<RawMessage>): Array<ParseResult>;
export declare function parseData(message: Message): true | Error;
export declare function parseJSON(buff: Buffer): any;
