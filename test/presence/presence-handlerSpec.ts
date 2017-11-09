import { Promise as BBPromise } from 'bluebird'
import { EventEmitter } from 'events'
import { expect } from 'chai'
import { assert, spy } from 'sinon'
import { getServicesMock, getLastMessageSent } from '../mocks'
import { EVENT, CONNECTION_STATE } from '../../src/constants'
import { TOPIC, PRESENCE_ACTIONS, PresenceMessage, Message } from '../../binary-protocol/src/message-constants'
import * as Emitter from 'component-emitter2'

import { DefaultOptions, Options } from '../../src/client-options'
import { PresenceHandler, QueryResult, IndividualQueryResult } from '../../src/presence/presence-handler'

describe.only('Presence handler', () => {
  const flushTimeout = 10
  const emitter = new Emitter()
  let services: any
  let presenceHandler: PresenceHandler
  let handle: Function
  let callbackSpy: sinon.SinonSpy
  const options = Object.assign({}, DefaultOptions)
  let counter: number

  beforeEach(() => {
    services = getServicesMock()
    presenceHandler = new PresenceHandler(emitter, services, options)
    handle = services.getHandle()
    callbackSpy = spy()
    counter = 0
  })

  afterEach(() => {
    services.verify()
  })

  it('validates parameters on subscribe, unsubscribe and getAll', () => {
    expect(presenceHandler.subscribe.bind(presenceHandler)).to.throw()
    expect(presenceHandler.subscribe.bind(presenceHandler, 'name')).to.throw()
    expect(presenceHandler.subscribe.bind(presenceHandler, 'name', 123)).to.throw()
    expect(presenceHandler.subscribe.bind(presenceHandler, 'name', {})).to.throw()
    expect(presenceHandler.subscribe.bind(presenceHandler, '', () => {})).to.throw()
    expect(presenceHandler.subscribe.bind(presenceHandler, 123, () => {})).to.throw()
    expect(presenceHandler.subscribe.bind(presenceHandler, null, () => {})).to.throw()
    expect(presenceHandler.subscribe.bind(presenceHandler, undefined, () => {})).to.throw()

    expect(presenceHandler.unsubscribe.bind(presenceHandler, '')).to.throw()
    expect(presenceHandler.unsubscribe.bind(presenceHandler, 123)).to.throw()
    expect(presenceHandler.unsubscribe.bind(presenceHandler, null)).to.throw()
    expect(presenceHandler.unsubscribe.bind(presenceHandler, 'name', 1)).to.throw()
    expect(presenceHandler.unsubscribe.bind(presenceHandler, 'name', {})).to.throw()
    expect(presenceHandler.unsubscribe.bind(presenceHandler, 'name', 'name')).to.throw()

    expect(presenceHandler.getAll.bind(presenceHandler, '')).to.throw()
    expect(presenceHandler.getAll.bind(presenceHandler, 123)).to.throw()
    expect(presenceHandler.getAll.bind(presenceHandler, null)).to.throw()
    expect(presenceHandler.getAll.bind(presenceHandler, 'name', {})).to.throw()
    expect(presenceHandler.getAll.bind(presenceHandler, 'name', 1)).to.throw()
  })

  it('cant\'t query getAll when client is offline', async () => {
    const promisseError = spy()
    const promisseSuccess = spy()

    services.connection.isConnected = false
    services.connectionMock
      .expects('sendMessage')
      .never()

    presenceHandler.getAll(callbackSpy)
    const promise = presenceHandler.getAll()
    promise.then(promisseSuccess).catch(promisseError)

    await BBPromise.delay(0)
    assert.calledOnce(callbackSpy)
    assert.calledWithExactly(callbackSpy, { reason: EVENT.CLIENT_OFFLINE })

    assert.notCalled(promisseSuccess)
    assert.calledOnce(promisseError)
    assert.calledWithExactly(promisseError, { reason: EVENT.CLIENT_OFFLINE })
  })

  it('subscribes to presence with user a', async () => {
    const userA = 'userA'
    const message = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE,
      correlationId: counter.toString(),
      parsedData: [userA]
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
     .withExactArgs(message)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    presenceHandler.subscribe(userA, callbackSpy)
    await BBPromise.delay(flushTimeout)
  })

  it('subscribes to presence for all users', async () => {
    const message = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE_ALL
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    presenceHandler.subscribe(callbackSpy)
    await BBPromise.delay(flushTimeout)
  })

  it('queries for specific users presence', () => {
    const users = ['userA','userB']
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
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    presenceHandler.getAll(users, callbackSpy)
  })

  it('queries for all users presence', () => {
    const message = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.QUERY_ALL
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    presenceHandler.getAll(callbackSpy)
  })

  it('sends unsubscribe for specific user presence', async () => {
    const user = 'user'
    const subMsg = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTIONS.SUBSCRIBE, correlationId: counter.toString(), parsedData: [ user ] }
    counter++
    const unsubMsg = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTIONS.UNSUBSCRIBE, correlationId: counter.toString(), parsedData: [ user ] }

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(subMsg)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message: subMsg })

    presenceHandler.subscribe(user, callbackSpy)
    await BBPromise.delay(flushTimeout)

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(unsubMsg)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message: unsubMsg })

    presenceHandler.unsubscribe(user)
    await BBPromise.delay(flushTimeout)
  })

  it('sends unsubscribe for all users presence', async () => {
    const subMsg = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTIONS.SUBSCRIBE_ALL }
    const unsubMsg = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTIONS.UNSUBSCRIBE_ALL }

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(subMsg)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message: subMsg })

    presenceHandler.subscribe(callbackSpy)
    await BBPromise.delay(flushTimeout)

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(unsubMsg)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message: unsubMsg })

    presenceHandler.unsubscribe()
    await BBPromise.delay(flushTimeout)
  })

  it('handles acks messages', () => {
    const message: Message = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE_ACK,
      isAck: true
    }
    services.timeoutRegistryMock
      .expects('remove')
      .once()
      .withExactArgs(message)

    presenceHandler.handle(message)
  })

  it('resubscribes subscriptions when client reconnects', async () => {
    const users = ['userA','userB']
    presenceHandler.subscribe(users[0], () => {})
    presenceHandler.subscribe(users[1], () => {})
    presenceHandler.subscribe(() => {})
    await BBPromise.delay(flushTimeout)

    counter = parseInt(getLastMessageSent().correlationId as string, 10) + 1
    const messageSubscribeAll = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE_ALL
    }
    const messageSubscribe = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE,
      correlationId: counter.toString(),
      parsedData: users
    }

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(messageSubscribeAll)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message: messageSubscribeAll })
    services.connectionMock
      .expects('sendMessage')
      .once()
     .withExactArgs(messageSubscribe)
    services.timeoutRegistryMock
      .expects('add')
      .once()
     .withExactArgs({ message: messageSubscribe })

    emitter.emit(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.RECONNECTING)
    emitter.emit(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.OPEN)
    await BBPromise.delay(flushTimeout)
  })

  describe('when server responds for getAll for all users ', () => {
    let callback: sinon.SinonSpy
    let promisseSuccess: sinon.SinonSpy
    let promisseError: sinon.SinonSpy
    let promise: Promise<QueryResult>
    let users: Array<string>

    beforeEach(() => {
      callback = spy()
      promisseError = spy()
      promisseSuccess = spy()
      users = ['userA', 'userB']

      presenceHandler.getAll(callback)
      const promise = presenceHandler.getAll()
      promise.then(promisseSuccess).catch(promisseError)
    })

    it('receives data for query all users', async () => {
      function message (id: number): PresenceMessage {
        return {
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTIONS.QUERY_ALL_RESPONSE,
        parsedData: users,
        correlationId: id.toString()
      }}
      const messageForCallback = message(counter)
      const messageForPromise = message(counter + 1)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(messageForCallback)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(messageForPromise)

      presenceHandler.handle(messageForCallback)
      presenceHandler.handle(messageForPromise)

      await BBPromise.delay(1)
      assert.calledOnce(callback)
      assert.calledWithExactly(callback, null, users)

      assert.notCalled(promisseError)
      assert.calledOnce(promisseSuccess)
      assert.calledWithExactly(promisseSuccess, users)
    })

    it('recieves message denied for query all users', async () => {

    })
    it('recieves permission error for query all users', async () => {

    })
  })

  describe('when server responds for getAll for specific users ', () => {
    let callback: sinon.SinonSpy
    let promisseSuccess: sinon.SinonSpy
    let promisseError: sinon.SinonSpy
    let promise: Promise<QueryResult>
    let users: Array<string>
    let usersPresence: IndividualQueryResult

    beforeEach(() => {
      callback = spy()
      promisseError = spy()
      promisseSuccess = spy()
      users = ['userA', 'userB']
      usersPresence = { 'userA': true, 'userB': false }
      presenceHandler.getAll(users, callback)
      const promise = presenceHandler.getAll(users)
      promise.then(promisseSuccess).catch(promisseError)
    })

    it('receives data for query specific users', async () => {
      function message (id: number): PresenceMessage {
        return {
          topic: TOPIC.PRESENCE,
          action: PRESENCE_ACTIONS.QUERY_RESPONSE,
          parsedData: usersPresence,
          correlationId: id.toString()
        }
      }

      const messageForCallback = message(counter)
      const messageForPromise = message(counter + 1)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(messageForCallback)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(messageForPromise)

      presenceHandler.handle(messageForCallback)
      presenceHandler.handle(messageForPromise)

      await BBPromise.delay(1)
      assert.calledOnce(callback)
      assert.calledWithExactly(callback, null, usersPresence)

      assert.notCalled(promisseError)
      assert.calledOnce(promisseSuccess)
      assert.calledWithExactly(promisseSuccess, usersPresence)
    })


    it('recieves message denied for query users', async () => {

    })
    it('recieves permission error for query users', async () => {

    })
  })

  describe('when subscribing to userA, userB and all', () => {
    const userA = 'userA'
    const userB = 'userB'
    let userACallback: sinon.SinonSpy
    let userBCallback: sinon.SinonSpy
    let allUsersCallback: sinon.SinonSpy

    beforeEach(async () => {
      userACallback = spy()
      userBCallback = spy()
      allUsersCallback = spy()
      presenceHandler.subscribe(userA, userACallback)
      presenceHandler.subscribe(userB, userBCallback)
      presenceHandler.subscribe(allUsersCallback)
      await BBPromise.delay(flushTimeout)
    })

    it('notifies when userA logs in', () => {
      function message (action: PRESENCE_ACTIONS): Message {
        return {
          name: userA,
          topic: TOPIC.PRESENCE,
          action
        }
      }
      presenceHandler.handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN))
      presenceHandler.handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN_ALL))

      assert.calledOnce(userACallback)
      assert.calledWithExactly(userACallback, userA, true)

      assert.notCalled(userBCallback)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userA, true)
    })

    it('notifies when userB logs out', () => {
      function message (action: PRESENCE_ACTIONS): Message {
        return {
          name: userB,
          topic: TOPIC.PRESENCE,
          action
        }
      }
      presenceHandler.handle(message(PRESENCE_ACTIONS.PRESENCE_LEAVE))
      presenceHandler.handle(message(PRESENCE_ACTIONS.PRESENCE_LEAVE_ALL))

      assert.notCalled(userACallback)

      assert.calledOnce(userBCallback)
      assert.calledWithExactly(userBCallback, userB, false)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userB, false)
    })

    it('notifies only the all users callback when userC logs in', () => {
      const userC = 'userC'
      presenceHandler.handle({
        name: userC,
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTIONS.PRESENCE_JOIN_ALL
      })

      assert.notCalled(userACallback)

      assert.notCalled(userBCallback)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userC, true)
    })

    it('notifies only the all users callback when userC logs out', () => {
      const userC = 'userC'
      presenceHandler.handle({
        name: userC,
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTIONS.PRESENCE_LEAVE_ALL
      })

      assert.notCalled(userACallback)

      assert.notCalled(userBCallback)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userC, false)
    })

    it('doesn\'t notify callbacks when userA logs in after unsubscribing', async () => {
      presenceHandler.unsubscribe(userA)
      await BBPromise.delay(flushTimeout)

      presenceHandler.handle({
        name: userA,
        topic: TOPIC.PRESENCE,
        action: PRESENCE_ACTIONS.PRESENCE_JOIN
      })

      assert.notCalled(userACallback)

      assert.notCalled(userBCallback)

      assert.notCalled(allUsersCallback)
    })

    it('doesn\'t notify userA callback when userA logs in after unsubscribing', async () => {
      presenceHandler.unsubscribe(userA, userACallback)
      await BBPromise.delay(flushTimeout)
      function message (action: PRESENCE_ACTIONS): Message {
        return {
          name: userA,
          topic: TOPIC.PRESENCE,
          action
        }
      }
      presenceHandler.handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN))
      presenceHandler.handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN_ALL))

      assert.notCalled(userACallback)

      assert.notCalled(userBCallback)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userA, true)
    })

    it('doesn\'t notify all users callback when userA logs in after unsubscribing', async () => {
      presenceHandler.unsubscribe(allUsersCallback)
      await BBPromise.delay(flushTimeout)

      function message (action: PRESENCE_ACTIONS): Message {
        return {
          name: userA,
          topic: TOPIC.PRESENCE,
          action
        }
      }
      presenceHandler.handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN))
      presenceHandler.handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN_ALL))

      assert.calledOnce(userACallback)
      assert.calledWithExactly(userACallback, userA, true)

      assert.notCalled(userBCallback)

      assert.notCalled(allUsersCallback)
    })

    it('doesn\'t notify callbacks after unsubscribing all', async () => {
      presenceHandler.unsubscribe()
      await BBPromise.delay(flushTimeout)
      const users = [userA, userB]
      function message (user: string, action: PRESENCE_ACTIONS): Message {
        return {
          name: user,
          topic: TOPIC.PRESENCE,
          action
        }
      }
      users.forEach((user) => {
        presenceHandler.handle(message(user, PRESENCE_ACTIONS.PRESENCE_JOIN))
        presenceHandler.handle(message(user, PRESENCE_ACTIONS.PRESENCE_JOIN_ALL))
      })

      assert.notCalled(userACallback)

      assert.notCalled(userBCallback)

      assert.notCalled(allUsersCallback)
    })
  })

})
