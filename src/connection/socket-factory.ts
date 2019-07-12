import { parse } from '@deepstream/protobuf/dist/src/message-parser'
import { getMessage } from '@deepstream/protobuf/dist/src/message-builder'
import {Socket} from '../client'
import { JSONObject, TOPIC, Message, CONNECTION_ACTION } from '../constants'

const BrowserWebsocket = (global.WebSocket || global.MozWebSocket) as any

export type SocketFactory = (url: string, options: JSONObject, heartBeatInterval: number) => Socket

export const socketFactory: SocketFactory = (url, options, heartBeatInterval) => {
    const socket = BrowserWebsocket
        ? new BrowserWebsocket(url, [], options)
        : new (require('ws'))(url, options) as any

    if (BrowserWebsocket) {
        socket.binaryType = 'arraybuffer'
    }

    const pingMessage = getMessage({ topic: TOPIC.CONNECTION, action: CONNECTION_ACTION.PING }, false)
    let pingInterval: NodeJS.Timeout | null = null
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
        if (message.topic === TOPIC.CONNECTION && message.action === CONNECTION_ACTION.CLOSING) {
            socket.onparsedmessages([{ topic: TOPIC.CONNECTION, action: CONNECTION_ACTION.CLOSED }])
            socket.close()
            return
        }
        if (message.parsedData) {
            message.data = JSON.stringify(message.parsedData)
        }
        // if (message.action !== CONNECTION_ACTIONS.PONG && message.action !== CONNECTION_ACTIONS.PING) {
        //     console.log('>>>', TOPIC[message.topic], (ACTIONS as any)[message.topic][message.action], message.parsedData, message.data, message.name)
        // }
        if (message.data === undefined) {
            delete message.data
        }
        socket.send(getMessage(message, false))
    }

    socket.onclosed = null
    socket.onclose = () => {
        clearInterval(pingInterval!)
        socket.onclosed()
    }

    socket.onopened = null
    socket.onopen = () => {
        pingInterval = setInterval(() => {
            if (Date.now() - lastRecievedMessageTimestamp > heartBeatInterval) {
                try {
                    socket.send(pingMessage)
                } catch (e) {
                    clearTimeout(pingInterval!)
                }
            }
        }, heartBeatInterval)
        socket.onopened()
    }

    return socket
}
