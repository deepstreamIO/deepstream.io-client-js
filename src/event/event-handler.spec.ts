import { expect } from 'chai'
import * as sinon from 'sinon'
import { getServicesMock, getListenerMock } from '../test/mocks'
import { EVENT, TOPIC, EVENT_ACTION } from '../constants'
import { DefaultOptions } from '../client-options'
import { EventHandler } from './event-handler'
import { PromiseDelay } from '../util/utils'

describe('event handler', () => {
  let services: any
  let listener: any
  let eventHandler: EventHandler
  let handle: Function
  let spy: sinon.SinonSpy
  const name = 'myEvent'

  beforeEach(() => {
    services = getServicesMock()
    listener = getListenerMock()

    eventHandler = new EventHandler(services, { ...DefaultOptions, subscriptionInterval: 0 }, listener.listener)
    handle = services.getHandle()
    spy = sinon.spy()
  })

  afterEach(() => {
    services.verify()
    listener.listenerMock.verify()
  })

  it('gets events names', () => {
    eventHandler.subscribe('event1', spy)
    eventHandler.subscribe('event2', spy)

    expect(eventHandler.eventNames()).to.deep.equal(['event1', 'event2'])

    eventHandler.unsubscribe('event2', spy)

    expect(eventHandler.eventNames()).to.deep.equal(['event1'])
  })

  it('validates parameters on subscribe, unsubscribe and emit', () => {
    expect(eventHandler.subscribe.bind(eventHandler, '', () => {})).to.throw()
    expect(eventHandler.unsubscribe.bind(eventHandler, '', () => {})).to.throw()
    expect(eventHandler.emit.bind(eventHandler, '', {})).to.throw()
  })

  it('emits an event it has no listeners for', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.EMIT,
        name,
        parsedData: 6
      })

    eventHandler.emit(name, 6)
  })

  it('subscribes to an event', () => {
    const message = {
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.SUBSCRIBE,
      names: [name],
      correlationId: '0'
    }

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)

    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    eventHandler.subscribe(name, spy)
  })

  it('resubscribes to an event when connection reestablished', () => {
    const message = {
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.SUBSCRIBE,
        names: [name],
        correlationId: '0'
    }
    services.connectionMock
      .expects('sendMessage')
      .twice()
      .withExactArgs(message)

    services.timeoutRegistryMock
      .expects('add')
      .twice()
      .withExactArgs({ message })

    eventHandler.subscribe(name, spy)

    services.simulateConnectionLost()
    services.simulateConnectionReestablished()
  })

  it('subscribes to an event twice', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()

    services.timeoutRegistryMock
      .expects('add')
      .once()

    eventHandler.subscribe(name, spy)
    eventHandler.subscribe(name, spy)
  })

  it('unsubscribes to an event after subscribing', () => {
    const message = {
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.UNSUBSCRIBE,
      names: [name],
      correlationId: '1'
    }

    services.connectionMock
      .expects('sendMessage')
      .once()

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)

    services.timeoutRegistryMock
      .expects('add')
      .once()

    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    eventHandler.subscribe(name, spy)
    eventHandler.unsubscribe(name, spy)
  })

  it('unsubscribes to an event after unsubscribing already', () => {
    const message = {
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.UNSUBSCRIBE,
        names: [name],
        correlationId: '1'
    }

    services.connectionMock
      .expects('sendMessage')
      .once()

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)

    services.timeoutRegistryMock
      .expects('add')
      .once()

    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    services.loggerMock
      .expects('warn')
      .once()
      .withExactArgs({
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.NOT_SUBSCRIBED,
        name
      })

    eventHandler.subscribe(name, spy)
    eventHandler.unsubscribe(name, spy)
    eventHandler.unsubscribe(name, spy)
  })

  it('notifies local listeners for local events', () => {
    services.connectionMock
      .expects('sendMessage')
      .twice()

    eventHandler.subscribe(name, spy)
    eventHandler.emit(name, 8)
    sinon.assert.calledOnce(spy)
    sinon.assert.calledWithExactly(spy, 8)
  })

  it('notifies local listeners for remote events', () => {
    eventHandler.subscribe(name, spy)
    handle({
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.EMIT,
      name,
      parsedData: 8
    })
    sinon.assert.calledOnce(spy)
    sinon.assert.calledWithExactly(spy, 8)
  })

  it('removes local listeners', () => {
    eventHandler.subscribe(name, spy)
    eventHandler.unsubscribe(name, spy)
    eventHandler.emit(name, 11)
    sinon.assert.callCount(spy, 0)
  })

  it('notifies local listeners for remote events without data', () => {
    eventHandler.subscribe(name, spy)
    handle({
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.EMIT,
      name
    })
    sinon.assert.calledOnce(spy)
    sinon.assert.calledWithExactly(spy, undefined)
  })

  it('unsubscribes locally when it recieves a message denied', () => {
    eventHandler.subscribe(name, spy)
    handle({
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.MESSAGE_DENIED,
      originalAction: EVENT_ACTION.SUBSCRIBE,
      name
    })
    eventHandler.emit(name, 11)
    sinon.assert.callCount(spy, 0)
  })

  it('forwards subscribe ack messages', () => {
    services.timeoutRegistryMock
      .expects('remove')
      .once()
      .withExactArgs({
        isAck: true,
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.SUBSCRIBE,
        name
      })

    handle({
      isAck: true,
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.SUBSCRIBE,
      name
    })
  })

  it('forwards unsubscribe ack messages', () => {
    services.timeoutRegistryMock
      .expects('remove')
      .once()
      .withExactArgs({
        isAck: true,
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.UNSUBSCRIBE,
        name
      })

    handle({
      isAck: true,
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.UNSUBSCRIBE,
      name
    })
  })

  it('warns when a not subscribed is remotely recieved', () => {
    services.loggerMock
      .expects('warn')
      .once()
      .withExactArgs({
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.NOT_SUBSCRIBED,
        name
      })

    handle({
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.NOT_SUBSCRIBED,
      name
    })
  })

  it('listens for pattern', () => {
    const pattern = '.*'
    const callback = () => {}
    listener.listenerMock
      .expects('listen')
      .once()
      .withExactArgs(pattern, callback)

    eventHandler.listen(pattern, callback)
  })

  it('unlistens a pattern', () => {
    const pattern = '.*'
    listener.listenerMock
      .expects('unlisten')
      .once()
      .withExactArgs(pattern)

    eventHandler.unlisten(pattern)
  })

  it('it forwards listeners\' messages to listeners', () => {
    const subscriptionFoundMsg = {
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.SUBSCRIPTION_FOR_PATTERN_FOUND,
      name: '.*',
      subscription: 'subscription'
    }
    const subscriptionRemovedMsg = {
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.SUBSCRIPTION_FOR_PATTERN_REMOVED,
      name: '.*',
      subscription: 'subscription'
    }

    listener.listenerMock
      .expects('handle')
      .once()
      .withExactArgs(subscriptionFoundMsg)
    listener.listenerMock
      .expects('handle')
      .once()
      .withExactArgs(subscriptionRemovedMsg)

    handle(subscriptionFoundMsg)
    handle(subscriptionRemovedMsg)
  })

  it('logs an error event for unsolicited event messages', () => {
    services.loggerMock
      .expects('error')
      .once()
      .withExactArgs({
        topic: TOPIC.EVENT,
        action: -1
      }, EVENT.UNSOLICITED_MESSAGE)

    handle({
      topic: TOPIC.EVENT,
      action: -1
    })
  })

  describe('limbo', () => {

    beforeEach(() => {
      services.connection.isConnected = false
      services.connection.isInLimbo = true
    })

    it('sends messages once re-established if in limbo', async () => {
      eventHandler.emit(name, 6)

      services.connectionMock
        .expects('sendMessage')
        .once()
        .withExactArgs({ topic: TOPIC.EVENT, action: EVENT_ACTION.EMIT, parsedData: 6, name })

      services.simulateConnectionReestablished()
      await PromiseDelay(1)
    })

  })

})
