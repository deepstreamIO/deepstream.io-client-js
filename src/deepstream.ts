import { Client } from './client'
import { EVENT, CONNECTION_STATE } from './constants'
import * as C from '../binary-protocol/src/message-constants'

const client = (url: string, options?: any): Client => {
    return new Client(url, options)
}
export = Object.assign(client, {
    CONNECTION_STATE,
    C,
    EVENT,
    deepstream: client
})
