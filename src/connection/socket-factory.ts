import { JSONObject } from '../constants'
import { wireSocket, hasMeaningfulSocketOptions, SocketFactory } from './socket-factory-shared'

export { SocketFactory } from './socket-factory-shared'

const NativeWS = (global as any).WebSocket as any

export const socketFactory: SocketFactory = (url: string, options: JSONObject = { jsonTransportMode: false }, heartBeatInterval: number) => {
    if (NativeWS && !hasMeaningfulSocketOptions(options)) {
        return wireSocket(new NativeWS(url, []), options, heartBeatInterval, true)
    }
    const WS = require('ws')
    return wireSocket(new WS(url, options), options, heartBeatInterval, false)
}
