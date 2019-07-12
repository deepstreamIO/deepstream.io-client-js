import { Client } from './client'
import * as C from './constants'
import {Options} from './client-options'

const client = (url: string, options?: Partial<Options>): Client => {
    return new Client(url, options)
}
export = Object.assign(client, {
    CONNECTION_STATE: C.CONNECTION_STATE,
    C,
    EVENT: C.EVENT,
    deepstream: client
})
