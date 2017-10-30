import { TOPIC, EVENT_ACTION, RECORD_ACTION, RPC_ACTION, EVENT } from '../constants'

export class Logger {
    public warn (message: Message, event?: EVENT | EVENT_ACTION | RECORD_ACTION | RPC_ACTION, log?: string): void {
        // tslint:disable-next-line:no-console
        console.warn(message, event, log)
    }

    public error (message: Message, event?: EVENT| EVENT_ACTION | RECORD_ACTION | RPC_ACTION, log?: string): void {
        // tslint:disable-next-line:no-console
        console.error(message, event, log)
    }
}
