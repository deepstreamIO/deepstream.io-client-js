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
const bluebird_1 = require("bluebird");
const sinon_1 = require("sinon");
const mocks_1 = require("../mocks");
const message_constants_1 = require("../../binary-protocol/src/message-constants");
const client_options_1 = require("../../src/client-options");
const offline_queue_1 = require("../../src/util/offline-queue");
describe('offline queue', () => {
    let services;
    let options;
    let queue;
    const message = {
        topic: message_constants_1.TOPIC.PRESENCE,
        action: message_constants_1.PRESENCE_ACTIONS.QUERY_ALL,
    };
    let successSpy;
    let failureSpy;
    beforeEach(() => {
        successSpy = sinon_1.spy();
        failureSpy = sinon_1.spy();
        services = mocks_1.getServicesMock();
        options = Object.assign({}, client_options_1.DefaultOptions, { offlineBufferTimeout: 1 });
        queue = new offline_queue_1.default(options, services);
        services.connection.isConnected = false;
        queue.submit(message, successSpy, failureSpy);
    });
    afterEach(() => {
        services.connectionMock.verify();
        services.timeoutRegistryMock.verify();
    });
    it('submits messages to the queue on reconnection and calls success callback', () => __awaiter(this, void 0, void 0, function* () {
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs(message);
        services.simulateConnectionReestablished();
        yield bluebird_1.Promise.delay(2);
        sinon_1.assert.calledOnce(successSpy);
        sinon_1.assert.notCalled(failureSpy);
    }));
    it('calls timeout if reconnection doesnt happen in time and calls failure callback', () => __awaiter(this, void 0, void 0, function* () {
        services.connectionMock
            .expects('sendMessage')
            .never();
        yield bluebird_1.Promise.delay(10);
        sinon_1.assert.notCalled(successSpy);
        sinon_1.assert.calledOnce(failureSpy);
    }));
});
//# sourceMappingURL=offline-queueSpec.js.map