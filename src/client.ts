import { DefaultOptions, Options } from './client-options'
import { EVENT, CONNECTION_STATE } from './constants'
import { Logger } from './util/logger'
import { TimeoutRegistry } from './util/timeout-registry'
import { TimerRegistry } from './util/timer-registry'
import { Connection, AuthenticationCallback } from './connection/connection'
import { socketFactory, SocketFactory } from './connection/socket-factory'
import { EventHandler } from './event/event-handler'
import { RPCHandler } from './rpc/rpc-handler'
import { RecordHandler } from './record/record-handler'
import { PresenceHandler } from './presence/presence-handler'
import * as EventEmitter from 'component-emitter2'

export interface Services {
  logger: Logger
  connection: Connection
  timeoutRegistry: TimeoutRegistry,
  timerRegistry: TimerRegistry,
  socketFactory: SocketFactory
}

export default class Client extends EventEmitter {
  public event: EventHandler
  public rpc: RPCHandler
  public record: RecordHandler
  public presence: PresenceHandler

  private services: Services
  private options: Options

  constructor (url: string, options: any = {}) {
    super ()

    this.options = DefaultOptions

    const services: any = {}
    services.logger = new Logger()
    services.timerRegistry = new TimerRegistry()
    services.ackTimeoutRegistry = new TimeoutRegistry(services, DefaultOptions)
    services.socketFactory = options.socketFactory || socketFactory
    services.connection = new Connection(services, DefaultOptions, url, this)
    this.services = services as Services

    this.event = new EventHandler(this.services, this.options)
    this.rpc = new RPCHandler(this.services, this.options)
    this.record = new RecordHandler(this.services, this.options)
    this.presence = new PresenceHandler(this.services, this.options)
  }

  public login (details?: object, callback?: AuthenticationCallback) {
    this.services.connection.authenticate(details, callback)
  }

  public getConnectionState (): CONNECTION_STATE {
    return CONNECTION_STATE.OPEN
  }

  /**
  * Returns a random string. The first block of characters
  * is a timestamp, in order to allow databases to optimize for semi-
  * sequentuel numberings
  */
  public getUid (): string {
    const timestamp = (new Date()).getTime().toString(36)
    const randomString = (Math.random() * 10000000000000000).toString(36).replace('.', '')

    return `${timestamp}-${randomString}`
  }
}
