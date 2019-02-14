import { SinonStub, SinonMock } from 'sinon';
import { TimerRegistry } from '../src/util/timer-registry';
import { Message } from '../binary-protocol/src/message-constants';
import { SingleNotifier } from '../src/record/single-notifier';
import { WriteAcknowledgementService } from '../src/record/write-ack-service';
import { DirtyService } from '../src/record/dirty-service';
export declare const getLastMessageSent: () => Message;
export declare const getServicesMock: () => {
    socketFactory: (url: string, options: object) => any;
    getSocket: () => any;
    connection: {
        sendMessage: (message: Message) => void;
        getConnectionState: SinonStub<any[], any>;
        isConnected: boolean;
        isInLimbo: boolean;
        registerHandler: (topic: any, callback: Function) => void;
        onReestablished: (callback: Function) => void;
        onLost: (callback: Function) => void;
        onExitLimbo: (callback: Function) => void;
        removeOnReestablished: () => void;
        removeOnLost: () => void;
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
    simulateExitLimbo: () => void;
    storage: {
        get: () => void;
        set: () => void;
        delete: () => void;
    };
    storageMock: SinonMock;
    verify: () => void;
};
export declare const getRecordServices: (services: any) => {
    dirtyService: DirtyService;
    dirtyServiceMock: SinonMock;
    headRegistry: SingleNotifier;
    headRegistryMock: SinonMock;
    readRegistry: SingleNotifier;
    readRegistryMock: SinonMock;
    writeAckService: WriteAcknowledgementService;
    writeAckServiceMock: SinonMock;
    verify: () => void;
};
export declare const getListenerMock: () => {
    listener: any;
    listenerMock: SinonMock;
};
