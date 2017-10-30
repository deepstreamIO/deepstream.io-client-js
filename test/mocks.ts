import { EventEmitter } from 'events'
// tslint:disable:no-empty
import { mock } from 'sinon'

export const getServicesMock = () => {
  let handle: Function | null = null
  const connection = {
      sendMessage: () => {},
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

  return {
    connection,
    connectionMock,
    timeoutRegistry,
    timeoutRegistryMock,
    logger,
    loggerMock,
    getHandle: (): Function | null => handle
  }
}
