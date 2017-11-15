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
// tslint:disable:no-unused-expression
const bluebird_1 = require("bluebird");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const mocks_1 = require("../mocks");
const message_constants_1 = require("../../binary-protocol/src/message-constants");
const client_options_1 = require("../../src/client-options");
const record_core_1 = require("../../src/record/record-core");
const list_1 = require("../../src/record/list");
describe('list - online', () => {
    let recordCore;
    let list;
    let options;
    let services;
    let name;
    let changeCallback;
    let readyCallback;
    function makelistReady(entries, version) {
        recordCore.handle({
            name,
            topic: message_constants_1.TOPIC.RECORD,
            action: message_constants_1.RECORD_ACTIONS.READ_RESPONSE,
            parsedData: entries,
            version
        });
    }
    beforeEach(() => {
        services = mocks_1.getServicesMock();
        options = Object.assign({}, client_options_1.DefaultOptions);
        name = 'someList';
        changeCallback = sinon_1.spy();
        readyCallback = sinon_1.spy();
        recordCore = new record_core_1.RecordCore(name, services, options, () => { });
        recordCore.usages++;
        list = new list_1.List(recordCore);
        list.subscribe(changeCallback);
        list.whenReady(readyCallback);
    });
    afterEach(() => {
        services.verify();
    });
    it('creates the list', () => {
        chai_1.expect(mocks_1.getLastMessageSent()).deep.equal({
            topic: message_constants_1.TOPIC.RECORD,
            action: message_constants_1.RECORD_ACTIONS.SUBSCRIBECREATEANDREAD,
            name
        });
        chai_1.expect(list.subscribe.bind(list, 'somePath', changeCallback)).to.throw('path is not supported for List.subscribe');
        chai_1.expect(list.getEntries).not.null;
        sinon_1.assert.notCalled(readyCallback);
    });
    it('starts with an empty array', () => {
        chai_1.expect(list.getEntries()).deep.equal([]);
        chai_1.expect(list.isEmpty()).to.equal(true);
    });
    it('receives a response from the server', () => __awaiter(this, void 0, void 0, function* () {
        const data = ['entryA', 'entryB'];
        recordCore.handle({
            name,
            topic: message_constants_1.TOPIC.RECORD,
            action: message_constants_1.RECORD_ACTIONS.READ_RESPONSE,
            parsedData: data,
            version: 1
        });
        yield bluebird_1.Promise.delay(20);
        chai_1.expect(list.getEntries()).deep.equal(data);
        chai_1.expect(list.isEmpty()).equal(false);
        sinon_1.assert.calledOnce(changeCallback);
        sinon_1.assert.calledWithExactly(changeCallback, data);
        sinon_1.assert.calledOnce(readyCallback);
        sinon_1.assert.calledWithExactly(readyCallback, list);
    }));
    it('handles empty lists', () => {
        makelistReady(['entryA'], 1);
        list.setEntries([]);
        chai_1.expect(list.getEntries()).deep.equal([]);
        chai_1.expect(list.isEmpty()).equal(true);
        list.addEntry('someEntry', 0);
        chai_1.expect(list.getEntries()).deep.equal(['someEntry']);
        chai_1.expect(list.isEmpty()).equal(false);
        list.removeEntry('someEntry', 0);
        chai_1.expect(list.getEntries()).deep.equal([]);
        chai_1.expect(list.isEmpty()).equal(true);
    });
    it('unsubscribes', () => {
        makelistReady([], 1);
        changeCallback.reset();
        list.unsubscribe(changeCallback);
        list.setEntries(['q']);
        sinon_1.assert.notCalled(changeCallback);
    });
    // it('adding entries, methods are queued when record is not ready, correct indexes', () => {
    //   list._record.isReady = false
    //   list.setEntries(['a', 'c', 'e'])
    //   list.addEntry('b', 1)
    //   list.addEntry('d', 3)
    //   expect(list._queuedMethods.length).toEqual(3)
    //   list._record.isReady = true
    //   list._onReady()
    //   expect(list.getEntries()).toEqual(['a', 'b', 'c', 'd', 'e'])
    // })
    // it('removing entries, methods are queued when record is not ready, correct indexes', () => {
    //   list._record.isReady = false
    //   list.setEntries(['b', 'a', 'b', 'c', 'b'])
    //   list.removeEntry('b', 0)
    //   list.removeEntry('b', 3)
    //   expect(list._queuedMethods.length).toEqual(3)
    //   list._record.isReady = true
    //   list._onReady()
    //   expect(list.getEntries()).toEqual(['a', 'b', 'c'])
    // })
    describe.skip('updating existent list', () => {
        let entries;
        beforeEach(() => {
            entries = ['entryA', 'entryB', 'entryC'];
            makelistReady(Object.assign([], entries), 1);
            services.connectionMock
                .expects('sendMessage')
                .once()
                .withExactArgs({
                topic: message_constants_1.TOPIC.RECORD,
                action: message_constants_1.RECORD_ACTIONS.UPDATE,
                name,
                parsedData: entries,
                version: 2
            });
        });
        afterEach(() => {
            chai_1.expect(list.getEntries()).deep.equal(entries);
            sinon_1.assert.calledOnce(changeCallback);
            sinon_1.assert.calledWithExactly(changeCallback, entries);
        });
        it('adds an entry to the end of list', () => {
            const newEntry = 'entryD';
            entries.push(newEntry);
            list.addEntry(newEntry);
        });
        it('removes an entry from the list', () => {
            const removed = 'entryB';
            entries.splice(entries.indexOf(removed), 1);
            list.removeEntry(removed);
        });
        it('adds an entry to the list at a explicit index', () => {
            const newEntry = 'entryD';
            const index = 1;
            entries.splice(index, 0, newEntry);
            list.addEntry(newEntry, index);
        });
        it('removes an entry to the list at a explicit index', () => {
            const index = 1;
            const removed = 'entryB';
            entries.splice(index, 1);
            list.removeEntry(removed, index);
        });
        it('sets the entire list', () => {
            const newEntries = ['u', 'v'];
            entries = newEntries;
            list.setEntries(newEntries);
        });
    });
    describe.skip('server updates', () => {
        let entries;
        let version;
        beforeEach(() => {
            entries = ['entryA', 'entryB', 'entryC'];
            version = 1;
            makelistReady(entries, version);
        });
        afterEach(() => {
            chai_1.expect(list.getEntries()).deep.equal(entries);
            chai_1.expect(list.version).equal(version);
            sinon_1.assert.calledOnce(changeCallback);
            sinon_1.assert.calledWithExactly(changeCallback, entries);
        });
        it('handles server updates', () => {
            const listReceived = ['x', 'y'];
            entries = listReceived;
            version = 7;
            recordCore.handle({
                name,
                topic: message_constants_1.TOPIC.RECORD,
                action: message_constants_1.RECORD_ACTIONS.READ_RESPONSE,
                parsedData: listReceived,
                version
            });
        });
    });
});
//# sourceMappingURL=list-onlineSpec.js.map