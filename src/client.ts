require('source-map-support').install()

import { DefaultOptions, Options } from './client-options'
import { EVENT, CONNECTION_STATE } from './constants'
import * as C from '../binary-protocol/src/message-constants'
import { Logger } from './util/logger'
import { TimeoutRegistry } from './util/timeout-registry'
import { TimerRegistry } from './util/timer-registry'
import { Connection, AuthenticationCallback, ResumeCallback } from './connection/connection'
import { socketFactory, SocketFactory } from './connection/socket-factory'
import { EventHandler } from './event/event-handler'
import { RPCHandler } from './rpc/rpc-handler'
import { RecordHandler } from './record/record-handler'
import { PresenceHandler } from './presence/presence-handler'
import * as EventEmitter from 'component-emitter2'

export type offlineStoreWriteResponse = ((error?: string) => void)

export interface RecordOfflineStore {
  get: (recordName: string, callback: ((recordName: string, version: number, data: Array<string> | object) => void)) => void
  set: (recordName: string, version: number, data: Array<string> | object, callback: offlineStoreWriteResponse) => void
  delete: (recordName: string, callback: offlineStoreWriteResponse) => void
}

export interface Services {
  logger: Logger
  connection: Connection
  timeoutRegistry: TimeoutRegistry
  timerRegistry: TimerRegistry
  socketFactory: SocketFactory
  storage: RecordOfflineStore
}

export class Client extends EventEmitter {
  public event: EventHandler
  public rpc: RPCHandler
  public record: RecordHandler
  public presence: PresenceHandler

  private services: Services
  private options: Options

  constructor (url: string, options: any = {}) {
    super()

    this.options = Object.assign({}, DefaultOptions, options)

    const services: any = {}
    services.logger = new Logger(this)
    services.timerRegistry = new TimerRegistry()
    services.timeoutRegistry = new TimeoutRegistry(services, this.options)
    services.socketFactory = options.socketFactory || socketFactory
    services.connection = new Connection(services, this.options, url, this)
    this.services = services as Services

    const fake = {} as any
    this.services.storage = {
      get: (recordName: string, callback: ((recordName: string, version: number, data: Array<string> | object) => void)) => {
        const data = fake[recordName]
        if (!data) {
          return callback(recordName, -1, {})
        }
        callback(recordName, data.version, data)
      },
      set: (recordName: string, version: number, data: Array<string> | object, callback: ((error?: string) => void)) => {
        fake[recordName] = {recordName, version, data }
        callback()
      },
      delete: () => {},
    }

    this.services.connection.onLost(
      services.timeoutRegistry.onConnectionLost.bind(services.timeoutRegistry)
    )

    this.event = new EventHandler(this.services, this.options)
    this.rpc = new RPCHandler(this.services, this.options)
    this.record = new RecordHandler(this.services, this.options)
    this.presence = new PresenceHandler(this.services, this.options)
  }

  public login (): Promise<object>
  public login (callback: AuthenticationCallback): void
  public login (details: object): Promise<object>
  public login (details: object, callback: AuthenticationCallback): void
  public login (detailsOrCallback?: object | AuthenticationCallback, callback?: AuthenticationCallback): void | Promise<object> {
    if (detailsOrCallback && typeof detailsOrCallback === 'object') {
      if (callback) {
        this.services.connection.authenticate(detailsOrCallback, callback)
      } else {
        return new Promise((resolve, reject) => {
          this.services.connection.authenticate(detailsOrCallback, (success, data) => {
            success ? resolve(data) : reject(data)
          })
        })
      }
    } else {
      if (typeof detailsOrCallback === 'function') {
        this.services.connection.authenticate({}, detailsOrCallback)
      } else {
        return new Promise((resolve, reject) => {
          this.services.connection.authenticate({}, (success, data) => {
            success ? resolve(data) : reject(data)
          })
        })
      }
    }
  }

  public getConnectionState (): CONNECTION_STATE {
    return this.services.connection.getConnectionState()
  }

  public close (): void {
    this.services.connection.close()
  }

  public pause (): void {
    this.services.connection.pause()
  }

  public resume (callback?: ResumeCallback): void | Promise<object> {
    if (callback) {
      this.services.connection.resume(callback)
      return
    }
    return new Promise((resolve, reject) => {
      this.services.connection.resume(error => {
        error ? reject(error) : resolve()
      })
    })
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

export function deepstream (url: string, options?: any): Client {
  return new Client(url, options)
}

export { CONNECTION_STATE, C, EVENT }
