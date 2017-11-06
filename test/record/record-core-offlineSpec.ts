// tslint:disabke:no-unused-expression
import * as BBPromise from 'bluebird'
import { expect } from 'chai'
import { spy, assert, match } from 'sinon'
import { getServicesMock } from '../mocks'
import { EVENT } from '../../src/constants'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION } from '../../binary-protocol/src/message-constants'

import { CONNECTION_STATE } from '../../src/constants'
import { DefaultOptions, Options } from '../../src/client-options'
import { RecordCore, RECORD_STATE } from '../../src/record/record-core'

describe.skip('record core offline', () => {
    let whenCompleted: sinon.SinonSpy
    let recordCore: RecordCore
    let options: Options
    let services: any

    beforeEach(() => {
        whenCompleted = spy()
        services = getServicesMock()
        options = Object.assign({}, DefaultOptions, { discardTimout: 20 })

        services.connectionMock
            .expects('sendMessage')
            .never()

        services.connection.isConnected = false
        recordCore = new RecordCore(name, services, options, whenCompleted)
        services.storageMock.restore()
    })

    afterEach(() => {
        services.verify()
    })

    it('attempts to read from storage if offline', () => {
        services.storageMock
            .expects('get')
            .withExactArgs(name, match.func)

        recordCore = new RecordCore(name, services, options, whenCompleted)
    })

    it('doesn`t set updates before ready', () => {
        services.storageMock
            .expects('set')
            .never()

        recordCore.set({ data: { firstname: 'Wolfram' } })
    })

    it('doesn`t send patches before ready', () => {
        services.storageMock
            .expects('set')
            .never()

        recordCore.set({ path: 'firstname', data: 'Wolfram' })
    })

    it('triggers ready callback on read response', () => {
        const readySpy = spy()
        recordCore.whenReady(this, readySpy)

        assert.calledOnce(readySpy)
        assert.calledWithExactly(readySpy, this)
    })

    it('sets update messages for updates after when ready', () => {
        recordCore.handle(READ_RESPONSE)

        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' })

        recordCore.set({ data: { firstname: 'Bob' } })
    })

    it('sends patch messages for path changes after when ready', () => {
        recordCore.handle(READ_RESPONSE)

        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' })

        recordCore.set({ path: 'firstname', data: 'Bob' })
    })

    it('responds to update write acks with an offline error', () => {
        recordCore.handle(READ_RESPONSE)

        const ackCallback = spy()

        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' })

        recordCore.set({ data: { firstname: 'Bob' }, callback: ackCallback })

        assert.calledOnce(ackCallback)
        assert.calledWithExactly(ackCallback, EVENT.CLIENT_OFFLINE)
    })

    it('sends patch messages for path changes after when ready', () => {
        recordCore.handle(READ_RESPONSE)

        const ackCallback = spy()

        services.storageMock
                    .expects('set')
                    .once()
                    .withExactArgs(name, 2, { firstname: 'Bob' })

        recordCore.set({ path: 'firstname', data: 'Bob', callback: ackCallback })

        assert.calledOnce(ackCallback)
        assert.calledWithExactly(ackCallback, EVENT.CLIENT_OFFLINE)
    })

    it('sends erase messages for erase after when ready', () => {
        recordCore.handle(READ_RESPONSE)

        const ackCallback = spy()

        services.storageMock
        .expects('set')
        .once()
        .withExactArgs(name, 2, {})

        recordCore.set({ path: 'firstname' })
    })

    it('sends erase write ack messages for erase after when ready', () => {
        const ackCallback = spy()
        recordCore.handle(READ_RESPONSE)

        services.storageMock
        .expects('set')
        .once()
        .withExactArgs(name, 2, {})

        recordCore.set({ path: 'firstname', callback: ackCallback })

        assert.calledOnce(ackCallback)
        assert.calledWithExactly(ackCallback, EVENT.CLIENT_OFFLINE)
    })

    it('queues discarding record when no longer needed', () => {
        recordCore.handle(READ_RESPONSE)
        recordCore.discard()

        expect(recordCore.recordState).to.equal(RECORD_STATE.UNSUBSCRIBING)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.true
    })

    it('removes pending discard when usages increases', async () => {
        recordCore.handle(READ_RESPONSE)
        recordCore.discard()
        recordCore.usages++

        await BBPromise.delay(30)

        expect(recordCore.recordState).to.equal(RECORD_STATE.READY)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.true
    })

    it('removes record when completed', async () => {
        recordCore.handle(READ_RESPONSE)
        recordCore.discard()

        await BBPromise.delay(30)

        expect(recordCore.recordState).to.equal(RECORD_STATE.UNSUBSCRIBED)

        assert.calledOnce(whenCompleted)
        assert.calledWithExactly(whenCompleted, name)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.false
    })

    it('sends delete when ready', async () => {
        recordCore.handle(READ_RESPONSE)

        services.storageMock
        .expects('delete')
        .once()
        .withExactArgs(name)

        recordCore.delete()

        expect(recordCore.recordState).to.equal(RECORD_STATE.DELETING)

        assert.notCalled(whenCompleted)

        // tslint:disable-next-line:no-unused-expression
        expect(recordCore.isReady).to.be.true
    })

    it('calls delete when delete is confirmed', async () => {
        recordCore.handle(READ_RESPONSE)

        services.storageMock
        .expects('delete')
        .once()

        recordCore.delete()

        // deleted

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
