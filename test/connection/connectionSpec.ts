import { expect } from 'chai'
import { mock, spy, stub } from 'sinon'

import { Connection } from '../../src/connection/connection'
import { getServicesMock } from '../mocks'
import { Options, DefaultOptions } from '../../src/client-options'
import {CONNECTION_STATE} from '../../src/constants'

import * as Emitter from 'component-emitter2'

describe('connection', () => {
    let connection
    let services
    let options
    let emitter
    let emitterMock: sinon.SinonMock

    beforeEach(() => {
        services = getServicesMock()
        options = Object.assign({}, DefaultOptions)
        emitter = new Emitter()
        emitterMock = mock(emitter)
        connection = new Connection(services, options, 'localhost:6020', emitter)

    })

    it('Happy part', () => {
        awaitConnectionAck()
        receiveConnectionAck()
        sendAuth()
        recieveAuthResponse()
        sendMessage()
        closeConnection()
    })

    function awaitConnectionAck() {
        emitterMock.expects('emit')
            .once()
            .withExactArgs(CONNECTION_STATE.AWAITING_CONNECTION)

        

        emitterMock.expects('emit')
            .once()
            .withExactArgs(CONNECTION_STATE.AWAITING_CONNECTION)
    }

    function receiveConnectionAck() {
        connection._endpoint.emit('message', msg('C|A+'))
        expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
        expect(clientConnectionStateChangeCount).toBe(2)
    }

    function sendAuth() {
        expect(connection._endpoint.lastSendMessage).toBe(null)
        connection.authenticate({ user: 'Wolfram' }, authCallback)
        expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
        expect(connection.getState()).toBe('AUTHENTICATING')
        expect(clientConnectionStateChangeCount).toBe(3)
        expect(authCallback).not.toHaveBeenCalled()
    }

    function recieveAuthResponse() {
        connection._endpoint.emit('message', msg('A|A+'))
        expect(connection.getState()).toBe('OPEN')
        expect(authCallback).toHaveBeenCalledWith(true, null)
        expect(clientConnectionStateChangeCount).toBe(4)
    }

    function sendMessage()  {
        connection.sendMsg('R', 'S', ['test1'])
    }

    function closeConnection() {
        expect(connection._endpoint.isOpen).toBe(true)
        connection.close()
        expect(connection._endpoint.isOpen).toBe(false)
        expect(connection.getState()).toBe('CLOSED')
        expect(clientConnectionStateChangeCount).toBe(5)
    }
})