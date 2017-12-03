"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disabke:no-unused-expression
const BBPromise = require("bluebird");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const mocks_1 = require("../mocks");
const constants_1 = require("../../src/constants");
const client_options_1 = require("../../src/client-options");
const record_core_1 = require("../../src/record/record-core");
describe('record core offline', () => {
    let whenCompleted;
    let recordCore;
    let options;
    let services;
    let recordServices;
    beforeEach(() => {
        whenCompleted = sinon_1.spy();
        services = mocks_1.getServicesMock();
        recordServices = mocks_1.getRecordServices(services);
        options = Object.assign({}, client_options_1.DefaultOptions, { discardTimeout: 20 });
        services.connectionMock
            .expects('sendMessage')
            .never();
        services.storageMock
            .expects('get')
            .once()
            .callsArgWith(1, name, 1, { firstname: 'wolfram' });
        services.connection.isConnected = false;
        recordCore = new record_core_1.RecordCore(name, services, options, recordServices, whenCompleted);
    });
    afterEach(() => {
        services.verify();
        recordServices.verify();
    });
    it('triggers ready callback on load', () => {
        const readySpy = sinon_1.spy();
        recordCore.whenReady(null, readySpy);
        sinon_1.assert.calledOnce(readySpy);
        sinon_1.assert.calledWithExactly(readySpy, null);
    });
    it('sets update messages for updates after when ready', () => {
        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' }, sinon_1.match.func);
        recordCore.set({ data: { firstname: 'Bob' } });
    });
    it('sends patch messages for path changes after when ready', () => {
        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' }, sinon_1.match.func);
        recordCore.set({ path: 'firstname', data: 'Bob' });
    });
    it('responds to update write acks with an offline error', () => __awaiter(this, void 0, void 0, function* () {
        const ackCallback = sinon_1.spy();
        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' }, sinon_1.match.func);
        recordCore.set({ data: { firstname: 'Bob' }, callback: ackCallback });
        yield BBPromise.delay(0);
        sinon_1.assert.calledOnce(ackCallback);
        sinon_1.assert.calledWithExactly(ackCallback, constants_1.EVENT.CLIENT_OFFLINE, name);
    }));
    it('sends patch messages for path changes after when ready', () => __awaiter(this, void 0, void 0, function* () {
        const ackCallback = sinon_1.spy();
        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, { firstname: 'Bob' }, sinon_1.match.func);
        recordCore.set({ path: 'firstname', data: 'Bob', callback: ackCallback });
        yield BBPromise.delay(0);
        sinon_1.assert.calledOnce(ackCallback);
        sinon_1.assert.calledWithExactly(ackCallback, constants_1.EVENT.CLIENT_OFFLINE, name);
    }));
    it('sends erase messages for erase after when ready', () => {
        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, {}, sinon_1.match.func);
        recordCore.set({ path: 'firstname' });
    });
    it('sends erase write ack messages for erase after when ready', () => __awaiter(this, void 0, void 0, function* () {
        const ackCallback = sinon_1.spy();
        services.storageMock
            .expects('set')
            .once()
            .withExactArgs(name, 2, {}, sinon_1.match.func);
        recordCore.set({ path: 'firstname', callback: ackCallback });
        yield BBPromise.delay(0);
        sinon_1.assert.calledOnce(ackCallback);
        sinon_1.assert.calledWithExactly(ackCallback, constants_1.EVENT.CLIENT_OFFLINE, name);
    }));
    it('queues discarding record when no longer needed', () => {
        recordCore.discard();
        chai_1.expect(recordCore.recordState).to.equal(6 /* UNSUBSCRIBING */);
        // tslint:disable-next-line:no-unused-expression
        chai_1.expect(recordCore.isReady).to.be.true;
    });
    it('removes pending discard when usages increases', () => __awaiter(this, void 0, void 0, function* () {
        recordCore.discard();
        recordCore.usages++;
        yield BBPromise.delay(30);
        chai_1.expect(recordCore.recordState).to.equal(4 /* READY */);
        // tslint:disable-next-line:no-unused-expression
        chai_1.expect(recordCore.isReady).to.be.true;
    }));
    it('removes record when completed', () => __awaiter(this, void 0, void 0, function* () {
        recordCore.discard();
        yield BBPromise.delay(30);
        chai_1.expect(recordCore.recordState).to.equal(7 /* UNSUBSCRIBED */);
        sinon_1.assert.calledOnce(whenCompleted);
        sinon_1.assert.calledWithExactly(whenCompleted, name);
        // tslint:disable-next-line:no-unused-expression
        chai_1.expect(recordCore.isReady).to.be.false;
    }));
    it.skip('sends delete when ready', () => __awaiter(this, void 0, void 0, function* () {
        services.storageMock
            .expects('delete')
            .once()
            .withExactArgs(name, sinon_1.match.func);
        recordCore.delete();
        chai_1.expect(recordCore.recordState).to.equal(8 /* DELETING */);
        sinon_1.assert.notCalled(whenCompleted);
        // tslint:disable-next-line:no-unused-expression
        chai_1.expect(recordCore.isReady).to.be.true;
    }));
    it.skip('calls delete when delete is confirmed', () => __awaiter(this, void 0, void 0, function* () {
        services.storageMock
            .expects('delete')
            .once()
            .withExactArgs(name, sinon_1.match.func)
            .callsArgWith(1, name);
        recordCore.delete();
        yield BBPromise.delay(0);
        // deleted
        chai_1.expect(recordCore.recordState).to.equal(9 /* DELETED */);
        sinon_1.assert.calledOnce(whenCompleted);
        sinon_1.assert.calledWithExactly(whenCompleted, name);
        // tslint:disable-next-line:no-unused-expression
        chai_1.expect(recordCore.isReady).to.be.false;
    }));
    const name = 'recordA';
});
//# sourceMappingURL=record-core-offlineSpec.js.map