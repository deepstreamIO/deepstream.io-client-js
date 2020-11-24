import { DefaultOptions, Options } from './client-options'
import * as C from './constants'
import { CONNECTION_STATE, RecordData, Message, JSONObject } from './constants'
import { Logger } from './util/logger'
import { TimeoutRegistry } from './util/timeout-registry'
import { IntervalTimerRegistry } from './util/interval-timer-registry'
import { NativeTimerRegistry } from './util/native-timer-registry'
import { Connection, AuthenticationCallback, ResumeCallback } from './connection/connection'
import { socketFactory, SocketFactory} from './connection/socket-factory'
import { EventHandler } from './event/event-handler'
import { RPCHandler } from './rpc/rpc-handler'
import { RecordHandler} from './record/record-handler'
import { PresenceHandler } from './presence/presence-handler'
import { Emitter } from './util/emitter'
import { Storage } from './storage/indexdb-storage-service'
import { NoopStorage } from './storage/noop-storage-service'

export type offlineStoreWriteResponse = ((error: string | null, recordName: string) => void)

export interface RecordOfflineStore {
  get: (recordName: string, callback: ((recordName: string, version: number, data: RecordData) => void)) => void
  set: (recordName: string, version: number, data: RecordData, callback: offlineStoreWriteResponse) => void
  delete: (recordName: string, callback: offlineStoreWriteResponse) => void
  reset: (callback: (error: string | null) => void) => void
}

export type TimerRef = number
export interface Timeout {
  callback: Function,
  duration: number,
  context: any,
  data?: any
}

export interface TimerRegistry {
  close (): void
  has (timerId: TimerRef): boolean
  add (timeout: Timeout): TimerRef
  remove (timerId: TimerRef): boolean
  requestIdleCallback (callback: Function): void
}

export interface Socket {
  close: () => void
  onparsedmessages: (messages: Message[]) => void
  onclosed: () => void
  onopened: () => void
  onerror: (error: any) => void
  sendParsedMessage: (message: Message) => void
  getTimeSinceLastMessage: () => number
}

export interface Services {
  logger: Logger
  connection: Connection
  timeoutRegistry: TimeoutRegistry
  timerRegistry: TimerRegistry
  socketFactory: SocketFactory
  storage: RecordOfflineStore
}

export {
  DeepstreamClient,
  C,
  DefaultOptions
}

class DeepstreamClient extends Emitter {
  public event: EventHandler
  public rpc: RPCHandler
  public record: RecordHandler
  public presence: PresenceHandler

  private services: Services
  private options: Options

  constructor (url: string, options: Partial<Options> = {}) {
    super()
    this.options = { ...DefaultOptions, ...options } as Options
    const services: Partial<Services> = {}
    services.logger = new Logger(this)
    if (options.nativeTimerRegistry) {
      services.timerRegistry = new NativeTimerRegistry()
    } else {
      services.timerRegistry = new IntervalTimerRegistry(this.options.intervalTimerResolution)
    }
    services.timeoutRegistry = new TimeoutRegistry(services as Services, this.options)
    services.socketFactory = this.options.socketFactory || socketFactory
    services.connection = new Connection(services as Services, this.options, url, this)
    if (this.options.offlineEnabled) {
      services.storage = this.options.storage || new Storage(this.options)
    } else {
      services.storage = new NoopStorage()
    }
    this.services = services as Services

    this.services.connection.onLost(
      services.timeoutRegistry.onConnectionLost.bind(services.timeoutRegistry)
    )

    this.event = new EventHandler(this.services, this.options)
    this.rpc = new RPCHandler(this.services, this.options)
    this.record = new RecordHandler(this.services, this.options)
    this.presence = new PresenceHandler(this.services, this.options)
  }

  public login (): Promise<JSONObject>
  public login (callback: AuthenticationCallback): void
  public login (details: JSONObject): Promise<JSONObject>
  public login (details: JSONObject, callback: AuthenticationCallback): void
  public login (detailsOrCallback?: JSONObject | AuthenticationCallback, callback?: AuthenticationCallback): void | Promise<JSONObject | null> {
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
    Object.keys(this.services).forEach(serviceName => {
      if ((this.services as any)[serviceName].close) {
        (this.services as any)[serviceName].close()
      }
    })
  }

  public pause (): void {
    this.services.connection.pause()
  }

  public resume (callback?: ResumeCallback): void | Promise<void> {
    if (callback) {
      this.services.connection.resume(callback)
      return
    }
    return new Promise<void>((resolve, reject) => {
      this.services.connection.resume(error => {
        error ? reject(error) : resolve()
      })
    })
  }

  /**
  * Returns a random string. The first block of characters
  * is a timestamp, in order to allow databases to optimize for semi-
  * sequential numberings
  */
  public getUid (): string {
    const timestamp = (new Date()).getTime().toString(36)
    const randomString = (Math.random() * 10000000000000000).toString(36).replace('.', '')

    return `${timestamp}-${randomString}`
  }
}
