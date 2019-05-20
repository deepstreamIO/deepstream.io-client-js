// tslint:disable:no-empty
import { mock, stub, SinonStub, SinonMock, match } from 'sinon'
import { CONNECTION_STATE } from '../constants'
import { TimerRegistry } from '../util/timer-registry'
import {
  Message,
  RECORD_ACTIONS,
  JSONObject,
  RECORD_ACTIONS as RECORD_ACTION, TOPIC
} from '../../binary-protocol/src/message-constants'
import { SingleNotifier } from '../record/single-notifier'
import { WriteAcknowledgementService } from '../record/write-ack-service'
import { DirtyService } from '../record/dirty-service'
import { Listener } from '../util/listener'
import {BulkSubscriptionService} from '../util/bulk-subscription-service'

let lastMessageSent: Message
export const getLastMessageSent = () => lastMessageSent

export const getServicesMock = () => {
  let handle: Function | null = null
  let onReestablished: Function
  let onLost: Function
  let onExitLimbo: Function

  const connection = {
      sendMessage: (message: Message) => { lastMessageSent = message },
      getConnectionState: stub().returns(CONNECTION_STATE.OPEN) as SinonStub,
      isConnected: true,
      isInLimbo: false,
      registerHandler: (topic: any, callback: Function): void => {
        handle = callback
      },
      onReestablished: (callback: Function): void => {
        onReestablished = callback
      },
      onLost: (callback: Function): void => {
        onLost = callback
      },
      onExitLimbo: (callback: Function): void => {
        onExitLimbo = callback
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

  const timerRegistry = new TimerRegistry(1)

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
    public onparsedmessages (message: Array<Message>): void {}
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
    public simulateMessages (messages: Array<Message>): void {
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
    delete: () => {}
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
    simulateConnectionLost: (): void => onLost(),
    simulateConnectionReestablished: (): void => onReestablished(),
    simulateExitLimbo: (): void => onExitLimbo(),
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
  const headRegistry = new SingleNotifier(services, RECORD_ACTIONS.HEAD, 50)
  const readRegistry = new SingleNotifier(services, RECORD_ACTIONS.READ, 50)
  const writeAckService = new WriteAcknowledgementService(services)

  const bulkSubscriptionService = {
    [RECORD_ACTION.SUBSCRIBECREATEANDREAD_BULK]: new BulkSubscriptionService<RECORD_ACTION>(services, 0, TOPIC.RECORD, RECORD_ACTION.SUBSCRIBECREATEANDREAD_BULK, RECORD_ACTION.SUBSCRIBECREATEANDREAD, RECORD_ACTION.UNSUBSCRIBE_BULK, RECORD_ACTION.UNSUBSCRIBE),
    [RECORD_ACTION.SUBSCRIBEANDHEAD_BULK]: new BulkSubscriptionService<RECORD_ACTION>(services, 0, TOPIC.RECORD, RECORD_ACTION.SUBSCRIBEANDHEAD_BULK, RECORD_ACTION.SUBSCRIBEANDHEAD, RECORD_ACTION.UNSUBSCRIBE_BULK, RECORD_ACTION.UNSUBSCRIBE),
    [RECORD_ACTION.SUBSCRIBEANDREAD_BULK]: new BulkSubscriptionService<RECORD_ACTION>(services, 0, TOPIC.RECORD, RECORD_ACTION.SUBSCRIBEANDREAD_BULK,  RECORD_ACTION.SUBSCRIBEANDREAD, RECORD_ACTION.UNSUBSCRIBE_BULK, RECORD_ACTION.UNSUBSCRIBE)
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
