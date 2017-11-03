import { EVENT } from '../constants'
import { 
    TOPIC, 
    AUTH_ACTIONS as AUTH_ACTION,
    RECORD_ACTIONS as RECORD_ACTION,
    EVENT_ACTIONS as EVENT_ACTION,
    RPC_ACTIONS as RPC_ACTION,
    CONNECTION_ACTIONS as CONNECTION_ACTION,
    ACTIONS,
    Message
} from '../../binary-protocol/src/message-constants'

export class Logger {

    private emitter: Emitter

    constructor (emitter: Emitter) {
        this.emitter = emitter
    }

    public warn (message: { topic: TOPIC } | Message, event?: EVENT | EVENT_ACTION | RECORD_ACTION | RPC_ACTION, log?: string): void {
        // tslint:disable-next-line:no-console
        console.warn(message, event, log)
    }

    public error (message: { topic: TOPIC } | Message, event?: EVENT| EVENT_ACTION | RECORD_ACTION | RPC_ACTION | CONNECTION_ACTION, log?: string): void {
        // tslint:disable-next-line:no-console
        if (message.topic === TOPIC.CONNECTION && (message as Message).action === CONNECTION_ACTION.AUTHENTICATION_TIMEOUT) {
            console.log(TOPIC[TOPIC.CONNECTION], CONNECTION_ACTION[CONNECTION_ACTION.AUTHENTICATION_TIMEOUT], log)
            this.emitter.emit(
                'error', 
                log,
                CONNECTION_ACTION[CONNECTION_ACTION.AUTHENTICATION_TIMEOUT],
                TOPIC[TOPIC.CONNECTION]
            )
            return
        } else if (message.topic === TOPIC.AUTH && (message as Message).action === AUTH_ACTION.TOO_MANY_AUTH_ATTEMPTS) {
            console.log(TOPIC[TOPIC.AUTH], AUTH_ACTION[AUTH_ACTION.TOO_MANY_AUTH_ATTEMPTS], log)
            this.emitter.emit(
                'error', 
                log,
                AUTH_ACTION[AUTH_ACTION.TOO_MANY_AUTH_ATTEMPTS],
                TOPIC[TOPIC.AUTH]
            )
            return
        } else if (message.topic === TOPIC.CONNECTION && event === EVENT.IS_CLOSED) {
            console.log(TOPIC[TOPIC.CONNECTION], EVENT[EVENT.IS_CLOSED], log)
            this.emitter.emit(
                'error', 
                log,
                EVENT[EVENT.IS_CLOSED],
                TOPIC[TOPIC.CONNECTION]
            )
            return
        }
        console.error(message, event, log)        
    }
}
