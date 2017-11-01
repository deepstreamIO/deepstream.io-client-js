import { expect } from 'chai'
import * as sinon from 'sinon'
import { getServicesMock } from '../mocks'
import { TOPIC, EVENT, EVENT_ACTION } from '../../src/constants'
import { DefaultOptions } from '../../src/client-options'
import { Listener, ListenCallback, ListenResponse } from '../../src/util/listener'

describe.only('listener', () => {
  let services: any
  let listener: Listener

  let listenResponse: ListenResponse
  let listenCallbackMock: sinon.SinonMock

  const pattern = '.*'
  const subscription = 'subscription'

  function listenCallback (subscription: string, response: ListenResponse): void {
    console.log('calleed')
    listenResponse = response
  }

  beforeEach(() => {
    listenCallbackMock = sinon.mock({ listenCallback })
    services = getServicesMock()
    listener = new Listener(TOPIC.EVENT, services)
  })

  afterEach(() => {
    services.connectionMock.verify()
    services.loggerMock.verify()
    services.timeoutRegistryMock.verify()
    listenCallbackMock.verify()
  })

  it('sends listen message', () => {
    const message = {
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.LISTEN,
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
          action: EVENT_ACTION.LISTENER_EXISTS,
          name: pattern
        })

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
          action: EVENT_ACTION.NOT_LISTENING,
          name: pattern
        })

      listener.unlisten(pattern)
      listener.unlisten(pattern)
    })

    it('calls listener when subscription for pattern', () => {
      listenCallbackMock
        .expects('listenCallback')
        .once()
        //.withArgs(subscription, listenResponse)

      listener.handle({
        topic: TOPIC.EVENT,
        action:EVENT_ACTION.SUBSCRIPTION_FOR_PATTERN_FOUND,
        name: pattern,
        subscription
    })
//      listenResponse.accept()
    })
  })

  // describe('when pattern is found or removed', () => {
  //   let spy: sinon.SinonSpy
  //   beforeEach(() => {
  //     spy = sinon.spy()
  //     listener.listen(pattern, spy)
  //     services.connectionMock.restore()
  //     services.timeoutRegistryMock.restore()
  //   })



  //   it('calls listener when subscription for pattern removed', () => {
  //     listener.handle({
  //       topic: TOPIC.EVENT,
  //       action:EVENT_ACTION.SUBSCRIPTION_FOR_PATTERN_REMOVED,
  //       name: pattern,
  //       subscription
  //     })

  //     sinon.assert.calledOnce(spy)
  //     //sinon.assert.calledWithExactly(spy, subscription, 3)
  //   })
  // })

})
