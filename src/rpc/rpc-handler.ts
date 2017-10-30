import { Services } from '../client'
import { Options } from '../client-options'
import { TOPIC, RPC_ACTION, EVENT } from '../constants'
import * as Emitter from 'component-emitter2'

export class RPCHandler {
  private services: Services
  private options: Options

  constructor (services: Services, options: Options) {
    this.services = services
    this.options = options
  }

  // tslint:disable-next-line:no-empty
  public handle (): void {
  }

}
