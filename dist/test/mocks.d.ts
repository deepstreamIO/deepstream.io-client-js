/// <reference types="sinon" />
export declare const getServicesMock: () => {
    connection: {
        sendMessage: () => void;
        registerHandler: (topic: any, callback: Function) => void;
    };
    connectionMock: sinon.SinonMock;
    timeoutRegistry: {
        add: () => void;
        remove: () => void;
    };
    timeoutRegistryMock: sinon.SinonMock;
    logger: {
        warn: () => void;
        error: () => void;
    };
    loggerMock: sinon.SinonMock;
    getHandle: () => Function | null;
};
