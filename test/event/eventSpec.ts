import { expect } from 'chai'
import * as sinon from 'sinon'
import { getServicesMock } from '../mocks'
import { TOPIC, EVENT, EVENT_ACTION } from '../../src/constants'
import { DefaultOptions } from '../../src/client-options'
import { EventHandler } from '../../src/event/event-handler'

// tslint:disable-next-line:no-empty
const noop = () => {}

describe('event handler', () => {
  let services: any
  let eventHandler: EventHandler
  let handle: Function
  const name = 'myEvent'

  beforeEach(() => {
    services = getServicesMock()
    eventHandler = new EventHandler(services, DefaultOptions)
    handle = services.getHandle()
  })

  afterEach(() => {
    services.connectionMock.verify()
    services.loggerMock.verify()
    services.timeoutRegistryMock.verify()
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
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.SUBSCRIBE,
        name
      })

    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({
        message: {
          topic: TOPIC.EVENT,
          action: EVENT_ACTION.SUBSCRIBE,
          name
        }
      })

    eventHandler.subscribe(name, noop)
  })

  it('subscribes to an event twice', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.SUBSCRIBE,
        name
      })

    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({
        message: {
          topic: TOPIC.EVENT,
          action: EVENT_ACTION.SUBSCRIBE,
          name
        }
      })

    eventHandler.subscribe(name, noop)
    eventHandler.subscribe(name, noop)
  })

  it('unsubscribes to an event after subscribing', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.UNSUBSCRIBE,
        name
      })

    services.timeoutRegistryMock
      .expects('add')
      .once()

    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({
        message: {
          topic: TOPIC.EVENT,
          action: EVENT_ACTION.UNSUBSCRIBE,
          name
        }
      })

    eventHandler.subscribe(name, noop)
    eventHandler.unsubscribe(name, noop)
  })

  it('unsubscribes to an event after unsubscribing already', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.UNSUBSCRIBE,
        name
      })

    services.loggerMock
      .expects('warn')
      .once()
      .withExactArgs({
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.NOT_SUBSCRIBED,
        name
      })

    services.timeoutRegistryMock
      .expects('add')
      .once()

    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({
        message: {
          topic: TOPIC.EVENT,
          action: EVENT_ACTION.UNSUBSCRIBE,
          name
        }
      })

    eventHandler.subscribe(name, noop)
    eventHandler.unsubscribe(name, noop)
    eventHandler.unsubscribe(name, noop)
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
})
