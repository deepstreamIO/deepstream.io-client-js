import { Services } from '../client'
import { Options } from '../client-options'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION } from '../../binary-protocol/src/message-constants'

import * as Emitter from 'component-emitter2'

export class RecordHandler {
  private services: Services
  private emitter: Emitter
  private options: Options

  constructor (services: Services, options: Options) {
    this.services = services
    this.options = options
    this.emitter = new Emitter()
  }

  // tslint:disable-next-line:no-empty
  public handle (): void {
  }

}
