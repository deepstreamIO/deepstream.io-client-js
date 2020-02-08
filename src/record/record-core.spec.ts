// tslint:disabke:no-unused-expression
import { expect } from 'chai'
import { getServicesMock, getRecordServices } from '../test/mocks'

import { DefaultOptions, Options } from '../client-options'
import { RecordCore, RECORD_STATE } from './record-core'

import { spy, assert, match } from 'sinon'
import { EVENT, TOPIC, RECORD_ACTION } from '../constants'
import { PromiseDelay } from '../util/utils'

describe('record core', () => {

describe('online scenario, not individual tests', () => {
    let whenCompleted: sinon.SinonSpy
    let recordCore: RecordCore
    let options: Options
    let services: any
    let recordServices: any
    const context = {} as any

    beforeEach(function () {
        whenCompleted = spy()
        services = getServicesMock()
        recordServices = getRecordServices(services)

        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.RECORD,
                action: RECORD_ACTION.SUBSCRIBECREATEANDREAD,
                names: [name],
                correlationId: '0'
            })

        services.storageMock
            .expects('get')
            .once()
            .callsArgWith(1, name, -1, null)

        options = { ...DefaultOptions, recordDiscardTimeout: 20, recordReadTimeout: 20, subscriptionInterval: -1 }

        services.connection.isConnected = true
        recordCore = new RecordCore(name, services, options, recordServices, whenCompleted)
        recordCore.addReference(this)
    })

    afterEach(() => {
        services.verify()
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
        const readySpy = spy()
        recordCore.whenReady(context, readySpy)
        recordServices.readRegistry.recieve(READ_RESPONSE)

        assert.calledOnce(readySpy)
        assert.calledWithExactly(readySpy, context)
    })

    it('triggers ready promise on read response', async () => {
        let readyContext = null
        const promise = recordCore.whenReady(context)
        promise.then(result => readyContext = result)

        recordServices.readRegistry.recieve(READ_RESPONSE)

        await PromiseDelay(0)
        expect(readyContext).to.equal(context)
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
                action: RECORD_ACTION.UPDATE,
                isWriteAck: true,
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
                action: RECORD_ACTION.PATCH,
                name,
                path: 'firstname',
                parsedData: 'Bob',
                correlationId: '1',
                version: 2,
                isWriteAck: true
            })

        recordCore.set({ path: 'firstname', data: 'Bob', callback: () => {} })
    })

    it('sends erase messages for erase after when ready', () => {
        recordServices.readRegistry.recieve({ ...READ_RESPONSE, parsedData: { firstname: 'John' }})

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
        recordServices.readRegistry.recieve({ ...READ_RESPONSE, parsedData: { firstname: 'John' }})

        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
                topic: TOPIC.RECORD,
                action: RECORD_ACTION.ERASE,
                name,
                path: 'firstname',
                correlationId: '1',
                version: 2,
                isWriteAck: true
            })

        recordCore.set({ path: 'firstname', callback: () => {} })
    })

    it('queues discarding record when no longer needed', function () {
        recordServices.readRegistry.recieve(READ_RESPONSE)
        recordCore.removeReference(this)

        expect(recordCore.recordState).to.equal(RECORD_STATE.UNSUBSCRIBING)
        expect(recordCore.isReady).to.equal(true)
    })

    it('removes pending discard when usages increases', async function () {
        recordServices.readRegistry.recieve(READ_RESPONSE)
        recordCore.removeReference(this)
        recordCore.addReference({})

        await PromiseDelay(30)

        expect(recordCore.recordState).to.equal(RECORD_STATE.READY)

        expect(recordCore.isReady).to.equal(true)
    })

    it('sends discard when unsubscribe timeout completed', async function () {
        recordServices.readRegistry.recieve(READ_RESPONSE)
        recordCore.removeReference(this)

        services.connectionMock
        .expects('sendMessage')
        .once()
        .withExactArgs({
            topic: TOPIC.RECORD,
            action: RECORD_ACTION.UNSUBSCRIBE,
            names: [name],
            correlationId: name
        })

        services.storageMock
        .expects('set')
        .once()
        .callsArgWith(3, null)

        await PromiseDelay(30)

        expect(recordCore.recordState).to.equal(RECORD_STATE.UNSUBSCRIBED)

        assert.calledOnce(whenCompleted)
        assert.calledWithExactly(whenCompleted, name)

        expect(recordCore.isReady).to.equal(false)
    })

    it('sends delete when ready', async () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.storageMock
        .expects('delete')
        .once()
        .callsArgWith(1)

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

        expect(recordCore.isReady).to.equal(true)
    })

    it('calls delete when delete is confirmed', async () => {
        recordServices.readRegistry.recieve(READ_RESPONSE)

        services.storageMock
        .expects('delete')
        .once()
        .callsArgWith(1)

        services.connectionMock
        .expects('sendMessage')
        .once()

        services.storageMock
        .expects('delete')
        .once()
        .callsArgWith(1)

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
        expect(recordCore.isReady).to.equal(false)
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
        expect(recordCore.isReady).to.equal(false)
    })
})

describe('record core offline', () => {
    let whenCompleted: sinon.SinonSpy
    let recordCore: RecordCore
    let options: Options
    let services: any
    let recordServices: any

    beforeEach(() => {
        whenCompleted = spy()
        services = getServicesMock()
        recordServices = getRecordServices(services)
        options = Object.assign({}, DefaultOptions, { recordDiscardTimeout: 20, recordReadTimeout: 20 })

        services.connectionMock
            .expects('sendMessage')
            .never()

        services.storageMock
            .expects('get')
            .once()
            .callsArgWith(1, name, 1, { firstname: 'wolfram' })

        services.connection.isConnected = false
        recordCore = new RecordCore(name, services, options, recordServices, whenCompleted)
    })

    afterEach(() => {
        services.verify()
        recordServices.verify()
    })

    it('triggers ready callback on load', () => {
        const context = {} as any
        const readySpy = spy()
        recordCore.whenReady(context, readySpy)

        assert.calledOnce(readySpy)
        assert.calledWithExactly(readySpy, context)
    })

    it('sets update messages for updates after when ready', () => {
        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' }, match.func)

        recordCore.set({ data: { firstname: 'Bob' } })
    })

    it('sends patch messages for path changes after when ready', () => {
        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' }, match.func)

        recordCore.set({ path: 'firstname', data: 'Bob' })
    })

    it('responds to update write acks with an offline error', async () => {
        const ackCallback = spy()

        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' }, match.func)

        recordCore.set({ data: { firstname: 'Bob' }, callback: ackCallback })

        await PromiseDelay(0)

        assert.calledOnce(ackCallback)
        assert.calledWithExactly(ackCallback, EVENT.CLIENT_OFFLINE, name)
    })

    it('sends patch messages for path changes after when ready', async () => {
        const ackCallback = spy()

        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' }, match.func)

        recordCore.set({ path: 'firstname', data: 'Bob', callback: ackCallback })

        await PromiseDelay(0)

        assert.calledOnce(ackCallback)
        assert.calledWithExactly(ackCallback, EVENT.CLIENT_OFFLINE, name)
    })

    it('sends erase messages for erase after when ready', () => {
        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, {}, match.func)

        recordCore.set({ path: 'firstname' })
    })

    it('sends erase write ack messages for erase after when ready', async () => {
        const ackCallback = spy()

        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, {}, match.func)

        recordCore.set({ path: 'firstname', callback: ackCallback })

        await PromiseDelay(0)

        assert.calledOnce(ackCallback)
        assert.calledWithExactly(ackCallback, EVENT.CLIENT_OFFLINE, name)
    })

    it('queues discarding record when no longer needed', function () {
        recordCore.removeReference(this)

        expect(recordCore.recordState).to.equal(RECORD_STATE.UNSUBSCRIBING)

        expect(recordCore.isReady).to.equal(true)
    })

    it('removes pending discard when usages increases', async function () {
        recordCore.removeReference(this)
        recordCore.addReference({})

        await PromiseDelay(30)

        expect(recordCore.recordState).to.equal(RECORD_STATE.READY)

        expect(recordCore.isReady).to.equal(true)
    })

    it('removes record when discarded and timeout passed', async function () {
        services.storageMock
            .expects('set')
            .once()
            .callsArgWith(3, null)

        recordCore.removeReference(this)

        await PromiseDelay(40)

        expect(recordCore.recordState).to.equal(RECORD_STATE.UNSUBSCRIBED)

        assert.calledOnce(whenCompleted)
        assert.calledWithExactly(whenCompleted, name)

        expect(recordCore.isReady).to.equal(false)
    })

    it.skip('sends delete when ready', async () => {
        services.storageMock
            .expects('delete')
            .once()
            .withExactArgs(name, match.func)

        recordCore.delete()

        expect(recordCore.recordState).to.equal(RECORD_STATE.DELETING)

        assert.notCalled(whenCompleted)

        expect(recordCore.isReady).to.equal(true)
    })

    it.skip('calls delete when delete is confirmed', async () => {
        services.storageMock
            .expects('delete')
            .once()
            .withExactArgs(name, match.func)
            .callsArgWith(1, name)

        recordCore.delete()

        await PromiseDelay(0)

        // deleted
        expect(recordCore.recordState).to.equal(RECORD_STATE.DELETED)

        assert.calledOnce(whenCompleted)
        assert.calledWithExactly(whenCompleted, name)

        expect(recordCore.isReady).to.equal(false)
    })
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
