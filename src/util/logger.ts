import { EVENT } from '../constants'
import {
    TOPIC,
    RECORD_ACTIONS as RECORD_ACTION,
    EVENT_ACTIONS as EVENT_ACTION,
    RPC_ACTIONS as RPC_ACTION,
    Message
} from '../../binary-protocol/src/message-constants'

export class Logger {
    public warn (message: { topic: TOPIC } | Message, event?: EVENT | EVENT_ACTION | RECORD_ACTION | RPC_ACTION, meta?: any): void {
        // tslint:disable-next-line:no-console
        console.warn(message, event, meta)
    }

    public error (message: { topic: TOPIC } | Message, event?: EVENT| EVENT_ACTION | RECORD_ACTION | RPC_ACTION, meta?: any): void {
        // tslint:disable-next-line:no-console
        console.error(message, event, meta)
    }
}
