"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocks_1 = require("../mocks");
const message_constants_1 = require("../../binary-protocol/src/message-constants");
const client_options_1 = require("../../src/client-options");
const record_handler_1 = require("../../src/record/record-handler");
describe.skip('record setData online', () => {
    let recordHandler;
    let options;
    let services;
    let name;
    beforeEach(() => {
        services = mocks_1.getServicesMock();
        options = Object.assign({}, client_options_1.DefaultOptions);
        name = 'testRecord';
        services.connection.isConnected = true;
        recordHandler = new record_handler_1.RecordHandler(services, options);
    });
    afterEach(() => {
        services.verify();
    });
    it('sends update messages for entire data changes', () => {
        const data = { firstname: 'Wolfram' };
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: message_constants_1.TOPIC.RECORD,
            action: message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE,
            name,
            parsedData: data,
            version: -1
        });
        recordHandler.setData(name, data);
    });
    it('sends update messages for path changes ', () => {
        const path = 'lastName';
        const data = 'Hempel';
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: message_constants_1.TOPIC.RECORD,
            action: message_constants_1.RECORD_ACTIONS.CREATEANDPATCH,
            name,
            path,
            parsedData: data,
            version: -1
        });
        recordHandler.setData(name, path, data);
    });
    it('deletes value when sending undefined', () => {
        const path = 'lastName';
        const data = undefined;
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: message_constants_1.TOPIC.RECORD,
            action: message_constants_1.RECORD_ACTIONS.ERASE,
            name,
            path,
            version: -1
        });
        recordHandler.setData(name, path, data);
    });
    it('throws error for invalid arguments', () => {
        chai_1.expect(recordHandler.setData.bind(recordHandler)).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name)).to.throw();
        const data = { some: 'data' };
        chai_1.expect(recordHandler.setData.bind(recordHandler, undefined, data)).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, null, data)).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, 123, data)).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, {}, data)).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name, undefined)).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name, undefined, () => { })).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name, null)).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name, null, () => { })).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name, '', 'data')).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name, 'Some String')).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name, 100.24)).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name, {}, { not: 'func' })).to.throw();
        chai_1.expect(recordHandler.setData.bind(recordHandler, name, 'path', 'val', { not: 'func' })).to.throw();
    });
    it('sends update messages for entire data changes with callback', () => {
        const data = { firstname: 'Wolfram' };
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: message_constants_1.TOPIC.RECORD,
            action: message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK,
            name,
            parsedData: data,
            version: -1
        });
        recordHandler.setData(name, data, () => { });
    });
    it('sends update messages for path changes with callback', () => {
        const path = 'lastName';
        const data = 'Hempel';
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: message_constants_1.TOPIC.RECORD,
            action: message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK,
            name,
            path,
            parsedData: data,
            version: -1
        });
        recordHandler.setData(name, path, data, () => { });
    });
    describe('with ack', () => {
    });
});
//# sourceMappingURL=record-setData-onlineSpec.js.map