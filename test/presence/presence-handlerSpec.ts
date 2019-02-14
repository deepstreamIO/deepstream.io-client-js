import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import { assert, spy } from 'sinon'
import { getServicesMock, getLastMessageSent } from '../mocks'
import { EVENT } from '../../src/constants'
import { TOPIC, PRESENCE_ACTIONS, PresenceMessage, Message } from '../../binary-protocol/src/message-constants'

import { DefaultOptions } from '../../src/client-options'
import { PresenceHandler, IndividualQueryResult } from '../../src/presence/presence-handler'

describe('Presence handler', () => {
  const flushTimeout = 10
  const userA = 'userA'
  const userB = 'userB'
  const userC = 'userC'

  let services: any
  let presenceHandler: PresenceHandler
  let handle: Function
  let callbackSpy: sinon.SinonSpy
  let promiseSuccess: sinon.SinonSpy
  let promiseError: sinon.SinonSpy
  const options = Object.assign({}, DefaultOptions)
  let counter: number

  beforeEach(() => {
    services = getServicesMock()
    presenceHandler = new PresenceHandler(services, options)
    handle = services.getHandle()
    callbackSpy = spy()
    promiseSuccess = spy()
    promiseError = spy()
    counter = 0
  })

  afterEach(() => {
    services.verify()
  })

  it('validates parameters on subscribe, unsubscribe and getAll', () => {
    expect(presenceHandler.subscribe.bind(presenceHandler)).to.throw()
    expect(presenceHandler.subscribe.bind(presenceHandler, 'name')).to.throw()
    expect(presenceHandler.subscribe.bind(presenceHandler, '', () => {})).to.throw()

    expect(presenceHandler.unsubscribe.bind(presenceHandler, '')).to.throw()
  })

  it('cant\'t query getAll when client is offline', async () => {
    services.connection.isConnected = false

    presenceHandler.getAll(callbackSpy)
    presenceHandler.getAll().then(promiseSuccess).catch(promiseError)

    await BBPromise.delay(1)

    assert.calledOnce(callbackSpy)
    assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)

    assert.notCalled(promiseSuccess)
    assert.calledOnce(promiseError)
    assert.calledWithExactly(promiseError, EVENT.CLIENT_OFFLINE)
  })

  it('calls query for all users callback with error message when connection is lost', async () => {
    presenceHandler.getAll(callbackSpy)
    const promise = presenceHandler.getAll()
    promise.then(promiseSuccess).catch(promiseError)

    services.simulateConnectionLost()
    await BBPromise.delay(1)

    assert.calledOnce(callbackSpy)
    assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)

    assert.notCalled(promiseSuccess)
    assert.calledOnce(promiseError)
    assert.calledWithExactly(promiseError, EVENT.CLIENT_OFFLINE)
  })

  it('calls query for specific users callback with error message when connection is lost', async () => {
    const users = ['userA', 'userB']
    presenceHandler.getAll(users, callbackSpy)
    const promise = presenceHandler.getAll(users)
    promise.then(promiseSuccess).catch(promiseError)

    services.simulateConnectionLost()
    await BBPromise.delay(1)

    assert.calledOnce(callbackSpy)
    assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)

    assert.notCalled(promiseSuccess)
    assert.calledOnce(promiseError)
    assert.calledWithExactly(promiseError, EVENT.CLIENT_OFFLINE)
  })

  it('subscribes to presence with user a', async () => {
    const subscribeMessage = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE,
      correlationId: counter.toString(),
      names: [userA]
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(subscribeMessage)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message: subscribeMessage })

    presenceHandler.subscribe(userA, callbackSpy)
    await BBPromise.delay(flushTimeout)
  })

  it('subscribes to presence for all users', async () => {
    const subscribeAllMessage = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE_ALL
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(subscribeAllMessage)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message: subscribeAllMessage })

    presenceHandler.subscribe(callbackSpy)
    await BBPromise.delay(flushTimeout)
  })

  it('queries for specific users presence', () => {
    const users = ['userA', 'userB']
    const queryMessage = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.QUERY,
      correlationId: counter.toString(),
      names: users
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(queryMessage)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message: queryMessage })

    presenceHandler.getAll(users, callbackSpy)
  })

  it('queries for all users presence', () => {
    const queryAllMessage = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.QUERY_ALL
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(queryAllMessage)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message: queryAllMessage })

    presenceHandler.getAll(callbackSpy)
  })

  it('sends unsubscribe for specific user presence', async () => {
    const user = 'user'
    const subMsg = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTIONS.SUBSCRIBE, correlationId: counter.toString(), names: [ user ] }
    counter++
    const unsubMsg = { topic: TOPIC.PRESENCE, action: PRESENCE_ACTIONS.UNSUBSCRIBE, correlationId: counter.toString(), names: [ user ] }

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
    const messageAck: Message = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE_ACK,
      isAck: true
    }
    services.timeoutRegistryMock
      .expects('remove')
      .once()
      .withExactArgs(messageAck)

    handle(messageAck)
  })

  it('resubscribes subscriptions when client reconnects', async () => {
    const users = [userA, userB]
    presenceHandler.subscribe(userA, () => {})
    presenceHandler.subscribe(userB, () => {})
    presenceHandler.subscribe(() => {})
    await BBPromise.delay(flushTimeout)

    counter = parseInt(getLastMessageSent().correlationId as string, 10) + 1
    const messageSubscribeAll = message(PRESENCE_ACTIONS.SUBSCRIBE_ALL)
    const messageSubscribe = {
      topic: TOPIC.PRESENCE,
      action: PRESENCE_ACTIONS.SUBSCRIBE,
      correlationId: counter.toString(),
      names: users
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

    services.simulateConnectionReestablished()
    await BBPromise.delay(flushTimeout)
  })

  describe('when server responds for getAll for all users ', () => {
    let callback: sinon.SinonSpy
    let users: Array<string>

    beforeEach(() => {
      callback = spy()
      users = ['userA', 'userB']

      presenceHandler.getAll(callback)
      const promise = presenceHandler.getAll()
      promise.then(promiseSuccess).catch(promiseError)
    })

    it('receives data for query all users', async () => {
      const messageForCallback = messageResponseQueryAll(counter, users)
      const messageForPromise = messageResponseQueryAll(counter + 1, users)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(Object.assign({}, messageForCallback, { action: PRESENCE_ACTIONS.QUERY_ALL_RESPONSE }))
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(Object.assign({}, messageForPromise, { action: PRESENCE_ACTIONS.QUERY_ALL_RESPONSE }))

      handle(messageForCallback)
      handle(messageForPromise)

      await BBPromise.delay(1)
      assert.calledOnce(callback)
      assert.calledWithExactly(callback, null, users)

      assert.notCalled(promiseError)
      assert.calledOnce(promiseSuccess)
      assert.calledWithExactly(promiseSuccess, users)
    })

    it('recieves error message for query all users', async () => {
      const error = PRESENCE_ACTIONS.MESSAGE_DENIED
      const messageForCallback = errorMessageResponseQueryAll(counter, error)
      const messageForPromise = errorMessageResponseQueryAll(counter + 1, error)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(messageForCallback)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(messageForPromise)

      handle(messageForCallback)
      handle(messageForPromise)

      await BBPromise.delay(1)
      assert.calledOnce(callback)
      assert.calledWithExactly(callback, PRESENCE_ACTIONS[error])

      assert.calledOnce(promiseError)
      assert.calledWithExactly(promiseError, PRESENCE_ACTIONS[error])

      assert.notCalled(promiseSuccess)
    })
  })

  describe('when server responds for getAll for specific users ', () => {
    let callback: sinon.SinonSpy
    let users: Array<string>
    let usersPresence: IndividualQueryResult

    beforeEach(() => {
      callback = spy()
      users = ['userA', 'userB']
      usersPresence = { userA: true, userB: false }
      presenceHandler.getAll(users, callback)
      const promise = presenceHandler.getAll(users)
      promise.then(promiseSuccess).catch(promiseError)
    })

    it('receives data for query specific users', async () => {
      const messageForCallback = messageResponseQuery(counter, usersPresence)
      const messageForPromise = messageResponseQuery(counter + 1, usersPresence)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(Object.assign({}, messageForCallback, { action: PRESENCE_ACTIONS.QUERY_RESPONSE }))
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(Object.assign({}, messageForPromise, { action: PRESENCE_ACTIONS.QUERY_RESPONSE }))

      handle(messageForCallback)
      handle(messageForPromise)

      await BBPromise.delay(1)
      assert.calledOnce(callback)
      assert.calledWithExactly(callback, null, usersPresence)

      assert.notCalled(promiseError)
      assert.calledOnce(promiseSuccess)
      assert.calledWithExactly(promiseSuccess, usersPresence)
    })

    it('recieves error message for query users', async () => {
      const error = PRESENCE_ACTIONS.MESSAGE_DENIED
      const messageForCallback = errorMessageResponseQuery(counter, error)
      const messageForPromise = errorMessageResponseQuery(counter + 1, error)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(messageForCallback)
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(messageForPromise)

      handle(messageForCallback)
      handle(messageForPromise)

      await BBPromise.delay(1)
      assert.calledOnce(callback)
      assert.calledWithExactly(callback, PRESENCE_ACTIONS[error])

      assert.calledOnce(promiseError)
      assert.calledWithExactly(promiseError, PRESENCE_ACTIONS[error])

      assert.notCalled(promiseSuccess)
    })

  })

  describe('when subscribing to userA, userB and all', () => {
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
      handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN, userA))
      handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN_ALL, userA))

      assert.calledOnce(userACallback)
      assert.calledWithExactly(userACallback, userA, true)

      assert.notCalled(userBCallback)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userA, true)
    })

    it('notifies when userB logs out', () => {
      handle(message(PRESENCE_ACTIONS.PRESENCE_LEAVE, userB))
      handle(message(PRESENCE_ACTIONS.PRESENCE_LEAVE_ALL, userB))

      assert.notCalled(userACallback)

      assert.calledOnce(userBCallback)
      assert.calledWithExactly(userBCallback, userB, false)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userB, false)
    })

    it('notifies only the all users callback when userC logs in', () => {
      handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN_ALL, userC))

      assert.notCalled(userACallback)

      assert.notCalled(userBCallback)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userC, true)
    })

    it('notifies only the all users callback when userC logs out', () => {
      handle(message(PRESENCE_ACTIONS.PRESENCE_LEAVE_ALL, userC))

      assert.notCalled(userACallback)

      assert.notCalled(userBCallback)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userC, false)
    })

    it('doesn\'t notify callbacks when userA logs in after unsubscribing', async () => {
      presenceHandler.unsubscribe(userA)
      await BBPromise.delay(flushTimeout)

      handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN, userA))

      assert.notCalled(userACallback)

      assert.notCalled(userBCallback)

      assert.notCalled(allUsersCallback)
    })

    it('doesn\'t notify userA callback when userA logs in after unsubscribing', async () => {
      presenceHandler.unsubscribe(userA, userACallback)
      await BBPromise.delay(flushTimeout)

      handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN, userA))
      handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN_ALL, userA))

      assert.notCalled(userACallback)

      assert.notCalled(userBCallback)

      assert.calledOnce(allUsersCallback)
      assert.calledWithExactly(allUsersCallback, userA, true)
    })

    it('doesn\'t notify all users callback when userA logs in after unsubscribing', async () => {
      presenceHandler.unsubscribe(allUsersCallback)
      await BBPromise.delay(flushTimeout)

      handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN, userA))
      handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN_ALL, userA))

      assert.calledOnce(userACallback)
      assert.calledWithExactly(userACallback, userA, true)

      assert.notCalled(userBCallback)

      assert.notCalled(allUsersCallback)
    })

    it('doesn\'t notify callbacks after unsubscribing all', async () => {
      presenceHandler.unsubscribe()
      await BBPromise.delay(flushTimeout)
      const users = [userA, userB]

      users.forEach( user => {
        handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN, user))
        handle(message(PRESENCE_ACTIONS.PRESENCE_JOIN_ALL, user))
      })

      assert.notCalled(userACallback)
      assert.notCalled(userBCallback)
      assert.notCalled(allUsersCallback)
    })
  })

  describe('limbo', () => {

    beforeEach(() => {
      services.connection.isConnected = false
      services.connection.isInLimbo = true
    })

    it('returns client offline error once limbo state over', async () => {
      presenceHandler.getAll(callbackSpy)
      services.simulateExitLimbo()

      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)
    })

    it('sends messages once re-established if in limbo', async () => {
      presenceHandler.getAll(callbackSpy)

      services.connectionMock
        .expects('sendMessage')
        .once()
      services.timeoutRegistryMock
        .expects('add')
        .once()

      services.simulateConnectionReestablished()
      await BBPromise.delay(1)
    })
  })

})

function message (action: PRESENCE_ACTIONS, user?: string): Message {
  if (user) {
    return {
      name: user,
      topic: TOPIC.PRESENCE,
      action
    }
  } else {
    return {
      topic: TOPIC.PRESENCE,
      action
    }
  }
}

function messageResponseQueryAll (id: number, users: Array<string>): PresenceMessage {
  return {
    topic: TOPIC.PRESENCE,
    action: PRESENCE_ACTIONS.QUERY_ALL_RESPONSE,
    names: users,
    correlationId: id.toString()
  }
}

function messageResponseQuery (id: number, usersPresence: IndividualQueryResult): PresenceMessage {
  return {
    topic: TOPIC.PRESENCE,
    action: PRESENCE_ACTIONS.QUERY_RESPONSE,
    parsedData: usersPresence,
    correlationId: id.toString()
  }
}

function errorMessageResponseQueryAll (id: number, error: PRESENCE_ACTIONS): PresenceMessage {
  return {
    topic: TOPIC.PRESENCE,
    action: error,
    originalAction: PRESENCE_ACTIONS.QUERY_ALL,
    correlationId: id.toString(),
    isError: true
  }
}

function errorMessageResponseQuery (id: number, error: PRESENCE_ACTIONS): PresenceMessage {
  return {
    topic: TOPIC.PRESENCE,
    action: error,
    originalAction: PRESENCE_ACTIONS.QUERY,
    correlationId: id.toString(),
    isError: true
  }
}
