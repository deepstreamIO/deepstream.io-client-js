import { EVENT } from '../constants'
import { ALL_ACTIONS, ACTIONS, Message } from '../../binary-protocol/types/messages'
import { TOPIC, JSONObject } from '../../binary-protocol/types/all';
import { Emitter } from './emitter'

function isEvent (action: EVENT | ALL_ACTIONS | undefined): boolean {
  // @ts-ignore
  return EVENT[action] !== undefined
}

export class Logger {
  constructor (private emitter: Emitter) {
  }

  public warn (message: { topic: TOPIC } | Message, event?: EVENT | ALL_ACTIONS, meta?: any): void {
    let warnMessage = `Warning: ${TOPIC[message.topic]}`
    const action = (message as Message).action
    if (action) {
      warnMessage += ` (${(ACTIONS as any)[message.topic][action]})`
    }
    if (event) {
      warnMessage += `: ${EVENT[event as number]}`
    }
    if (meta) {
      warnMessage += ` – ${typeof meta === 'string' ? meta : JSON.stringify(meta)}`
    }
    // tslint:disable-next-line:no-console
    console.warn(warnMessage)
  }

  public error (message: { topic: TOPIC } | Message, event?: EVENT | ALL_ACTIONS, meta?: string | JSONObject | Error): void {
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
