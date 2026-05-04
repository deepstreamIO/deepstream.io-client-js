import { JSONObject, TOPIC } from '../constants'
import { wireSocket, hasMeaningfulSocketOptions, SocketFactory } from './socket-factory-shared'
import { Logger } from '../util/logger'

export { SocketFactory } from './socket-factory-shared'

const NativeWS = (window as any).WebSocket || (window as any).MozWebSocket

let warned = false

export const socketFactory: SocketFactory = (url: string, options: JSONObject = { jsonTransportMode: false }, heartBeatInterval: number, logger?: Logger) => {
    if (!warned && hasMeaningfulSocketOptions(options)) {
        warned = true
        const msg = 'Browser WebSocket ignores socketOptions; use the Node build to honor them or provide a custom socketFactory in the client constructor options.'
        if (logger) {
            logger.warn({ topic: TOPIC.CONNECTION }, undefined, msg)
        }
    }
    return wireSocket(new NativeWS(url, []), options, heartBeatInterval, true)
}
