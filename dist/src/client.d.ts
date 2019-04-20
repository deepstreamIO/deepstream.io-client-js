import { Options } from './client-options';
import { CONNECTION_STATE } from './constants';
import { Logger } from './util/logger';
import { TimeoutRegistry } from './util/timeout-registry';
import { TimerRegistry } from './util/timer-registry';
import { Connection, AuthenticationCallback, ResumeCallback } from './connection/connection';
import { SocketFactory } from './connection/socket-factory';
import { EventHandler } from './event/event-handler';
import { RPCHandler } from './rpc/rpc-handler';
import { RecordHandler } from './record/record-handler';
import { PresenceHandler } from './presence/presence-handler';
import * as EventEmitter from 'component-emitter2';
import { RecordData, JSONObject, Message } from '../binary-protocol/src/message-constants';
export declare type offlineStoreWriteResponse = ((error: string | null) => void);
export interface RecordOfflineStore {
    get: (recordName: string, callback: ((recordName: string, version: number, data: RecordData) => void)) => void;
    set: (recordName: string, version: number, data: RecordData, callback: offlineStoreWriteResponse) => void;
    delete: (recordName: string, callback: offlineStoreWriteResponse) => void;
}
export interface Socket extends WebSocket {
    onparsedmessages: (messages: Array<Message>) => void;
    sendParsedMessage: (message: Message) => void;
}
export interface Services {
    logger: Logger;
    connection: Connection;
    timeoutRegistry: TimeoutRegistry;
    timerRegistry: TimerRegistry;
    socketFactory: SocketFactory;
    storage: RecordOfflineStore;
}
export declare class Client extends EventEmitter {
    event: EventHandler;
    rpc: RPCHandler;
    record: RecordHandler;
    presence: PresenceHandler;
    private services;
    private options;
    constructor(url: string, options?: Partial<Options>);
    login(): Promise<JSONObject>;
    login(callback: JSONObject): void;
    login(details: JSONObject): Promise<JSONObject>;
    login(details: JSONObject, callback: AuthenticationCallback): void;
    getConnectionState(): CONNECTION_STATE;
    close(): void;
    pause(): void;
    resume(callback?: ResumeCallback): void | Promise<JSONObject>;
    /**
    * Returns a random string. The first block of characters
    * is a timestamp, in order to allow databases to optimize for semi-
    * sequentuel numberings
    */
    getUid(): string;
}
