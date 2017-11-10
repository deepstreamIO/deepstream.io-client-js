import { EVENT } from '../constants'
import {
    TOPIC,
    ALL_ACTIONS,
    AUTH_ACTIONS as AUTH_ACTION,
    RECORD_ACTIONS as RECORD_ACTION,
    EVENT_ACTIONS as EVENT_ACTION,
    RPC_ACTIONS as RPC_ACTION,
    CONNECTION_ACTIONS as CONNECTION_ACTION,
    ACTIONS,
    Message
} from '../../binary-protocol/src/message-constants'

function isEvent (action: any): action is EVENT {
    return EVENT[action] !== undefined
}

export class Logger {

    private emitter: Emitter

    constructor (emitter: Emitter) {
        this.emitter = emitter
    }

    public warn (message: { topic: TOPIC } | Message, event?: EVENT | ALL_ACTIONS, meta?: any): void {
        // tslint:disable-next-line:no-console
        console.warn('warn', message, event, meta)
    }

    public error (message: { topic: TOPIC } | Message, event?: EVENT | ALL_ACTIONS, meta?: string | object): void {
        // tslint:disable-next-line:no-console
        if (isEvent(event)) {
            if (event === EVENT.IS_CLOSED) {
                this.emitter.emit('error', meta, EVENT[event], TOPIC[TOPIC.CONNECTION])
            } else if (event === EVENT.CONNECTION_ERROR) {
                this.emitter.emit('error', meta, EVENT[event], TOPIC[TOPIC.CONNECTION])
            }
        } else {
            const action = event ? event : (message as Message).action
            this.emitter.emit(
                'error',
                meta,
                (ACTIONS as any)[message.topic][action],
                TOPIC[message.topic]
            )
        }
    }
}
