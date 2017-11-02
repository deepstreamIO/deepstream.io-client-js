import { parse, parseData } from '../../binary-protocol/src/message-parser'
import { getMessage } from '../../binary-protocol/src/message-builder'
import { Message } from '../../binary-protocol/src/message-constants'

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
    socket.onmessage = (raw: {data: Buffer}) => {
        console.log('onmessage', parse(raw.data))
        socket.onparsedmessages(parse(raw.data))
    }
    socket.sendParsedMessage = (message: Message): void => {
        message.data = JSON.stringify(message.parsedData)
        console.log('send', message)
        socket.send(getMessage(message, false))
    }
    return socket
}
