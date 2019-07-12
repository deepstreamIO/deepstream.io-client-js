import {TimeoutId, TimeoutRegistry} from './timeout-registry'
import * as sinon from 'sinon'
import { getServicesMock } from '../test/mocks'
import { DefaultOptions, Options } from '../client-options'
import { EVENT, CONNECTION_STATE } from '../constants'
import { TOPIC, EVENT_ACTION } from '@deepstream/protobuf/dist/types/all'
import { RPC_ACTION } from '@deepstream/protobuf/dist/types/rpc'

describe('timeout registry', () => {
    let timeoutRegistry: TimeoutRegistry
    let services: any
    let options: Options
    let timeoutId: TimeoutId
    const name = 'event'
    const message = {
        topic: TOPIC.EVENT,
        action: EVENT_ACTION.SUBSCRIBE,
        name
    }

    beforeEach(() => {
        options = Object.assign({}, DefaultOptions)
        options.subscriptionTimeout = 10
        services = getServicesMock()
        services.connection.getConnectionState.returns(CONNECTION_STATE.OPEN)
        timeoutRegistry = new TimeoutRegistry(services, options)
        services.connection.onLost(timeoutRegistry.onConnectionLost.bind(timeoutRegistry))
    })

    afterEach(() => {
        services.loggerMock.verify()
    })

    describe('adding timeout when connection down', () => {
        beforeEach(() => {
            services.connection.isConnected = false
            timeoutId = timeoutRegistry.add({ message })
        })

        it('does not invoke an error', done => {
            setTimeout(done, 20)
        })
    })

    describe('generic timeout', () => {
        beforeEach(() => {
            timeoutId = timeoutRegistry.add({ message })
        })

        it('invokes the error callback once the timeout has occured', done => {
            services.loggerMock
                .expects('warn')
                .once()
                .withExactArgs(message, EVENT.ACK_TIMEOUT)

            setTimeout(done, 20)
        })

        it('adding an entry twice does not throw error', () => {
            timeoutRegistry.add({ message })
            // no error is thrown in afterEach
        })

        it('receives an ACK message clears timeout', done => {
            timeoutRegistry.remove(message)
            setTimeout(done, 10)
        })

        it('clearing timer id clears timeout', done => {
            timeoutRegistry.clear(timeoutId)
            setTimeout(done, 10)
        })

        it('clears timeout when connection lost', done => {
            services.simulateConnectionLost()
            setTimeout(done, 10)
        })
    })

    describe('custom timeout and event', () => {
        let spy: sinon.SinonSpy

        beforeEach(() => {
            spy = sinon.spy()
            timeoutId = timeoutRegistry.add({
                message,
                event: RPC_ACTION.RESPONSE_TIMEOUT,
                duration: 25,
                callback: spy
            })
        })

        it ('doesnt trigger timeout after generic subscriptionTimeout', done => {
            setTimeout(() => {
                sinon.assert.callCount(spy, 0)
                done()
            }, 20)
        })

        it ('triggers timeout with custom attributes', done => {
            setTimeout(() => {
              sinon.assert.calledOnce(spy)
              sinon.assert.calledWithExactly(spy, RPC_ACTION.RESPONSE_TIMEOUT, message)
              done()
            }, 50)
        })

        it('receives an ACK message clears timeout', done => {
            timeoutRegistry.remove(message)
            setTimeout(() => {
              sinon.assert.callCount(spy, 0)
              done()
            }, 50)
        })

        it('clearing timer id clears timeout', done => {
            timeoutRegistry.clear(timeoutId)
            setTimeout(() => {
                sinon.assert.callCount(spy, 0)
                done()
            }, 50)
        })

        it('clears timeout when connection lost', done => {
            services.simulateConnectionLost()
            setTimeout(done, 10)
        })
    })
})
