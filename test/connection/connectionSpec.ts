import { Promise as BBPromise } from 'bluebird'
import { expect, assert } from 'chai'
import { mock, spy, stub } from 'sinon'

import { Services } from '../../src/client'
import { Connection } from '../../src/connection/connection'
import { getServicesMock } from '../mocks'
import { Options, DefaultOptions } from '../../src/client-options'
import {EVENT, CONNECTION_STATE } from '../../src/constants'
import { 
    TOPIC, 
    CONNECTION_ACTIONS as CONNECTION_ACTION, 
    AUTH_ACTIONS as AUTH_ACTION, 
    EVENT_ACTIONS as EVENT_ACTION 
} from '../../binary-protocol/src/message-constants'

import * as Emitter from 'component-emitter2'

describe('connection', () => {
    let connection: Connection
    let services: any
    let options
    let emitter
    let emitterMock: sinon.SinonMock
    let socket: any
    let socketMock: sinon.SinonMock
    let logger: any
    let loggerMock: sinon.SinonMock
    let authCallback: sinon.SinonSpy

    const url = 'wss://localhost:6020/deepstream'
    const authData = { password: '123456' }
    const clientData = { name: 'elton' }

    const heartbeatInterval = 15
    const initialUrl = 'wss://localhost:6020/deepstream'
    const otherUrl = 'wss://otherhost:6020/deepstream'

    const reconnectIntervalIncrement = 10
    const maxReconnectAttempts = 3
    const maxReconnectInterval = 30

    beforeEach(() => {
        services = getServicesMock()
        options = Object.assign(DefaultOptions, {
            heartbeatInterval,
            reconnectIntervalIncrement,
            maxReconnectAttempts,
            maxReconnectInterval
        })
        emitter = new Emitter()
        emitterMock = mock(emitter)
        connection = new Connection(services as any, options, initialUrl, emitter)
        getSocketMock()
        const loggerService = services.getLogger()
        logger = loggerService.logger,
        loggerMock = loggerService.loggerMock
        authCallback = spy()
    })

    afterEach(() => {
        services.verify()
        emitterMock.verify()
        loggerMock.verify()
    })

    it('supports happiest path #happy', async () => {
        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()
        await sendAuth()
        await receiveAuthResponse()
        await sendMessage()
        await closeConnection()
        await recieveConnectionClose()
    })

    it('send ping when pong received across all states #heartbeat', async () => {
        await openConnection()
        sendPong()
        receivePing()
    })

    it('miss heartbeat once #heartbeat', async () => {
        await openConnection()
        await BBPromise.delay(heartbeatInterval * 1.5)
        // verify no errors in afterAll
    })

    it('connection - miss a heartbeat twice and receive error', async () => {
        loggerMock
          .expects('error')
          .once()
          .withExactArgs(
              { topic: TOPIC.CONNECTION },
              EVENT.HEARTBEAT_TIMEOUT
          )

        await openConnection()
        await BBPromise.delay(heartbeatInterval * 3)
    })

    it('connection - redirect', async () => {
        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveRedirect()

        await openConnectionToRedirectedServer()

        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()
        await loseConnection()
        await reconnectToInitialServer()
        // await receiveChallengeRequest()
        // await sendChallengeResponse()
        // await receiveChallengeAccept()
    })

    it('connection - reject', async () => {
        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeReject()
    })

    it('handles authentication rejections #auth', async () => {
        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()
        await sendAuth()
        await receiveAuthRejectResponse()
        await sendAuth() // authenticate with different data
        await receiveAuthResponse()
        await closeConnection()
        await recieveConnectionClose()

        socketMock.restore()

        await awaitConnectionAck() // authenticate with a new connection
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()
        await sendAuth()
        await receiveAuthResponse()
        await closeConnection()
        await recieveConnectionClose()
    })

    it('handles bad authentication data #auth', async () => {
        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()
        await sendInvalidAuthClient()
        await sendInvalidAuth()
        await receiveAuthRejectResponse()
        // await closeConnection()
    })

    it.skip('reaches max reconnection attempts considering the max reconnections interval #reconnect', async () => {
        emitterMock
          .expects('emit')
          .once()
          .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.RECONNECTING)

        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()

        await receiveConnectionError()
        await BBPromise.delay(0)

        await receiveConnectionError()
        await BBPromise.delay(10)

        await receiveConnectionError()
        await BBPromise.delay(20)
    })

    async function openConnection () {
        socket.simulateOpen()
        await BBPromise.delay(0)
    }

    async function awaitConnectionAck () {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_CONNECTION)

        expect(socket.url).to.equal(initialUrl)
        socket.simulateOpen()
        await BBPromise.delay(0)
    }

    async function receiveChallengeRequest () {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.CHALLENGING)

        socket.simulateMessages([{
            topic: TOPIC.CONNECTION,
            action: CONNECTION_ACTION.CHALLENGE
        }])

        await BBPromise.delay(0)
    }

    async function sendChallengeResponse () {
        socketMock
            .expects('sendParsedMessage')
            .once()
            .withExactArgs([{
                topic: TOPIC.CONNECTION,
                action: CONNECTION_ACTION.CHALLENGE_RESPONSE,
                parsedData: url
            }])

        await BBPromise.delay(0)
    }

    async function receiveChallengeAccept () {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_AUTHENTICATION)

        socket.simulateMessages([{
            topic: TOPIC.CONNECTION,
            action: CONNECTION_ACTION.ACCEPT
        }])

        await BBPromise.delay(0)
    }

    async function receiveChallengeReject () {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.CHALLENGE_DENIED)

        socket.simulateMessages([{
            topic: TOPIC.CONNECTION,
            action: CONNECTION_ACTION.REJECT
        }])

        await BBPromise.delay(0)
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
        await BBPromise.delay(0)
    }

    async function sendInvalidAuthClient () {
        expect(() => {
            connection.authenticate('Bad Auth Data' as any, authCallback)
        }).to.throw('invalid argument authParams')

        assert(authCallback.called === false)

        await BBPromise.delay(0)
    }

    async function sendInvalidAuth () {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AUTHENTICATING)

        socketMock
            .expects('sendParsedMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.AUTH,
                action: AUTH_ACTION.REQUEST,
                parsedData: {_username: 'invalid'} // assume this is invalid
            })

        connection.authenticate({_username: 'invalid'}, authCallback)

        await BBPromise.delay(0)
    }

    async function receiveAuthResponse () {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.OPEN)

        socket.simulateMessages([{
            topic: TOPIC.AUTH,
            action: AUTH_ACTION.AUTH_SUCCESSFUL,
            parsedData: clientData
        }])

        await BBPromise.delay(0)
    }

    async function sendMessage () {
        socket.simulateMessages([{
            topic: TOPIC.EVENT,
            action: EVENT_ACTION.EMIT,
            name: 'eventA'
        }])
        await BBPromise.delay(0)
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
        await BBPromise.delay(0)
    }

    async function recieveConnectionClose () {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.CLOSED)

        socket.simulateMessages([{
            topic: TOPIC.CONNECTION,
            action: CONNECTION_ACTION.CLOSED
        }])

        socket.simulateRemoteClose()
        await BBPromise.delay(0)
    }

    function receivePing () {
        socket.simulateMessages([{
            topic: TOPIC.CONNECTION,
            action: CONNECTION_ACTION.PING
        }])
    }

    function sendPong () {
        socketMock
            .expects('sendParsedMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.CONNECTION,
                action: CONNECTION_ACTION.PONG
            })
    }

    async function receiveConnectionError () {
        loggerMock
            .expects('error')
            .once()
            .withExactArgs(
            { topic: TOPIC.CONNECTION },
            EVENT.CONNECTION_ERROR,
            JSON.stringify({ code: 1234 })
        )

        socket.simulateError()
        await BBPromise.delay(5)
    }

    async function receiveRedirect () {
        emitterMock
            .expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.REDIRECTING)

        socket.simulateMessages([{
            topic: TOPIC.CONNECTION,
            action: CONNECTION_ACTION.REDIRECT,
            data: otherUrl
        }])

        await BBPromise.delay(0)
    }

    async function openConnectionToRedirectedServer () {
        emitterMock
            .expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_CONNECTION)

        getSocketMock()
        expect(socket.url).to.equal(otherUrl)
        socket.simulateOpen()
        await BBPromise.delay(0)
    }

    async function receiveAuthRejectResponse () {
        emitterMock
            .expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_AUTHENTICATION)

        socket.simulateMessages([{
            topic: TOPIC.AUTH,
            action: AUTH_ACTION.AUTH_UNSUCCESSFUL,
            parsedData: AUTH_ACTION.INVALID_MESSAGE_DATA
        }])

        await BBPromise.delay(10)

        assert(authCallback.calledWith(false, { reason: EVENT.INVALID_AUTHENTICATION_DETAILS }))

        await BBPromise.delay(0)
    }

    async function loseConnection () {
        emitterMock
            .expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.RECONNECTING)

        socket.close()
        await BBPromise.delay(0)
    }

    async function reconnectToInitialServer () {
        socketMock
            .expects('onopen')
            .once()

        socketMock
            .expects('sendParsedMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.CONNECTION,
                action: CONNECTION_ACTION.CHALLENGE_RESPONSE,
                parsedData: url
            })

        socket.simulateOpen()
        await BBPromise.delay(0)
    }

    async function connectionClosedError () {
        loggerMock
            .expects('error')
            .once()
            .withExactArgs({ topic: TOPIC.CONNECTION }, EVENT.IS_CLOSED)

        await BBPromise.delay(0)
    }

    async function receiveInvalidParseError () {

        socket.simulateMessages([{
            topic: TOPIC.AUTH,
            action: AUTH_ACTION.INVALID_MESSAGE_DATA,
            data: 'invalid authentication message'
        }])

        await BBPromise.delay(0)

        assert(authCallback.calledWith(false, { reason: EVENT.INVALID_AUTHENTICATION_DETAILS }) === true)

        await BBPromise.delay(2)
    }

    function losesConnection () {
        emitterMock
            .expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.RECONNECTING)

        socket.simulateRemoteClose()
    }

    function getSocketMock () {
        const socketService = services.getSocket()
        socket = socketService.socket
        socketMock = socketService.socketMock
    }
})
