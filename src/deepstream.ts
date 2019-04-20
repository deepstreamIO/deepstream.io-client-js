import { Client } from './client'
import { EVENT, CONNECTION_STATE } from './constants'
import * as C from '../binary-protocol/src/message-constants'
import {Options} from './client-options'

const client = (url: string, options?: Partial<Options>): Client => {
    return new Client(url, options)
}
export = Object.assign(client, {
    CONNECTION_STATE,
    C,
    EVENT,
    deepstream: client
})
