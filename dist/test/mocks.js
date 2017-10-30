"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-empty
const sinon_1 = require("sinon");
exports.getServicesMock = () => {
    let handle = null;
    const connection = {
        sendMessage: () => { },
        registerHandler: (topic, callback) => {
            handle = callback;
        }
    };
    const connectionMock = sinon_1.mock(connection);
    connectionMock.expects('sendMessage').never();
    const timeoutRegistry = {
        add: () => { },
        remove: () => { }
    };
    const timeoutRegistryMock = sinon_1.mock(timeoutRegistry);
    timeoutRegistryMock.expects('add').never();
    timeoutRegistryMock.expects('remove').never();
    const logger = {
        warn: () => { },
        error: () => { }
    };
    const loggerMock = sinon_1.mock(logger);
    loggerMock.expects('warn').never();
    loggerMock.expects('error').never();
    return {
        connection,
        connectionMock,
        timeoutRegistry,
        timeoutRegistryMock,
        logger,
        loggerMock,
        getHandle: () => handle
    };
};
//# sourceMappingURL=mocks.js.map