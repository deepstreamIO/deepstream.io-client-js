import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import { assert, spy } from 'sinon'
import { getServicesMock, getLastMessageSent } from '../mocks'
import { EVENT } from '../../src/constants'
import { TOPIC, PRESENCE_ACTIONS, PresenceMessage } from '../../binary-protocol/src/message-constants'

import { DefaultOptions, Options } from '../../src/client-options'
import { PresenceHandler } from '../../src/presence/presence-handler'

describe('Presence handler', () => {
  let services: any
  let presenceHandler: PresenceHandler
  let handle: Function
  let callbackSpy: sinon.SinonSpy
  const options = Object.assign({}, DefaultOptions)
  let counter: number

  beforeEach(() => {
    services = getServicesMock()
    presenceHandler = new PresenceHandler(services, options)
    handle = services.getHandle()
    callbackSpy = spy()
    counter = 0
  })

  afterEach(() => {
    services.verify()
  })

  it('subscribes to presence with user a and user b', () => {
    const userA = 'userA'
    const userB = 'userB'
    counter = 1
    const messageA = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE,
      correlationId: counter.toString(),
      parsedData: [userA]
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(messageA)
    services.timeoutRegistry
      .expects('add')
      .once()
      .withExactArgs(messageA)

    counter++
    const messageB = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE,
      correlationId: counter.toString(),
      parsedData: [userA]
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(messageB)
    services.timeoutRegistry
      .expects('add')
      .once()
      .withExactArgs(messageB)

    presenceHandler.subscribe(userA, callbackSpy)
    BBPromise.delay(1)
    presenceHandler.subscribe(userB, callbackSpy)
    BBPromise.delay(1)
  })

  // it('emits an error if no ack message is received for userB presence subscription', (done) => {

  //   expect(mockClient.lastError).toBe(null)
  //   setTimeout(() => {
  //     const errorParams = ['U', 'ACK_TIMEOUT', 'No ACK message received in time for 2']
  //     expect(mockClient.lastError).toEqual(errorParams)
  //     mockClient.lastError = null
  //     done()
  //   }, 20)
  // })

  it('queries for specific users presence', () => {
    const users = ['userA','userB']
    counter = 1
    const message = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.QUERY,
      correlationId: counter.toString(),
      parsedData: users
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)
    services.timeoutRegistry
      .expects('add')
      .once()
      .withExactArgs(message)

    presenceHandler.getAll(users, callbackSpy)
  })

  it('queries for all users presence', () => {
    counter = 1
    const message = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.QUERY_ALL,
      correlationId: counter.toString()
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)
    services.timeoutRegistry
      .expects('add')
      .once()
      .withExactArgs(message)

    presenceHandler.getAll(callbackSpy)
  })

  describe('when subscribing to userA and userB', () => {
    const userA = 'userA'
    const userB = 'userB'

    beforeEach(() => {
      presenceHandler.subscribe(userA, callbackSpy)
      presenceHandler.subscribe(userB, callbackSpy)
    })

    it('notifies when userA logs in', () => {
      presenceHandler.handle({
        name: userA
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTIONS.PRESENCE_JOIN
      })

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, true, userA)
    })

    it('notifies when userB logs out', () => {
      presenceHandler.handle({
        name: userB
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTIONS.PRESENCE_LEAVE
      })

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, false, userB)
    })
  })

})
