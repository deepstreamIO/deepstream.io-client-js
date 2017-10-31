export type SocketFactory = (url: string, options: object) => Socket
export type Socket = WebSocket

import * as NodeWebSocket from 'ws'

export const socketFactory = (url: string, options: object) => new NodeWebSocket(url, options)
