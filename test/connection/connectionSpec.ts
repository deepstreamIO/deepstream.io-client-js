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
    let authCallback: sinon.SinonSpy
    const authData = { password: '123456' }
    const clientData = { name: 'elton' }

    beforeEach(() => {
        services = getServicesMock()
        options = Object.assign({}, DefaultOptions)
        emitter = new Emitter()
        emitterMock = mock(emitter)
        connection = new Connection(services as any, options, 'localhost:6020', emitter)
        const temp = services.getSocket()
        socket = temp.socket
        socketMock = temp.socketMock
        authCallback = spy()
    })

    afterEach(() => {
        services.verify()
        emitterMock.verify()
    })

    it('supports happiest path', async () => {
        await awaitConnectionAck()
        await recieveChallengeRequest()
        await sendChallengeResponse()
        await recieveChallengeAccept()
        await sendAuth()
        await recieveAuthResponse()
        await sendMessage()
        await closeConnection()
    })

    async function awaitConnectionAck () {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(EVENT.CONNECTION_STATE_CHANGED, CONNECTION_STATE.AWAITING_CONNECTION)

        socket.simulateOpen()
        await BBPromise.delay(0)
    }

    async function recieveChallengeRequest () {
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

    async function recieveChallengeAccept () {
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

    async function recieveAuthResponse () {
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
})
