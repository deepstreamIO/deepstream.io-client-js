// tslint:disabke:no-unused-expression
import * as BBPromise from 'bluebird'
import { expect } from 'chai'
import { spy, assert } from 'sinon'
import { getServicesMock, getRecordServices } from '../mocks'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION } from '../../binary-protocol/src/message-constants'

import { DefaultOptions, Options } from '../../src/client-options'
import { RecordCore, RECORD_STATE } from '../../src/record/record-core'

describe('record core online', () => {
    let whenCompleted: sinon.SinonSpy
    let recordCore: RecordCore
    let options: Options
    let services: any
    let recordServices: any

    beforeEach(() => {
        whenCompleted = spy()
        services = getServicesMock()
        recordServices = getRecordServices(services)
        options = Object.assign({}, DefaultOptions, { discardTimeout: 20 })

        services.connection.isConnected = true
        recordCore = new RecordCore(name, services, options, recordServices, whenCompleted)
        services.connectionMock.restore()
    })

    afterEach(() => {
        services.verify()
    })

    it('sends a subscribe create and read message if online when created', () => {
        services.connection.isConnected = true

        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.RECORD,
                action: RECORD_ACTION.SUBSCRIBECREATEANDREAD,
                name
            })

        recordCore = new RecordCore(name, services, options, recordServices, whenCompleted)
    })

    it('doesn`t send updates before ready', () => {
        services.connectionMock
            .expects('sendMessage')
            .never()

        recordCore.set({ data: { firstname: 'Wolfram' } })
    })

    it('doesn`t send patches before ready', () => {
        services.connectionMock
            .expects('sendMessage')
            .never()

        recordCore.set({ path: 'firstname', data: 'Wolfram' })
    })

    it('triggers ready callback on read response', () => {
        const context = null
        const readySpy = spy()
        recordCore.whenReady(context, readySpy)
        recordServices.readRegistry.recieve(READ_RESPONSE)

        assert.calledOnce(readySpy)
        assert.calledWithExactly(readySpy, context)
    })

    it.skip('triggers ready promise on read response', () => {
        let promiseResult = null
        const context = { ola: 1 }
        const promise = recordCore.whenReady(null)
        if (promise) {
            promise.then(result => {
                promiseResult = result
            })
        }
        recordCore.handle(READ_RESPONSE)

        expect(promiseResult).to.equal(context)
    })

    it('sends update messages for updates after when ready', () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.RECORD,
                action: RECORD_ACTION.UPDATE,
                name,
                parsedData: { firstname: 'Bob' },
                version: 2
            })

        recordCore.set({ data: { firstname: 'Bob' } })
    })

    it('sends patch messages for path changes after when ready', () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.RECORD,
                action: RECORD_ACTION.PATCH,
                name,
                path: 'firstname',
                parsedData: 'Bob',
                version: 2
            })

        recordCore.set({ path: 'firstname', data: 'Bob' })
    })

    it('sends update messages for updates write ack after when ready', () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.RECORD,
                action: RECORD_ACTION.UPDATE_WITH_WRITE_ACK,
                name,
                parsedData: { firstname: 'Bob' },
                correlationId: '1',
                version: 2
            })

        recordCore.set({ data: { firstname: 'Bob' }, callback: () => {} })
    })

    it('sends patch messages for path changes after when ready', () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.RECORD,
                action: RECORD_ACTION.PATCH_WITH_WRITE_ACK,
                name,
                path: 'firstname',
                parsedData: 'Bob',
                correlationId: '1',
                version: 2
            })

        recordCore.set({ path: 'firstname', data: 'Bob', callback: () => {} })
    })

    it('sends erase messages for erase after when ready', () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.RECORD,
                action: RECORD_ACTION.ERASE,
                name,
                path: 'firstname',
                version: 2
            })

        recordCore.set({ path: 'firstname' })
    })

    it('sends erase write ack messages for erase after when ready', () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.RECORD,
                action: RECORD_ACTION.ERASE_WITH_WRITE_ACK,
                name,
                path: 'firstname',
                correlationId: '1',
                version: 2
            })

        recordCore.set({ path: 'firstname', callback: () => {} })
    })

    it('queues discarding record when no longer needed', () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)
        recordCore.discard()

        expect(recordCore.recordState).to.equal(RECORD_STATE.UNSUBSCRIBING)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.true
    })

    it('removes pending discard when usages increases', async () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)
        recordCore.discard()
        recordCore.usages++

        await BBPromise.delay(30)

        expect(recordCore.recordState).to.equal(RECORD_STATE.READY)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.true
    })

    it('sends discard when unsubscribe timeout completed', async () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)
        recordCore.discard()

        services.connectionMock
        .expects('sendMessage')
        .once()
        .withExactArgs({
            topic: TOPIC.RECORD,
            action: RECORD_ACTION.UNSUBSCRIBE,
            name
        })

        await BBPromise.delay(30)

        expect(recordCore.recordState).to.equal(RECORD_STATE.UNSUBSCRIBED)

        assert.calledOnce(whenCompleted)
        assert.calledWithExactly(whenCompleted, name)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.false
    })

    it('sends delete when ready', async () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.connectionMock
        .expects('sendMessage')
        .once()
        .withExactArgs({
            topic: TOPIC.RECORD,
            action: RECORD_ACTION.DELETE,
            name
        })

        recordCore.delete()

        expect(recordCore.recordState).to.equal(RECORD_STATE.DELETING)

        assert.notCalled(whenCompleted)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.true
    })

    it('calls delete when delete is confirmed', async () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.connectionMock
        .expects('sendMessage')
        .once()

        recordCore.delete()

        recordCore.handle({
            topic: TOPIC.RECORD,
            action: RECORD_ACTION.DELETE_SUCCESS,
            name
        })

        expect(recordCore.recordState).to.equal(RECORD_STATE.DELETED)

        assert.calledOnce(whenCompleted)
        assert.calledWithExactly(whenCompleted, name)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.false
    })

    it('calls delete when delete happens remotely', async () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        recordCore.handle({
            topic: TOPIC.RECORD,
            action: RECORD_ACTION.DELETED,
            name
        })

        expect(recordCore.recordState).to.equal(RECORD_STATE.DELETED)

        assert.calledOnce(whenCompleted)
        assert.calledWithExactly(whenCompleted, name)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.false
    })
})

const name = 'recordA'
const READ_RESPONSE = {
    topic: TOPIC.RECORD,
    action: RECORD_ACTION.READ_RESPONSE,
    name,
    parsedData: {},
    version: 1
}
