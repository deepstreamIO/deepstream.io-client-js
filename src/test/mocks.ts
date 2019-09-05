// tslint:disable:no-empty
import { mock, stub, SinonStub, SinonMock, match } from 'sinon'
import { CONNECTION_STATE, Message, JSONObject, RECORD_ACTION, TOPIC } from '../constants'
import { SingleNotifier } from '../record/single-notifier'
import { WriteAcknowledgementService } from '../record/write-ack-service'
import { DirtyService } from '../record/dirty-service'
import { Listener } from '../util/listener'
import {BulkSubscriptionService} from '../util/bulk-subscription-service'
import { EventEmitter } from 'events'
import { NativeTimerRegistry } from '../util/native-timer-registry'

let lastMessageSent: Message
export const getLastMessageSent = () => lastMessageSent

export const getServicesMock = () => {
  let handle: Function | null = null
  const emitter = new EventEmitter()

  const connection = {
      sendMessage: (message: Message) => { lastMessageSent = message },
      getConnectionState: stub().returns(CONNECTION_STATE.OPEN) as SinonStub,
      isConnected: true,
      isInLimbo: false,
      registerHandler: (topic: any, callback: Function): void => {
        handle = callback
      },
      onReestablished: (callback: Function): void => {
        emitter.on('onReestablished', callback as any)
      },
      onLost: (callback: Function): void => {
        emitter.on('onLost', callback as any)
      },
      onExitLimbo: (callback: Function): void => {
        emitter.on('onExitLimbo', callback as any)
      },
      removeOnReestablished: () => {},
      removeOnLost: () => {}
  }
  const connectionMock = mock(connection)

  const logger = {
    warn: () => {},
    error: () => {}
  }
  const loggerMock = mock(logger)
  loggerMock.expects('warn').never()
  // loggerMock.expects('error').never()

  const timerRegistry = new NativeTimerRegistry()

  const timeoutRegistry = {
    add: () => {},
    remove: () => {},
    clear: () => {}
  }
  const timeoutRegistryMock = mock(timeoutRegistry)

  // TODO: Use a real timeout registry to catch potential errors
  // const timeoutRegistry = new TimeoutRegistry({
  //   timerRegistry,
  //   logger,
  //   connection
  // } as any, { subscriptionTimeout: 20 } as any)
  // const timeoutRegistryMock = mock(timeoutRegistry)

  // tslint:disable-next-line
  class Socket {
    public url: string
    constructor (url: string) {
      this.url = url
    }
    public sendParsedMessage (message: Message): void {}
    public onparsedmessages (message: Message[]): void {}
    public onopened (): void {}
    public onerror (): void {}
    public onclosed (): void {}
    public close (): void {
      process.nextTick(this.onclosed)
    }
    public simulateRemoteClose (): void {
      this.close()
    }
    public simulateOpen (): void {
      process.nextTick(this.onopened)
    }
    public simulateError (): void {
      process.nextTick(this.onerror.bind(null, { code: 1234 }))
    }
    public simulateMessages (messages: Message[]): void {
      process.nextTick(this.onparsedmessages.bind(this, messages))
    }
    public getTimeSinceLastMessage () {
      return 1
    }
  }

  let socket: Socket
  const socketFactory = (url: string, options: JSONObject): any => {
    socket = new Socket(url)
    return socket
  }

  const storage = {
    get: () => {},
    set: () => {},
    delete: () => {},
    reset: () => {}
  }
  const storageMock = mock(storage)

  return {
    socketFactory,
    getSocket: (): any => ({ socket, socketMock: mock(socket) }),
    connection,
    connectionMock,
    timeoutRegistry,
    timeoutRegistryMock,
    logger,
    loggerMock,
    getLogger: (): any => ({ logger, loggerMock}),
    timerRegistry,
    getHandle: (): Function | null => handle,
    simulateConnectionLost: (): void => { emitter.emit('onLost') },
    simulateConnectionReestablished: (): void =>  { emitter.emit('onReestablished') },
    simulateExitLimbo: (): void => { emitter.emit('onExitLimbo') },
    storage,
    storageMock,
    verify: () => {
      connectionMock.verify()
      timeoutRegistryMock.verify()
      loggerMock.verify()
      storageMock.verify()
    }
  }
}

export const getRecordServices = (services: any) => {
  services.storageMock.expects('get').withArgs('__ds__dirty_records', match.func).atLeast(0).callsArgWith(1, '__ds__dirty_records', 1, [])
  services.storageMock.expects('set').withArgs('__ds__dirty_records', 1, match.any, match.func).atLeast(0)
  const dirtyService = new DirtyService(services.storage, '__ds__dirty_records')
  const headRegistry = new SingleNotifier(services, RECORD_ACTION.HEAD, 50)
  const readRegistry = new SingleNotifier(services, RECORD_ACTION.READ, 50)
  const writeAckService = new WriteAcknowledgementService(services)

  const bulkSubscriptionService = {
    [RECORD_ACTION.SUBSCRIBECREATEANDREAD]: new BulkSubscriptionService<RECORD_ACTION>(services, 0, TOPIC.RECORD, RECORD_ACTION.SUBSCRIBECREATEANDREAD, RECORD_ACTION.UNSUBSCRIBE),
    [RECORD_ACTION.SUBSCRIBEANDHEAD]: new BulkSubscriptionService<RECORD_ACTION>(services, 0, TOPIC.RECORD, RECORD_ACTION.SUBSCRIBEANDHEAD, RECORD_ACTION.UNSUBSCRIBE),
    [RECORD_ACTION.SUBSCRIBEANDREAD]: new BulkSubscriptionService<RECORD_ACTION>(services, 0, TOPIC.RECORD, RECORD_ACTION.SUBSCRIBEANDREAD, RECORD_ACTION.UNSUBSCRIBE)
  }

  const dirtyServiceMock = mock(dirtyService)
  const readRegistryMock =  mock(readRegistry)
  const headRegistryMock = mock(headRegistry)
  const writeAckServiceMock = mock(writeAckService)

  return {
    dirtyService,
    dirtyServiceMock,
    headRegistry,
    headRegistryMock,
    readRegistry,
    readRegistryMock,
    writeAckService,
    writeAckServiceMock,
    bulkSubscriptionService,
    verify: () => {
      dirtyServiceMock.verify()
      headRegistryMock.verify()
      readRegistryMock.verify()
      writeAckServiceMock.verify()
    }
  }
}

export const getListenerMock = (): { listener: any, listenerMock: SinonMock } => {
  const listener = Listener.prototype
  const listenerMock = mock(listener)
  return {
    listener,
    listenerMock
  }
}
