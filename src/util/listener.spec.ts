import { expect } from 'chai'
import * as sinon from 'sinon'
import { getServicesMock } from '../test/mocks'
import { EVENT, TOPIC, EVENT_ACTION, RECORD_ACTION } from '../constants'
import { Listener, ListenResponse } from './listener'

describe('listener', () => {
  let services: any
  let listener: Listener

  let listenCallback: sinon.SinonStub

  const pattern = '.*'
  const subscription = 'subscription'

  beforeEach(() => {
    listenCallback = sinon.stub()
    services = getServicesMock()
    listener = new Listener(TOPIC.EVENT, services)
  })

  afterEach(() => {
    services.connectionMock.verify()
    services.loggerMock.verify()
    services.timeoutRegistryMock.verify()
  })

  it('validates parameters on listen and unlisten', () => {
    expect(listener.listen.bind(listener, '', listenCallback)).to.throw()
    expect(listener.unlisten.bind(listener, '')).to.throw()
  })

  it('sends event listen message', () => {
    const message = {
      topic: TOPIC.EVENT,
      action:  EVENT_ACTION.LISTEN,
      name: pattern
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)

    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    listener.listen(pattern, listenCallback)
  })

  it('sends record listen message', () => {
    listener = new Listener(TOPIC.RECORD, services)
    const message = {
      topic: TOPIC.RECORD,
      action: RECORD_ACTION.LISTEN,
      name: pattern
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)

    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    listener.listen(pattern, listenCallback)
  })

  it('resubscribes all patterns when connection reestablished', () => {
    listener = new Listener(TOPIC.RECORD, services)

    const message = {
      topic: TOPIC.RECORD,
      action: RECORD_ACTION.LISTEN,
      name: pattern
    }
    services.connectionMock
    .expects('sendMessage')
    .twice()
    .withExactArgs(message)

    services.timeoutRegistryMock
    .expects('add')
    .twice()
    .withExactArgs({ message })

    listener.listen(pattern, listenCallback)
    services.simulateConnectionReestablished()
  })

  describe('when a pattern is listened to', () => {
    beforeEach(() => {
      listener.listen(pattern, listenCallback)
      services.connectionMock.restore()
      services.timeoutRegistryMock.restore()
    })

    it('warns if listen invoked more than once', () => {
      services.loggerMock
        .expects('warn')
        .once()
        .withExactArgs({
          topic: TOPIC.EVENT,
          action: EVENT_ACTION.LISTEN,
          name: pattern
        }, EVENT.LISTENER_EXISTS)

      listener.listen(pattern, listenCallback)
    })

    it('sends unlisten message when unlistened', () => {
      const message = {
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.UNLISTEN,
        name: pattern
      }
      services.connectionMock
        .expects('sendMessage')
        .once()
        .withExactArgs(message)

      services.timeoutRegistryMock
        .expects('add')
        .once()
        .withExactArgs({ message })

      listener.unlisten(pattern)
    })

    it('warns if unlisten invoked more than once', () => {
      services.loggerMock
        .expects('warn')
        .once()
        .withExactArgs({
          topic: TOPIC.EVENT,
          action: EVENT_ACTION.UNLISTEN,
          name: pattern
        }, EVENT.NOT_LISTENING)

      listener.unlisten(pattern)
      listener.unlisten(pattern)
    })

    it('logs unsolicited message if an unknown message is recieved', () => {
      const message = {
        topic: TOPIC.EVENT,
        action:  EVENT_ACTION.EMIT,
        name: pattern,
        subscription
      }
      services.loggerMock
        .expects('error')
        .once()
        .withExactArgs(message, EVENT.UNSOLICITED_MESSAGE)

      listener.handle(message as any)
    })

    describe('gets a subscription for pattern found', () => {
      let response: ListenResponse

      beforeEach(() => {
        listener.handle({
          topic: TOPIC.EVENT,
          action:  EVENT_ACTION.SUBSCRIPTION_FOR_PATTERN_FOUND,
          name: pattern,
          subscription
        })

        response = listenCallback.lastCall.args[1]
      })

      it('calls the listen callback', () => {
        sinon.assert.calledOnce(listenCallback)
        sinon.assert.calledWithExactly(listenCallback, subscription, sinon.match.any)
      })

      it('responds with accept', () => {
        services.connectionMock
          .expects('sendMessage')
          .once()
          .withExactArgs({
            topic: TOPIC.EVENT,
            action:  EVENT_ACTION.LISTEN_ACCEPT,
            name: pattern,
            subscription
          })

        response.accept()
      })

      it('responds with reject', () => {
        services.connectionMock
          .expects('sendMessage')
          .once()
          .withExactArgs({
            topic: TOPIC.EVENT,
            action:  EVENT_ACTION.LISTEN_REJECT,
            name: pattern,
            subscription
          })

        response.reject()
      })

      it('calls onStop subscription for pattern removed', () => {
        const closeSpy = sinon.spy()
        response.onStop(closeSpy)
        response.accept()

        listener.handle({
          topic: TOPIC.EVENT,
          action:  EVENT_ACTION.SUBSCRIPTION_FOR_PATTERN_REMOVED,
          name: pattern,
          subscription
        })

        sinon.assert.calledOnce(closeSpy)
        sinon.assert.calledWithExactly(closeSpy, subscription)
      })

      it('deletes onStop callback once called', () => {
        const closeSpy = sinon.spy()
        response.onStop(closeSpy)
        response.accept()

        listener.handle({
          topic: TOPIC.EVENT,
          action:  EVENT_ACTION.SUBSCRIPTION_FOR_PATTERN_REMOVED,
          name: pattern,
          subscription
        })

        sinon.assert.calledOnce(closeSpy)
        sinon.assert.calledWithExactly(closeSpy, subscription)
      })

      it('triggers all stop callbacks when connection lost', () => {
        const closeSpy = sinon.spy()
        response.onStop(closeSpy)
        response.accept()

        services.simulateConnectionLost()

        sinon.assert.calledOnce(closeSpy)
        sinon.assert.calledWithExactly(closeSpy, subscription)
      })
    })
  })
})
