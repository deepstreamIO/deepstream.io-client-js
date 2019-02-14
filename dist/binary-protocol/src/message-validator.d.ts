import { TOPIC, ALL_ACTIONS, META_KEYS as M } from './message-constants';
export declare const META_PARAMS_SPEC: {
    [topic: number]: {
        [action: number]: [Array<M>, Array<M>];
    };
};
export declare const hasPayload: (topic: TOPIC, action: ALL_ACTIONS) => boolean;
export declare function validateUnkownMeta(topic: TOPIC, action: ALL_ACTIONS, meta: {
    [key: string]: any;
}): string | undefined;
export declare function validateMeta(topic: TOPIC, action: ALL_ACTIONS, meta: {
    [key: string]: any;
}): string | undefined;
export declare function hasCorrelationId(topic: TOPIC, action: ALL_ACTIONS): boolean | undefined;
