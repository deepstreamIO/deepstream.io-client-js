"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocks_1 = require("../mocks");
const constants_1 = require("../../src/constants");
const client_options_1 = require("../../src/client-options");
const event_handler_1 = require("../../src/event/event-handler");
// tslint:disable-next-line:no-empty
const noop = () => { };
describe('event handler', () => {
    let services;
    let eventHandler;
    let handle;
    const name = 'myEvent';
    beforeEach(() => {
        services = mocks_1.getServicesMock();
        eventHandler = new event_handler_1.EventHandler(services, client_options_1.DefaultOptions);
        handle = services.getHandle();
    });
    afterEach(() => {
        services.connectionMock.verify();
        services.loggerMock.verify();
        services.timeoutRegistryMock.verify();
    });
    it('emits an event it has no listeners for', () => {
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: constants_1.TOPIC.EVENT,
            action: constants_1.EVENT_ACTION.EMIT,
            name,
            parsedData: 6
        });
        eventHandler.emit(name, 6);
    });
    it('subscribes to an event', () => {
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: constants_1.TOPIC.EVENT,
            action: constants_1.EVENT_ACTION.SUBSCRIBE,
            name
        });
        services.timeoutRegistryMock
            .expects('add')
            .once()
            .withExactArgs({
            message: {
                topic: constants_1.TOPIC.EVENT,
                action: constants_1.EVENT_ACTION.SUBSCRIBE,
                name
            }
        });
        eventHandler.subscribe(name, noop);
    });
    it('subscribes to an event twice', () => {
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: constants_1.TOPIC.EVENT,
            action: constants_1.EVENT_ACTION.SUBSCRIBE,
            name
        });
        services.timeoutRegistryMock
            .expects('add')
            .once()
            .withExactArgs({
            message: {
                topic: constants_1.TOPIC.EVENT,
                action: constants_1.EVENT_ACTION.SUBSCRIBE,
                name
            }
        });
        eventHandler.subscribe(name, noop);
        eventHandler.subscribe(name, noop);
    });
    it('unsubscribes to an event after subscribing', () => {
        services.connectionMock
            .expects('sendMessage')
            .once();
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: constants_1.TOPIC.EVENT,
            action: constants_1.EVENT_ACTION.UNSUBSCRIBE,
            name
        });
        services.timeoutRegistryMock
            .expects('add')
            .once();
        services.timeoutRegistryMock
            .expects('add')
            .once()
            .withExactArgs({
            message: {
                topic: constants_1.TOPIC.EVENT,
                action: constants_1.EVENT_ACTION.UNSUBSCRIBE,
                name
            }
        });
        eventHandler.subscribe(name, noop);
        eventHandler.unsubscribe(name, noop);
    });
    it('unsubscribes to an event after unsubscribing already', () => {
        services.connectionMock
            .expects('sendMessage')
            .once();
        services.connectionMock
            .expects('sendMessage')
            .once()
            .withExactArgs({
            topic: constants_1.TOPIC.EVENT,
            action: constants_1.EVENT_ACTION.UNSUBSCRIBE,
            name
        });
        services.loggerMock
            .expects('warn')
            .once()
            .withExactArgs({
            topic: constants_1.TOPIC.EVENT,
            action: constants_1.EVENT_ACTION.NOT_SUBSCRIBED,
            name
        });
        services.timeoutRegistryMock
            .expects('add')
            .once();
        services.timeoutRegistryMock
            .expects('add')
            .once()
            .withExactArgs({
            message: {
                topic: constants_1.TOPIC.EVENT,
                action: constants_1.EVENT_ACTION.UNSUBSCRIBE,
                name
            }
        });
        eventHandler.subscribe(name, noop);
        eventHandler.unsubscribe(name, noop);
        eventHandler.unsubscribe(name, noop);
    });
    it('logs an error event for unsolicited event messages', () => {
        services.loggerMock
            .expects('error')
            .once()
            .withExactArgs({
            topic: constants_1.TOPIC.EVENT,
            action: -1
        }, constants_1.EVENT.UNSOLICITED_MESSAGE);
        handle({
            topic: constants_1.TOPIC.EVENT,
            action: -1
        });
    });
});
//# sourceMappingURL=eventSpec.js.map