import { parse } from '@deepstream/protobuf/dist/src/message-parser'
import { getMessage } from '@deepstream/protobuf/dist/src/message-builder'
import { Socket } from '../deepstream-client'
import { JSONObject, TOPIC, Message, CONNECTION_ACTION } from '../constants'
import { Logger } from '../util/logger'

export type SocketFactory = (url: string, options: JSONObject, heartBeatInterval: number, logger?: Logger) => Socket

export const wireSocket = (socket: any, options: JSONObject, heartBeatInterval: number, isNative: boolean): Socket => {
    if (isNative && options.jsonTransportMode !== true) {
        socket.binaryType = 'arraybuffer'
    }

    const buildMessage = options.jsonTransportMode !== true ? getMessage : (message: Message, isAck: boolean) => JSON.stringify({ ...message, isAck })

    const pingMessage = buildMessage({ topic: TOPIC.CONNECTION, action: CONNECTION_ACTION.PING }, false)
    let pingInterval: number | null = null
    let lastRecievedMessageTimestamp = -1

    // tslint:disable-next-line:no-empty
    socket.onparsedmessage = () => {}
    socket.onmessage = (raw: { data: Buffer | ArrayBuffer | string }) => {
        lastRecievedMessageTimestamp = Date.now()
        let parseResults
        if (options.jsonTransportMode !== true) {
            parseResults = parse(isNative ? new Buffer(new Uint8Array(raw.data as ArrayBuffer)) : raw.data as Buffer)
        } else {
            parseResults = [JSON.parse(raw.data as string)]
        }
        socket.onparsedmessages(parseResults)
    }
    socket.getTimeSinceLastMessage = () => {
      if (lastRecievedMessageTimestamp < 0) return 0
      return Date.now() - lastRecievedMessageTimestamp
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
        if (message.data === undefined) {
            delete message.data
        }
        socket.send(buildMessage(message, false))
    }

    socket.onclosed = null
    socket.onclose = () => {
        clearInterval(pingInterval!)
        socket.onclosed()
    }

    socket.onopened = null
    socket.onopen = () => {
        pingInterval = setInterval(() => {
            try {
                socket.send(pingMessage)
            } catch (e) {
                clearTimeout(pingInterval!)
            }
        }, heartBeatInterval) as never as number
        socket.onopened()
    }

    return socket
}

export const hasMeaningfulSocketOptions = (options: JSONObject): boolean => {
    if (!options) return false
    for (const key of Object.keys(options)) {
        if (key !== 'jsonTransportMode') return true
    }
    return false
}
