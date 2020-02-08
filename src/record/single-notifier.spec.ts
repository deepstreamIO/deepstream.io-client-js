import { assert, spy } from 'sinon'
import { getServicesMock } from '../test/mocks'
import { EVENT, RECORD_ACTION, TOPIC, Message } from '../constants'

import { SingleNotifier } from './single-notifier'
import { PromiseDelay } from '../util/utils'

describe('Single Notifier', () => {
  const timeout = 10
  const action =  RECORD_ACTION.READ
  const name = 'name'
  const topic = TOPIC.RECORD
  let services: any
  let singleNotifier: SingleNotifier<Message>
  let callbackSpy: sinon.SinonSpy

  beforeEach(() => {
    services = getServicesMock()
    singleNotifier = new SingleNotifier(services, action, timeout)
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

    await PromiseDelay(1)

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
        action: RECORD_ACTION.MESSAGE_DENIED,
        name: 'something',
        isError: true
      }
      singleNotifier.recieve(message, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED], undefined)

      assert.notCalled(callbackSpy)

      await PromiseDelay(1)
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

      await PromiseDelay(1)
    })

    it('responds callback and promise requests with error response', async () => {
      singleNotifier.recieve({
        topic,
        action: RECORD_ACTION.MESSAGE_DENIED,
        name,
        isError: true
      }, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED], undefined)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED], undefined)

      await PromiseDelay(1)
    })

    it('responds with error on connection lost', async () => {
      services.simulateConnectionLost()
      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)
    })
  })

})
