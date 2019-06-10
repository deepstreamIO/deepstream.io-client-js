import { Emitter } from '../util/emitter'
import { EVENT } from '../constants'
import {
  TOPIC,
  ALL_ACTIONS,
  ACTIONS,
  Message,
  JSONObject
} from '../../binary-protocol/src/message-constants'

function isEvent (action: EVENT | ALL_ACTIONS | undefined): boolean {
  // @ts-ignore
  return EVENT[action] !== undefined
}

export class Logger {

  private emitter: Emitter

  constructor (emitter: Emitter) {
    this.emitter = emitter
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
