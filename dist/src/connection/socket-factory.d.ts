import { JSONObject } from '../../binary-protocol/src/message-constants';
import { Socket } from '../client';
export declare type SocketFactory = (url: string, options: JSONObject) => Socket;
export declare const socketFactory: (url: string, options: any) => Socket;
