const parseMessage = (rawMessage: string) => []
const buildMessage = (message: Message, isAck: boolean) => ''

export type SocketFactory = (url: string, options: object) => Socket
export interface Socket extends WebSocket {
    onparsedmessages: (messages: Array<Message>) => void
    sendParsedMessage: (message: Message) => void
}

import * as NodeWebSocket from 'ws'

export const socketFactory = (url: string, options: any): Socket => {
    const socket = new NodeWebSocket(url, options) as any
    // tslint:disable-next-line:no-empty
    socket.onparsedmessage = () => {}
    socket.onmessage = (raw: string) => {
        socket.onmessages(parseMessage(raw))
    }
    socket.sendParsedMessage = (message: Message): void => {
        socket.send(buildMessage(message, false))
    }
    return socket
}
