require('source-map-support').install()
import { Client } from './client'
import { EVENT, CONNECTION_STATE } from './constants'
import * as C from '../binary-protocol/src/message-constants'

export class ClientFactory extends Client {
  public static CONNECTION_STATE: typeof CONNECTION_STATE = CONNECTION_STATE
  public static C: typeof C = C
  public static EVENT: typeof EVENT = EVENT
  public static deepstream: typeof ClientFactory = ClientFactory

  public static createInstance (url: string, options?: any): Client {
    return new Client(url, options)
  }
}
