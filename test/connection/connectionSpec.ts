import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import { mock, spy, stub } from 'sinon'

import { Services } from '../../src/client'
import { Connection } from '../../src/connection/connection'
import { getServicesMock } from '../mocks'
import { Options, DefaultOptions } from '../../src/client-options'
import {EVENT, CONNECTION_STATE, TOPIC, CONNECTION_ACTION, AUTH_ACTION, EVENT_ACTION} from '../../src/constants'

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

    const authData = { password: '123456' }
    const clientData = { name: 'elton' }
    const heartbeatInterval = 50
    const heartBeatTolerance = heartbeatInterval * 2

    beforeEach(() => {
        services = getServicesMock()
        options = Object.assign(DefaultOptions, { heartbeatInterval })
        emitter = new Emitter()
        emitterMock = mock(emitter)
        connection = new Connection(services as any, options, 'localhost:6020', emitter)
        const socketService = services.getSocket()
        socket = socketService.socket
        socketMock = socketService.socketMock
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

    it('supports happiest path', async () => {
        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()
        await sendAuth()
        await receiveAuthResponse()
        await sendMessage()
        await closeConnection()
    })

    it('connection - send ping when pong received across all states', async () => {
        await openConnection()
        sendPong()
        receivePing()
    })

    it('connection - miss heartbeat once', async () => {
        await openConnection()
        await BBPromise.delay(50)
    })

    it('connection - miss a heartbeat twice and receive error', async () => {
        await openConnection()
        await BBPromise.delay(50)
        await receiveConnectionError()
    })

    it.skip('connection - redirect @redirect', async () => {
        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()
        await receiveRedirect()

        await openConnectionToRedirectedServer()

        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()

        // await loseConnection()
        // await openConnection()
    })

    it.skip('connection - handles authentication rejections', async () => {
        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()
        await sendAuth()
        await receiveAuthRejectResponse()
        // authData = {} // different data
        await sendAuth()
        await receiveAuthResponse()
        await closeConnection()
        // authData = {} // different data
        await awaitConnectionAck()
        await receiveChallengeRequest()
        await sendChallengeResponse()
        await receiveChallengeAccept()
        await sendAuth()
    })

    async function openConnection () {
        socket.simulateOpen()
        await BBPromise.delay(0)
    }

    async function awaitConnectionAck () {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_CONNECTION)

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
        socket.simulateMessages([{
            topic: TOPIC.CONNECTION,
            action: CONNECTION_ACTION.CHALLENGE_RESPONSE,
            data: 'localhost'
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

    async function sendMessage ()  {
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
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.CLOSED)

        connection.close()
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
                `heartbeat not received in the last ${heartBeatTolerance} milliseconds`
            )

        await BBPromise.delay(0)
    }

    async function receiveRedirect () {
        emitterMock
            .expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.REDIRECTING)

        socketMock
            .expects('onclose')
            .once()

        socket.simulateMessages([{
            topic: TOPIC.CONNECTION,
            action: CONNECTION_ACTION.REDIRECT,
            data: 'wss://localhost:6020'
        }])

        await BBPromise.delay(0)
    }

    async function openConnectionToRedirectedServer () {
        emitterMock
            .expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_CONNECTION)

        socket.simulateOpen()

        await BBPromise.delay(0)
    }

    async function receiveAuthRejectResponse () {
        socket.simulateMessages([{
            topic: TOPIC.AUTH,
            action: AUTH_ACTION.AUTH_UNSUCCESSFUL,
            data: AUTH_ACTION.INVALID_MESSAGE_DATA,

        }])
    }
})
