import { Services } from '../client'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION } from '../../binary-protocol/src/message-constants'
import * as Emitter from 'component-emitter2'

export class Record {
  private services: Services
  private emitter: Emitter
  private data: object

  constructor (services: Services) {
    this.services = services
    this.emitter = new Emitter()
    this.data = {}
  }

  public get (): object {
    return this.data
  }
}
