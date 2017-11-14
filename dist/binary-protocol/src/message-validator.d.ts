import { TOPIC, ALL_ACTIONS, Message } from './message-constants';
export declare const hasCorrelationId: (topic: TOPIC, action: ALL_ACTIONS) => boolean;
export declare const hasAck: (topic: TOPIC, action: ALL_ACTIONS) => boolean;
export declare const hasPayload: (topic: TOPIC, action: ALL_ACTIONS) => boolean;
export declare function validate(message: Message): string | undefined;
