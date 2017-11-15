import { TOPIC, ALL_ACTIONS } from './message-constants';
export declare const hasPayload: (topic: TOPIC, action: ALL_ACTIONS) => boolean;
export declare function validateMeta(topic: TOPIC, action: ALL_ACTIONS, meta: {
    [key: string]: any;
}): string | undefined;
export declare function hasCorrelationId(topic: TOPIC, action: ALL_ACTIONS): boolean | undefined;
