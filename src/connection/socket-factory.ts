import { parse, parseData, parseJSON } from '../../binary-protocol/src/message-parser'
import { getMessage } from '../../binary-protocol/src/message-builder'
import { Message, TOPIC, ACTIONS, CONNECTION_ACTIONS } from '../../binary-protocol/src/message-constants'

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
        const parseResults = parse(raw.data)

        parseResults.forEach(element => {
            (element as Message).parsedData = parseJSON((element as Message).data as Buffer)
            const msg = element as Message
            // console.log('<<<', TOPIC[msg.topic], ACTIONS[msg.topic][msg.action], msg.parsedData, msg.data)
        })
        socket.onparsedmessages(parseResults)
    }
    socket.sendParsedMessage = (message: Message): void => {
        if (message.topic === TOPIC.CONNECTION && message.action === CONNECTION_ACTIONS.CLOSING) {
            socket.onparsedmessages([{ topic: TOPIC.CONNECTION, action: CONNECTION_ACTIONS.CLOSED }])
            return
        }
        message.data = JSON.stringify(message.parsedData)
        // console.log('>>>', TOPIC[message.topic], ACTIONS[message.topic][message.action], message.parsedData)
        socket.send(getMessage(message, false))
    }
    return socket
}
