import { parse } from '../../binary-protocol/src/message-parser'
import { getMessage } from '../../binary-protocol/src/message-builder'
import { Message, TOPIC, ACTIONS, CONNECTION_ACTIONS } from '../../binary-protocol/src/message-constants'

export type SocketFactory = (url: string, options: object) => Socket
export interface Socket extends WebSocket {
    onparsedmessages: (messages: Array<Message>) => void
    sendParsedMessage: (message: Message) => void
}

const BrowserWebsocket = (global.WebSocket || global.MozWebSocket) as any

import * as NodeWebSocket from 'ws'

export const socketFactory = (url: string, options: any): Socket => {
    const socket = BrowserWebsocket
        ? new BrowserWebsocket(url, [], options) 
        : new NodeWebSocket(url, options) as any

    if (BrowserWebsocket) {
        socket.binaryType = 'arraybuffer'
    }

    // tslint:disable-next-line:no-empty
    socket.onparsedmessage = () => {}
    socket.onmessage = (raw: {data: Buffer}) => {
        const parseResults = parse(BrowserWebsocket ? new Buffer(new Uint8Array(raw.data)) :raw.data)
        socket.onparsedmessages(parseResults)
    }
    socket.sendParsedMessage = (message: Message): void => {
        if (message.topic === TOPIC.CONNECTION && message.action === CONNECTION_ACTIONS.CLOSING) {
            socket.onparsedmessages([{ topic: TOPIC.CONNECTION, action: CONNECTION_ACTIONS.CLOSED }])
            socket.close()
            return
        }
        message.data = JSON.stringify(message.parsedData)
        // if (message.action !== CONNECTION_ACTIONS.PONG && message.action !== CONNECTION_ACTIONS.PING) {
        //     console.log('>>>', TOPIC[message.topic], (ACTIONS as any)[message.topic][message.action], message.parsedData, message.data, message.name)
        // }
        socket.send(getMessage(message, false))
    }
    return socket
}
