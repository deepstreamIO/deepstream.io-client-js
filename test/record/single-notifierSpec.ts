import { Promise as BBPromise } from 'bluebird'
import { assert, spy } from 'sinon'
import { getServicesMock } from '../mocks'
import { EVENT } from '../../src/constants'
import { TOPIC, RECORD_ACTIONS } from '../../binary-protocol/src/message-constants'

import { SingleNotifier } from '../../src/record/single-notifier'

describe('Single Notifier', () => {
  const timeout = 10
  const topic = TOPIC.RECORD
  const action =  RECORD_ACTIONS.READ
  const name = 'name'
  let services: any
  let singleNotifier: SingleNotifier
  let callbackSpy: sinon.SinonSpy

  beforeEach(() => {
    services = getServicesMock()
    singleNotifier = new SingleNotifier(services, topic, action, timeout)
    callbackSpy = spy()
  })

  afterEach(() => {
    services.verify()
  })

  it('requests with correct topic and action', () => {
    const message = {
      topic,
      action,
      name
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    singleNotifier.request(name, callbackSpy)
  })

  it('doesn\'t send message twice and updates the timeout when requesting twice', () => {
    const message = {
      topic,
      action,
      name
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    singleNotifier.request(name, callbackSpy)
    singleNotifier.request(name, callbackSpy)
  })

  it('cant\'t query request when client is offline', async () => {
    services.connection.isConnected = false

    singleNotifier.request(name, callbackSpy)

    await BBPromise.delay(1)

    assert.calledOnce(callbackSpy)
    assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)
  })

  describe('requesting', async () => {
    beforeEach(() => {
      singleNotifier.request(name, callbackSpy)
    })

    it('doesn\'t respond unknown requests', async () => {
      const message = {
        topic,
        action: RECORD_ACTIONS.MESSAGE_DENIED,
        name: 'something',
        isError: true
      }
      singleNotifier.recieve(message, RECORD_ACTIONS[RECORD_ACTIONS.MESSAGE_DENIED], undefined)

      assert.notCalled(callbackSpy)

      await BBPromise.delay(1)
    })

    it('responds callback and promise requests with success response', async () => {
      const parsedData = { some: 'data' }
      singleNotifier.recieve({
        topic,
        action,
        name,
        isError: false,
        parsedData
      }, undefined, parsedData)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, undefined, parsedData)

      await BBPromise.delay(1)
    })

    it('responds callback and promise requests with error response', async () => {
      singleNotifier.recieve({
        topic,
        action: RECORD_ACTIONS.MESSAGE_DENIED,
        name,
        isError: true
      }, RECORD_ACTIONS[RECORD_ACTIONS.MESSAGE_DENIED], undefined)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, RECORD_ACTIONS[RECORD_ACTIONS.MESSAGE_DENIED], undefined)

      await BBPromise.delay(1)
    })

    it('responds with error on connection lost', async () => {
      services.simulateConnectionLost()
      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)
    })
  })

})
