/// <reference types="sinon" />
import { SinonMock, SinonStub } from 'sinon';
import { TimerRegistry } from '../src/util/timer-registry';
import { Message } from '../binary-protocol/src/message-constants';
import { SingleNotifier } from '../src/record/single-notifier';
export declare const getLastMessageSent: () => Message;
export declare const getServicesMock: () => {
    socketFactory: (url: string, options: object) => any;
    getSocket: () => any;
    connection: {
        sendMessage: (message: Message) => void;
        getConnectionState: SinonStub;
        isConnected: boolean;
        registerHandler: (topic: any, callback: Function) => void;
        onReestablished: (callback: Function) => void;
        onLost: (callback: Function) => void;
    };
    connectionMock: SinonMock;
    timeoutRegistry: {
        add: () => void;
        remove: () => void;
        clear: () => void;
    };
    timeoutRegistryMock: SinonMock;
    logger: {
        warn: () => void;
        error: () => void;
    };
    loggerMock: SinonMock;
    getLogger: () => any;
    timerRegistry: TimerRegistry;
    getHandle: () => Function | null;
    simulateConnectionLost: () => void;
    simulateConnectionReestablished: () => void;
    storage: {
        get: () => void;
        set: () => void;
        delete: () => void;
    };
    storageMock: SinonMock;
    verify: () => void;
};
export declare const getListenerMock: () => {
    listener: {
        listen: () => void;
        unlisten: () => void;
        handle: () => void;
    };
    listenerMock: SinonMock;
};
export declare const getSingleNotifierMock: () => {
    singleNotifier: SingleNotifier;
    singleNotifierMock: SinonMock;
};
