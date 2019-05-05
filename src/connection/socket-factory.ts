import { parse } from '../../binary-protocol/src/message-parser'
import { getMessage } from '../../binary-protocol/src/message-builder'
import { Message, TOPIC, CONNECTION_ACTIONS, JSONObject } from '../../binary-protocol/src/message-constants'
import {Socket} from '../client'

const BrowserWebsocket = (global.WebSocket || global.MozWebSocket) as any

export type SocketFactory = (url: string, options: JSONObject, heartBeatInterval: number) => Socket

export const socketFactory: SocketFactory = (url, options, heartBeatInterval) => {
    const socket = BrowserWebsocket
        ? new BrowserWebsocket(url, [], options)
        : new (require('ws'))(url, options) as any

    if (BrowserWebsocket) {
        socket.binaryType = 'arraybuffer'
    }

    let lastRecievedMessageTimestamp = -1

    // tslint:disable-next-line:no-empty
    socket.onparsedmessage = () => {}
    socket.onmessage = (raw: {data: Buffer}) => {
        lastRecievedMessageTimestamp = Date.now()
        const parseResults = parse(BrowserWebsocket ? new Buffer(new Uint8Array(raw.data)) : raw.data)
        socket.onparsedmessages(parseResults)
    }
    socket.getTimeSinceLastMessage = () => {
        return 0
        // return Date.now() - lastRecievedMessageTimestamp
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

    const pingMessage = getMessage({ topic: TOPIC.CONNECTION, action: CONNECTION_ACTIONS.PING }, false)
    const pingInterval = setInterval(() => {
        if (Date.now() - lastRecievedMessageTimestamp > heartBeatInterval) {
            try {
                socket.send(pingMessage)
            } catch (e) {
                clearTimeout(pingInterval)
            }
        }
    }, heartBeatInterval)

    return socket
}
