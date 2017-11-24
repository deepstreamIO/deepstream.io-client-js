// tslint:disable:no-empty
import { EventEmitter } from 'events'
import { mock, stub, SinonMock, SinonStub } from 'sinon'
import { CONNECTION_STATE } from '../src/constants'
import { TimerRegistry } from '../src/util/timer-registry'
import { TimeoutRegistry } from '../src/util/timeout-registry'
import { Message } from '../binary-protocol/src/message-constants'
import { SingleNotifier } from '../src/record/single-notifier'
import { WriteAcknowledgementService } from '../src/record/write-ack-service'

let lastMessageSent: Message
export const getLastMessageSent = () => lastMessageSent

export const getServicesMock = () => {
  let handle: Function | null = null
  let onReestablished: Function
  let onLost: Function
  let onExitLimbo: Function

  const connection = {
      sendMessage: (message: Message) => { lastMessageSent = message },
      getConnectionState: stub().returns(CONNECTION_STATE.OPEN),
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
      }
  }
  const connectionMock = mock(connection)

  const timeoutRegistry = {
      add: () => {},
      remove: () => {},
      clear: () => {}
  }
  const timeoutRegistryMock = mock(timeoutRegistry)

  const logger = {
      warn: () => {},
      error: () => {}
  }
  const loggerMock = mock(logger)
  loggerMock.expects('warn').never()
  // loggerMock.expects('error').never()

  const timerRegistry = new TimerRegistry()

  // tslint:disable-next-line
  class Socket {
    public url: string
    constructor (url: string) {
      this.url = url
    }
    public sendParsedMessage (message: Message): void {}
    public onparsedmessages (message: Array<Message>): void {}
    public onopen (): void {}
    public onerror (): void {}
    public onclose (): void {}
    public close (): void {
      process.nextTick(this.onclose)
    }
    public simulateRemoteClose (): void {
      this.close()
    }
    public simulateOpen (): void {
      process.nextTick(this.onopen)
    }
    public simulateError (): void {
      process.nextTick(this.onerror.bind(null, { code: 1234 }))
    }
    public simulateMessages (messages: Array<Message>): void {
      process.nextTick(this.onparsedmessages.bind(this, messages))
    }
  }

  let socket: Socket
  const socketFactory = (url: string, options: object): any => {
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

export const getListenerMock = () => {
  const listener = {
    listen: () => {},
    unlisten: () => {},
    handle : () => {}
  }
  const listenerMock = mock(listener)
  return {
    listener,
    listenerMock
  }
}

export const getSingleNotifierMock = () => {
  const singleNotifier = SingleNotifier.prototype
  const singleNotifierMock = mock(singleNotifier)
  return {
    singleNotifier,
    singleNotifierMock
  }
}

export const getWriteAckNotifierMock = () => {
  const writeAckNotifier = WriteAcknowledgementService.prototype
  const writeAckNotifierMock = mock(writeAckNotifier)
  return {
    writeAckNotifier,
    writeAckNotifierMock
  }
}
