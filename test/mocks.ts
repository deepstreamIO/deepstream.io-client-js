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

  return {
    connection,
    connectionMock,
    timeoutRegistry,
    timeoutRegistryMock,
    logger,
    loggerMock,
    timerRegistry,
    getHandle: (): Function | null => handle
  }
}
