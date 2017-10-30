import { CONNECTION_STATE } from './constants';
import { Logger } from './util/logger';
import { TimeoutRegistry } from './util/timeout-registry';
import { TimerRegistry } from './util/timer-registry';
import { Connection, AuthenticationCallback } from './connection/connection';
import { EventHandler } from './event/event-handler';
import { RPCHandler } from './rpc/rpc-handler';
import { RecordHandler } from './record/record-handler';
import { PresenceHandler } from './presence/presence-handler';
import * as EventEmitter from 'component-emitter2';
export interface Services {
    logger: Logger;
    connection: Connection;
    timeoutRegistry: TimeoutRegistry;
    timerRegistry: TimerRegistry;
    rpc: RPCHandler;
    event: EventHandler;
    record: RecordHandler;
    presence: PresenceHandler;
}
export default class Client extends EventEmitter {
    private services;
    private options;
    event: EventHandler;
    rpc: RPCHandler;
    record: RecordHandler;
    presence: PresenceHandler;
    constructor(url: string);
    login(details?: object, callback?: AuthenticationCallback): void;
    getConnectionState(): CONNECTION_STATE;
}
