import * as NodeWebSocket from 'ws';
import { Message } from '../../binary-protocol/src/message-constants';
export interface Socket extends NodeWebSocket {
    onparsedmessages: (messages: Array<Message>) => void;
    sendParsedMessage: (message: Message) => void;
}
export declare type SocketFactory = (url: string, options: object) => Socket;
export declare const socketFactory: (url: string, options: any) => Socket;
