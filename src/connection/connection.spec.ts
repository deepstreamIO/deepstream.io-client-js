import { expect } from 'chai'
import { mock, spy, assert } from 'sinon'

import { Connection } from './connection'
import { getServicesMock } from '../test/mocks'
import { DefaultOptions } from '../client-options'
import { EVENT, CONNECTION_STATE, TOPIC, CONNECTION_ACTION, AUTH_ACTION, EVENT_ACTION } from '../constants'

import { Emitter } from '../util/emitter'
import { PromiseDelay } from '../util/utils'

describe('connection', () => {
  let connection: Connection
  let services: any
  let options
  let emitter
  let emitterMock: sinon.SinonMock
  let socket: any
  let socketMock: sinon.SinonMock
  let loggerMock: sinon.SinonMock
  let authCallback: sinon.SinonSpy

  const url = 'wss://localhost:6020/deepstream'
  const authData = { password: '123456' }
  const clientData = { name: 'elton' }

  const heartbeatInterval = 15
  const initialUrl = 'wss://localhost:6020/deepstream'
  const otherUrl = 'wss://otherhost:6020/deepstream'

  const reconnectIntervalIncrement = 20
  const maxReconnectAttempts = 3
  const maxReconnectInterval = 300
  const offlineBufferTimeout = 10

  beforeEach(() => {
    services = getServicesMock()
    options = Object.assign(DefaultOptions, {
      heartbeatInterval,
      reconnectIntervalIncrement,
      maxReconnectAttempts,
      maxReconnectInterval,
      offlineBufferTimeout
    })
    emitter = new Emitter()
    emitterMock = mock(emitter)
    connection = new Connection(services as any, options, initialUrl, emitter)
    getSocketMock()
    getLoggerMock()
    authCallback = spy()
  })

  afterEach(() => {
    services.verify()
    emitterMock.verify()
    loggerMock.verify()
  })

  it('supports happiest path', async () => {
    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAccept()
    await sendAuth()
    await receiveAuthResponse()
    await sendMessage()
    await closeConnection()
    await recieveConnectionClose()
  })

  it('send ping and recieve pong across all states', async () => {
    await openConnection()
    sendPing()
    receivePong()
  })

  it('miss heartbeat once', async () => {
    await openConnection()
    await PromiseDelay(heartbeatInterval * 1.5)
    // verify no errors in afterAll
  })

  it('miss a heartbeat twice and receive error', async () => {
    loggerMock
      .expects('error')
      .once()
      .withExactArgs(
        { topic: TOPIC.CONNECTION },
        EVENT.HEARTBEAT_TIMEOUT
      )

    socket.getTimeSinceLastMessage = () => 200
    await openConnection()
  })

  it('get redirected to server B while connecting to server A, reconnect to server A when connection to server B is lost', async () => {
    await awaitConnectionAck()
    await sendChallenge()
    await receiveRedirect()

    await openConnectionToRedirectedServer()

    await sendChallenge()
    await receiveChallengeAccept()
    await loseConnection()
    await reconnectToInitialServer()
  })

  it('handles challenge denial', async () => {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(
        EVENT.CONNECTION_STATE_CHANGED,
        CONNECTION_STATE.CHALLENGE_DENIED
      )

    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeReject()
  })

  it('handles authentication when challenge was denied', async () => {
    loggerMock
      .expects('error')
      .once()
      .withArgs(
        { topic: TOPIC.CONNECTION },
        EVENT.IS_CLOSED
      )

    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(
        EVENT.CONNECTION_STATE_CHANGED,
        CONNECTION_STATE.CHALLENGE_DENIED
      )

    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeReject()

    connection.authenticate(authData, authCallback)

    assert.callCount(authCallback, 0)

    await PromiseDelay(10)
  })

  it('handles successful authentication', async () => {
    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAccept()
    await sendAuth()
    await receiveAuthResponse()

    assert.calledOnce(authCallback)
    assert.calledWithExactly(authCallback, true, clientData)
  })

  it('handles rejected authentication', async () => {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(
        EVENT.CONNECTION_STATE_CHANGED,
        CONNECTION_STATE.AWAITING_AUTHENTICATION
      )

    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAccept()
    await sendAuth()
    await receiveAuthRejectResponse()

    assert.calledOnce(authCallback)
    assert.calledWithExactly(authCallback, false, { reason: EVENT.INVALID_AUTHENTICATION_DETAILS })
  })

  it('handles authenticating too may times', async () => {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(
        EVENT.CONNECTION_STATE_CHANGED,
        CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS
    )

    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAccept()
    await sendAuth()
    await receiveTooManyAuthAttempts()
  })

  it('handles authentication timeout', async () => {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(
        EVENT.CONNECTION_STATE_CHANGED,
        CONNECTION_STATE.AUTHENTICATION_TIMEOUT
    )

    // loggerMock
    //   .expects('error')
    //   .once()
    //   .withExactArgs(
    //     { topic: TOPIC.CONNECTION },
    //     EVENT.AUTHENTICATION_TIMEOUT
    // )

    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAccept()
    await receiveAuthenticationTimeout()
  })

  it('try to authenticate with invalid data and receive error', async () => {
    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAccept()
    await sendBadAuthDataAndReceiveError()
  })

  it('tries to reconnect every time connection fails, stops when max reconnection attempts is reached and closes connection', async () => {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.CLOSING)

    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.RECONNECTING)

    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT[EVENT.MAX_RECONNECTION_ATTEMPTS_REACHED], 3)

    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAccept()

    // try to reconnect first time
    await receiveConnectionError()
    await PromiseDelay(0)

    // try to reconnect second time
    await receiveConnectionError()
    await PromiseDelay(25)

    // try to reconnect third time (now max is reached)
    await receiveConnectionError()
    await PromiseDelay(45)

    // try to reconnect fourth time (try to surpass the allowed max, fail)
    await receiveConnectionError()
    await PromiseDelay(70)
  })

  it('tries to reconnect if the connection drops unexpectedly', async () => {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.RECONNECTING)

    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAccept()
    await receiveConnectionError()
  })

  it('emits reauthenticationFailure if reauthentication is rejected', async () => {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.RECONNECTING)
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(
          EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_AUTHENTICATION)
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT.REAUTHENTICATION_FAILURE, { reason: EVENT.INVALID_AUTHENTICATION_DETAILS })

    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAccept()
    await sendAuth()
    await receiveAuthResponse()

    await receiveConnectionError()
    await PromiseDelay(0)

    await awaitConnectionAck()
    await sendChallenge()
    await receiveChallengeAcceptAndResendAuth()
    await receiveAuthRejectResponse()

    await PromiseDelay(0)
    assert.calledOnce(authCallback)
  })

  it('goes into limbo on connection lost', async () => {
    await openConnection()
    const limboSpy = spy()

    connection.onExitLimbo(limboSpy)

    await loseConnection()
    expect(connection.isInLimbo).to.equal(true)

    await PromiseDelay(20)

    assert.calledOnce(limboSpy)
    expect(connection.isInLimbo).to.equal(false)
  })

  async function openConnection () {
    socket.simulateOpen()
    await PromiseDelay(0)
  }

  async function awaitConnectionAck () {
    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_CONNECTION)
    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.CHALLENGING)

    expect(socket.url).to.equal(initialUrl)
    socket.simulateOpen()
    await PromiseDelay(0)
  }

  async function sendChallenge () {
    socketMock
      .expects('sendParsedMessage')
      .once()
      .withExactArgs([{
        topic: TOPIC.CONNECTION,
        action: CONNECTION_ACTION.CHALLENGE,
        url
      }])

    await PromiseDelay(0)
  }

  async function receiveChallengeAccept () {
    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_AUTHENTICATION)

    socket.simulateMessages([{
      topic: TOPIC.CONNECTION,
      action: CONNECTION_ACTION.ACCEPT
    }])

    await PromiseDelay(0)
  }

  async function receiveChallengeAcceptAndResendAuth () {
    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_AUTHENTICATION)
    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AUTHENTICATING)
    socketMock
      .expects('sendParsedMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.AUTH,
        action: AUTH_ACTION.REQUEST,
        parsedData: authData
      })

    socket.simulateMessages([{
      topic: TOPIC.CONNECTION,
      action: CONNECTION_ACTION.ACCEPT
    }])

    await PromiseDelay(0)
  }

  async function receiveChallengeReject () {
    socket.simulateMessages([{
      topic: TOPIC.CONNECTION,
      action: CONNECTION_ACTION.REJECT
    }])

    await PromiseDelay(0)
  }

  async function sendAuth () {
    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AUTHENTICATING)

    socketMock
      .expects('sendParsedMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.AUTH,
        action: AUTH_ACTION.REQUEST,
        parsedData: authData
      })

    connection.authenticate(authData, authCallback)
    await PromiseDelay(0)
  }

  async function sendBadAuthDataAndReceiveError () {
    expect(() => {
      connection.authenticate('Bad Auth Data' as any, authCallback)
    }).to.throw('invalid argument authParamsOrCallback')
    expect(() => {
      connection.authenticate({}, 'Bad Auth Data' as any)
    }).to.throw('invalid argument callback')

    await PromiseDelay(0)
  }

  // async function sendInvalidAuth () {
  //   emitterMock.expects('emit')
  //     .once()
  //     .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AUTHENTICATING)

  //   socketMock
  //     .expects('sendParsedMessage')
  //     .once()
  //     .withExactArgs({
  //       topic: TOPIC.AUTH,
  //       action: AUTH_ACTION.REQUEST,
  //       parsedData: { _username: 'invalid' } // assume this is invalid
  //     })

  //   connection.authenticate({ _username: 'invalid' }, authCallback)

  //   await PromiseDelay(0)
  // }

  async function receiveAuthResponse (data?: object) {
    const receivedClientData = data || clientData
    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.OPEN)

    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CLIENT_DATA_CHANGED, Object.assign({}, receivedClientData))

    socket.simulateMessages([{
      topic: TOPIC.AUTH,
      action: AUTH_ACTION.AUTH_SUCCESSFUL,
      parsedData: Object.assign({}, receivedClientData)
    }])

    await PromiseDelay(5)
  }

  async function sendMessage () {
    socket.simulateMessages([{
      topic: TOPIC.EVENT,
      action: EVENT_ACTION.EMIT,
      name: 'eventA'
    }])
    await PromiseDelay(0)
  }

  async function closeConnection () {
    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.CLOSING)

    socketMock
      .expects('sendParsedMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.CONNECTION,
        action: CONNECTION_ACTION.CLOSING
      })

    connection.close()
    await PromiseDelay(0)
  }

  async function recieveConnectionClose () {
    emitterMock.expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.CLOSED)

    socket.simulateMessages([{
      topic: TOPIC.CONNECTION,
      action: CONNECTION_ACTION.CLOSING
    }])

    socket.simulateRemoteClose()
    await PromiseDelay(0)
  }

  function receivePong () {
    socket.simulateMessages([{
      topic: TOPIC.CONNECTION,
      action: CONNECTION_ACTION.PONG
    }])
  }

  function sendPing () {
    socketMock
      .expects('sendParsedMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.CONNECTION,
        action: CONNECTION_ACTION.PING
      })
  }

  async function receiveConnectionError () {
    loggerMock
      .expects('error')
      .once()
      .withArgs(
        { topic: TOPIC.CONNECTION },
        EVENT.CONNECTION_ERROR
      )

    socket.simulateError()
    await PromiseDelay(1)
  }

  async function receiveRedirect () {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.REDIRECTING)

    socket.simulateMessages([{
      topic: TOPIC.CONNECTION,
      action: CONNECTION_ACTION.REDIRECT,
      url: otherUrl
    }])

    await PromiseDelay(0)
  }

  async function openConnectionToRedirectedServer () {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_CONNECTION)
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.CHALLENGING)

    getSocketMock()
    expect(socket.url).to.equal(otherUrl)
    socket.simulateOpen()
    await PromiseDelay(0)
  }

  async function receiveAuthRejectResponse () {
    socket.simulateMessages([{
      topic: TOPIC.AUTH,
      action: AUTH_ACTION.AUTH_UNSUCCESSFUL,
      parsedData: AUTH_ACTION.INVALID_MESSAGE_DATA
    }])

    await PromiseDelay(10)
  }

  async function loseConnection () {
    emitterMock
      .expects('emit')
      .once()
      .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.RECONNECTING)

    socket.close()
    await PromiseDelay(2)
    expect(connection.isConnected).to.equal(false)
  }

  async function reconnectToInitialServer () {
    socketMock
      .expects('onopened')
      .once()

    socketMock
      .expects('sendParsedMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.CONNECTION,
        action: CONNECTION_ACTION.CHALLENGE,
        url
      })

    socket.simulateOpen()
    await PromiseDelay(0)
  }

  // async function connectionClosedError () {
  //   loggerMock
  //     .expects('error')
  //     .once()
  //     .withExactArgs({ topic: TOPIC.CONNECTION }, EVENT.IS_CLOSED)

  //   await PromiseDelay(0)
  // }

  // async function receiveInvalidParseError () {

  //   socket.simulateMessages([{
  //     topic: TOPIC.AUTH,
  //     action: AUTH_ACTION.INVALID_MESSAGE_DATA,
  //     data: 'invalid authentication message'
  //   }])

  //   await PromiseDelay(0)

  //   assert.calledOnce(authCallback)
  //   assert.calledWithExactly(authCallback, false, { reason: EVENT.INVALID_AUTHENTICATION_DETAILS })

  //   await PromiseDelay(0)
  // }

  async function receiveTooManyAuthAttempts () {
    socket.simulateMessages([{
      topic: TOPIC.AUTH,
      action: AUTH_ACTION.TOO_MANY_AUTH_ATTEMPTS
    }])

    await PromiseDelay(0)
  }

  async function receiveAuthenticationTimeout () {
    socket.simulateMessages([{
      topic: TOPIC.CONNECTION,
      action: CONNECTION_ACTION.AUTHENTICATION_TIMEOUT
    }])

    await PromiseDelay(0)
  }

  // function losesConnection () {
  //   emitterMock
  //     .expects('emit')
  //     .once()
  //     .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.RECONNECTING)

  //   socket.simulateRemoteClose()
  // }

  function getSocketMock () {
    const socketService = services.getSocket()
    socket = socketService.socket
    socketMock = socketService.socketMock
  }

  function getLoggerMock () {
    const loggerService = services.getLogger()
    loggerMock = loggerService.loggerMock
  }
})
