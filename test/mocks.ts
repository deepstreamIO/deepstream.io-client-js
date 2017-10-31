// tslint:disable:no-empty
import { EventEmitter } from 'events'
import { mock, stub } from 'sinon'
import { TimerRegistry } from '../src/util/timer-registry'

export const getServicesMock = () => {
  let handle: Function | null = null
  const connection = {
      sendMessage: () => {},
      getConnectionState: stub(),
      registerHandler: (topic: any, callback: Function) => {
        handle = callback
      }
  }
  const connectionMock = mock(connection)

  const timeoutRegistry = {
      add: () => {},
      remove: () => {}
  }
  const timeoutRegistryMock = mock(timeoutRegistry)

  const logger = {
      warn: () => {},
      error: () => {}
  }
  const loggerMock = mock(logger)
  loggerMock.expects('warn').never()
  loggerMock.expects('error').never()

  const timerRegistry = new TimerRegistry()

  // tslint:disable-next-line
  class Socket {
    public sendParsedMessage (message: Message): void {}
    public onparsedmessages (message: Array<Message>): void {}
    public onopen (): void {}
    public onerror (): void {}
    public onclose (): void {}
    public simulateOpen (): void {
      process.nextTick(this.onopen)
    }
    public simulateError (): void {
      process.nextTick(this.onerror)
    }
    public simulateMessages (messages: Array<Message>): void {
      process.nextTick(this.onparsedmessages.bind(this, messages))
    }
    public close () {
      process.nextTick(this.onclose)
    }
  }

  let socket: Socket
  const socketFactory = (url: string, options: object): any => {
    socket = new Socket()
    return socket
  }

  return {
    socketFactory,
    getSocket: (): any => ({ socket, socketMock: mock(socket) }),
    connection,
    connectionMock,
    timeoutRegistry,
    timeoutRegistryMock,
    logger,
    loggerMock,
    timerRegistry,
    getHandle: (): Function | null => handle,
    verify: () => {
      connectionMock.verify()
      timeoutRegistryMock.verify()
      loggerMock.verify()
    }
  }
}
