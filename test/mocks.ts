// tslint:disable:no-empty
import { EventEmitter } from 'events'
import { mock, stub, SinonMock, SinonStub } from 'sinon'
import { CONNECTION_STATE } from '../src/constants'
import { TimerRegistry } from '../src/util/timer-registry'
import { Message } from '../binary-protocol/src/message-constants'

let lastMessageSent: Message
export const getLastMessageSent = () => lastMessageSent

export const getServicesMock = () => {
  let handle: Function | null = null

  const connection = {
      sendMessage: (message: Message) => { lastMessageSent = message },
      getConnectionState: stub().returns(CONNECTION_STATE.OPEN),
      isConnected: true,
      registerHandler: (topic: any, callback: Function) => {
        handle = callback
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
