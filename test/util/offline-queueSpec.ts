import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import { spy, assert } from 'sinon'
import { getServicesMock } from '../mocks'
import { TOPIC, EVENT_ACTIONS, RECORD_ACTIONS, PRESENCE_ACTIONS as PA } from '../../binary-protocol/src/message-constants'
import { EVENT } from '../../src/constants'
import { DefaultOptions } from '../../src/client-options'
import OfflineQueue from '../../src/util/offline-queue'

describe('offline queue', () => {
  let services: any
  let options: any
  let queue: OfflineQueue

  const message = {
    topic: TOPIC.PRESENCE,
    action: PA.QUERY_ALL,
  }

  let successSpy: sinon.SinonSpy
  let failureSpy: sinon.SinonSpy

  beforeEach(() => {
    successSpy = spy()
    failureSpy = spy()
    services = getServicesMock()
    options = Object.assign({}, DefaultOptions, { offlineBufferTimeout: 1 })
    queue = new OfflineQueue(options, services)
    services.connection.isConnected = false
    queue.submit(message, successSpy, failureSpy)
  })

  afterEach(() => {
    services.connectionMock.verify()
    services.timeoutRegistryMock.verify()
  })

  it('submits messages to the queue on reconnection and calls success callback', async () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)

    services.simulateConnectionReestablished()
    await BBPromise.delay(2)

    assert.calledOnce(successSpy)
    assert.notCalled(failureSpy)
  })

  it('calls timeout if reconnection doesnt happen in time and calls failure callback', async () => {
    services.connectionMock
      .expects('sendMessage')
      .never()

    await BBPromise.delay(10)

    assert.notCalled(successSpy)
    assert.calledOnce(failureSpy)
  })
})
