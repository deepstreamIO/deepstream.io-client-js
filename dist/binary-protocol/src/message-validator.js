"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_constants_1 = require("./message-constants");
/*
 * Specification of  fields within Meta Params used for message validation
 * (see `validateMeta`)
 *
 * META_PARAMS_SPEC[topic][action] => [required, optional]
 * The keys in `required` must be present in all instances of the message
 * The keys in `optional` may be present in some instances of the message
 */
exports.META_PARAMS_SPEC = {
    [message_constants_1.TOPIC.PARSER]: {
        [message_constants_1.PARSER_ACTIONS.UNKNOWN_TOPIC]: [[message_constants_1.META_KEYS.originalTopic], []],
        [message_constants_1.PARSER_ACTIONS.UNKNOWN_ACTION]: [[message_constants_1.META_KEYS.originalTopic, message_constants_1.META_KEYS.originalAction], []],
        [message_constants_1.PARSER_ACTIONS.INVALID_MESSAGE]: [[], []],
        [message_constants_1.PARSER_ACTIONS.INVALID_META_PARAMS]: [[message_constants_1.META_KEYS.originalTopic, message_constants_1.META_KEYS.originalAction], []],
    },
    [message_constants_1.TOPIC.CONNECTION]: {
        [message_constants_1.CONNECTION_ACTIONS.PING]: [[], []],
        [message_constants_1.CONNECTION_ACTIONS.PONG]: [[], []],
        [message_constants_1.CONNECTION_ACTIONS.CHALLENGE]: [[message_constants_1.META_KEYS.url, message_constants_1.META_KEYS.protocolVersion], []],
        [message_constants_1.CONNECTION_ACTIONS.ACCEPT]: [[], []],
        [message_constants_1.CONNECTION_ACTIONS.REJECT]: [[], []],
        [message_constants_1.CONNECTION_ACTIONS.REDIRECT]: [[message_constants_1.META_KEYS.url], []],
        [message_constants_1.CONNECTION_ACTIONS.CLOSING]: [[], []],
        [message_constants_1.CONNECTION_ACTIONS.CLOSED]: [[], []],
        [message_constants_1.CONNECTION_ACTIONS.ERROR]: [[], []],
        [message_constants_1.CONNECTION_ACTIONS.AUTHENTICATION_TIMEOUT]: [[], []],
        [message_constants_1.CONNECTION_ACTIONS.INVALID_MESSAGE]: [[message_constants_1.META_KEYS.originalTopic, message_constants_1.META_KEYS.originalAction], []],
    },
    [message_constants_1.TOPIC.AUTH]: {
        [message_constants_1.AUTH_ACTIONS.REQUEST]: [[], []],
        [message_constants_1.AUTH_ACTIONS.AUTH_SUCCESSFUL]: [[], []],
        [message_constants_1.AUTH_ACTIONS.AUTH_UNSUCCESSFUL]: [[], []],
        [message_constants_1.AUTH_ACTIONS.TOO_MANY_AUTH_ATTEMPTS]: [[], []],
        [message_constants_1.AUTH_ACTIONS.INVALID_MESSAGE]: [[message_constants_1.META_KEYS.originalTopic, message_constants_1.META_KEYS.originalAction], []],
        [message_constants_1.AUTH_ACTIONS.INVALID_MESSAGE_DATA]: [[message_constants_1.META_KEYS.originalAction], []],
    },
    [message_constants_1.TOPIC.RECORD]: {
        [message_constants_1.RECORD_ACTIONS.SUBSCRIBE]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.SUBSCRIBE_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.MULTIPLE_SUBSCRIPTIONS]: [[message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.originalAction]],
        [message_constants_1.RECORD_ACTIONS.NOT_SUBSCRIBED]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.HEAD]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.SUBSCRIBEANDHEAD]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.HEAD_RESPONSE]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []],
        [message_constants_1.RECORD_ACTIONS.READ]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.SUBSCRIBEANDREAD]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.READ_RESPONSE]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []],
        [message_constants_1.RECORD_ACTIONS.UPDATE]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []],
        [message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RECORD_ACTIONS.PATCH]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path], []],
        [message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RECORD_ACTIONS.ERASE]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path], []],
        [message_constants_1.RECORD_ACTIONS.ERASE_WITH_WRITE_ACK]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []],
        [message_constants_1.RECORD_ACTIONS.SUBSCRIBECREATEANDUPDATE]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], []],
        [message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RECORD_ACTIONS.CREATEANDPATCH]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path], []],
        [message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version, message_constants_1.META_KEYS.path, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RECORD_ACTIONS.DELETE]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.DELETE_SUCCESS]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.DELETED]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.SUBSCRIBECREATEANDREAD]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_PROVIDER]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_HAS_NO_PROVIDER]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RECORD_ACTIONS.VERSION_EXISTS]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.version], [message_constants_1.META_KEYS.originalAction]],
        [message_constants_1.RECORD_ACTIONS.CACHE_RETRIEVAL_TIMEOUT]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.STORAGE_RETRIEVAL_TIMEOUT]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.RECORD_LOAD_ERROR]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.RECORD_CREATE_ERROR]: [[message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.originalAction]],
        [message_constants_1.RECORD_ACTIONS.RECORD_UPDATE_ERROR]: [[message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.originalAction]],
        [message_constants_1.RECORD_ACTIONS.RECORD_DELETE_ERROR]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.RECORD_NOT_FOUND]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction], []],
        [message_constants_1.RECORD_ACTIONS.INVALID_VERSION]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.correlationId]],
        [message_constants_1.RECORD_ACTIONS.INVALID_PATCH_ON_HOTPATH]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.correlationId]],
        [message_constants_1.RECORD_ACTIONS.LISTEN]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.LISTEN_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.UNLISTEN]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.UNLISTEN_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []],
        [message_constants_1.RECORD_ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []],
        [message_constants_1.RECORD_ACTIONS.LISTEN_ACCEPT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []],
        [message_constants_1.RECORD_ACTIONS.LISTEN_REJECT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []],
        [message_constants_1.RECORD_ACTIONS.INVALID_LISTEN_REGEX]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RECORD_ACTIONS.MESSAGE_PERMISSION_ERROR]: [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId]],
        [message_constants_1.RECORD_ACTIONS.MESSAGE_DENIED]: [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId]],
        [message_constants_1.RECORD_ACTIONS.INVALID_MESSAGE_DATA]: [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId]],
    },
    [message_constants_1.TOPIC.RPC]: {
        [message_constants_1.RPC_ACTIONS.REQUEST_ERROR]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], [message_constants_1.META_KEYS.reason]],
        [message_constants_1.RPC_ACTIONS.REQUEST]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], [message_constants_1.META_KEYS.requestorName, message_constants_1.META_KEYS.requestorData, message_constants_1.META_KEYS.trustedSender]],
        [message_constants_1.RPC_ACTIONS.ACCEPT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.REJECT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.RESPONSE]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.PROVIDE]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RPC_ACTIONS.PROVIDE_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RPC_ACTIONS.UNPROVIDE]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RPC_ACTIONS.UNPROVIDE_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.RPC_ACTIONS.MULTIPLE_PROVIDERS]: [[message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.NOT_PROVIDED]: [[message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.MULTIPLE_RESPONSE]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.RESPONSE_TIMEOUT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.INVALID_RPC_CORRELATION_ID]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.originalAction], []],
        [message_constants_1.RPC_ACTIONS.MULTIPLE_ACCEPT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.ACCEPT_TIMEOUT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.NO_RPC_PROVIDER]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.RPC_ACTIONS.MESSAGE_PERMISSION_ERROR]: [[message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId]],
        [message_constants_1.RPC_ACTIONS.MESSAGE_DENIED]: [[message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId]],
        [message_constants_1.RPC_ACTIONS.INVALID_MESSAGE_DATA]: [[message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.correlationId]],
    },
    [message_constants_1.TOPIC.EVENT]: {
        [message_constants_1.EVENT_ACTIONS.EMIT]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.SUBSCRIBE]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.SUBSCRIBE_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.UNSUBSCRIBE]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.UNSUBSCRIBE_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.MULTIPLE_SUBSCRIPTIONS]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.NOT_SUBSCRIBED]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.MESSAGE_PERMISSION_ERROR]: [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.MESSAGE_DENIED]: [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.LISTEN]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.LISTEN_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.UNLISTEN]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.UNLISTEN_ACK]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []],
        [message_constants_1.EVENT_ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []],
        [message_constants_1.EVENT_ACTIONS.LISTEN_ACCEPT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []],
        [message_constants_1.EVENT_ACTIONS.LISTEN_REJECT]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.subscription], []],
        [message_constants_1.EVENT_ACTIONS.INVALID_LISTEN_REGEX]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.MESSAGE_PERMISSION_ERROR]: [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.MESSAGE_DENIED]: [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], []],
        [message_constants_1.EVENT_ACTIONS.INVALID_MESSAGE_DATA]: [[message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction], []],
    },
    [message_constants_1.TOPIC.PRESENCE]: {
        [message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE]: [[message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.names], []],
        [message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ACK]: [[message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ALL]: [[], []],
        [message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ALL_ACK]: [[], []],
        [message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE]: [[message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.names], []],
        [message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ACK]: [[message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ALL]: [[message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ALL_ACK]: [[message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.PRESENCE_ACTIONS.NOT_SUBSCRIBED]: [[], [message_constants_1.META_KEYS.correlationId]],
        [message_constants_1.PRESENCE_ACTIONS.MULTIPLE_SUBSCRIPTIONS]: [[], [message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.name, message_constants_1.META_KEYS.originalAction]],
        [message_constants_1.PRESENCE_ACTIONS.QUERY]: [[message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.names], []],
        [message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE]: [[message_constants_1.META_KEYS.correlationId], []],
        [message_constants_1.PRESENCE_ACTIONS.QUERY_ALL]: [[], []],
        [message_constants_1.PRESENCE_ACTIONS.QUERY_ALL_RESPONSE]: [[message_constants_1.META_KEYS.names], []],
        [message_constants_1.PRESENCE_ACTIONS.PRESENCE_JOIN]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.PRESENCE_ACTIONS.PRESENCE_LEAVE]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.PRESENCE_ACTIONS.PRESENCE_JOIN_ALL]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.PRESENCE_ACTIONS.PRESENCE_LEAVE_ALL]: [[message_constants_1.META_KEYS.name], []],
        [message_constants_1.PRESENCE_ACTIONS.INVALID_PRESENCE_USERS]: [[], []],
        [message_constants_1.PRESENCE_ACTIONS.MESSAGE_PERMISSION_ERROR]: [[message_constants_1.META_KEYS.originalAction, message_constants_1.META_KEYS.name], [message_constants_1.META_KEYS.correlationId]],
        [message_constants_1.PRESENCE_ACTIONS.MESSAGE_DENIED]: [[message_constants_1.META_KEYS.originalAction], [message_constants_1.META_KEYS.correlationId, message_constants_1.META_KEYS.name]],
    },
    [message_constants_1.TOPIC.CLUSTER]: {
        [message_constants_1.CLUSTER_ACTIONS.CLOSE]: [[], []],
        [message_constants_1.CLUSTER_ACTIONS.IDENTIFICATION_REQUEST]: [[], []],
        [message_constants_1.CLUSTER_ACTIONS.IDENTIFICATION_RESPONSE]: [[], []],
        [message_constants_1.CLUSTER_ACTIONS.KNOWN_PEERS]: [[], []],
        [message_constants_1.CLUSTER_ACTIONS.PING]: [[], []],
        [message_constants_1.CLUSTER_ACTIONS.PONG]: [[], []],
        [message_constants_1.CLUSTER_ACTIONS.REJECT]: [[], []],
        [message_constants_1.CLUSTER_ACTIONS.REJECT_DUPLICATE]: [[], []]
    },
    [message_constants_1.TOPIC.STATE_REGISTRY]: {
        [message_constants_1.STATE_ACTIONS.ERROR]: [[message_constants_1.META_KEYS.registryTopic], []],
        [message_constants_1.STATE_ACTIONS.ADD]: [[message_constants_1.META_KEYS.registryTopic], []],
        [message_constants_1.STATE_ACTIONS.REMOVE]: [[message_constants_1.META_KEYS.registryTopic], []],
        [message_constants_1.STATE_ACTIONS.REQUEST_FULL_STATE]: [[message_constants_1.META_KEYS.registryTopic], []],
        [message_constants_1.STATE_ACTIONS.FULL_STATE]: [[message_constants_1.META_KEYS.registryTopic], []]
    },
    [message_constants_1.TOPIC.LOCK]: {}
};
const payloadMap = {
    [message_constants_1.TOPIC.PARSER]: [
        message_constants_1.PARSER_ACTIONS.MESSAGE_PARSE_ERROR,
        message_constants_1.PARSER_ACTIONS.INVALID_META_PARAMS,
    ],
    [message_constants_1.TOPIC.AUTH]: [
        message_constants_1.AUTH_ACTIONS.REQUEST,
        message_constants_1.AUTH_ACTIONS.AUTH_SUCCESSFUL,
        message_constants_1.AUTH_ACTIONS.AUTH_UNSUCCESSFUL,
    ],
    [message_constants_1.TOPIC.RECORD]: [
        message_constants_1.RECORD_ACTIONS.READ_RESPONSE,
        message_constants_1.RECORD_ACTIONS.UPDATE,
        message_constants_1.RECORD_ACTIONS.UPDATE_WITH_WRITE_ACK,
        message_constants_1.RECORD_ACTIONS.PATCH,
        message_constants_1.RECORD_ACTIONS.PATCH_WITH_WRITE_ACK,
        message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE,
        message_constants_1.RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK,
        message_constants_1.RECORD_ACTIONS.CREATEANDPATCH,
        message_constants_1.RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK,
        message_constants_1.RECORD_ACTIONS.VERSION_EXISTS,
    ],
    [message_constants_1.TOPIC.RPC]: [
        message_constants_1.RPC_ACTIONS.REQUEST,
        message_constants_1.RPC_ACTIONS.RESPONSE,
        message_constants_1.RPC_ACTIONS.REQUEST_ERROR
    ],
    [message_constants_1.TOPIC.EVENT]: [
        message_constants_1.EVENT_ACTIONS.EMIT,
    ],
    [message_constants_1.TOPIC.PRESENCE]: [
        message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE,
    ],
    [message_constants_1.TOPIC.CLUSTER]: [
        message_constants_1.CLUSTER_ACTIONS.IDENTIFICATION_REQUEST,
        message_constants_1.CLUSTER_ACTIONS.IDENTIFICATION_RESPONSE,
        message_constants_1.CLUSTER_ACTIONS.KNOWN_PEERS
    ],
    [message_constants_1.TOPIC.STATE_REGISTRY]: [
        message_constants_1.STATE_ACTIONS.FULL_STATE
    ],
    [message_constants_1.TOPIC.LOCK]: []
};
function mapOfArraysHas(map, topic, action) {
    const actions = map[topic];
    if (!actions) {
        return false;
    }
    return actions.indexOf(action) !== -1;
}
exports.hasPayload = (topic, action) => mapOfArraysHas(payloadMap, topic, action);
function validateUnkownMeta(topic, action, meta) {
    const spec = exports.META_PARAMS_SPEC[topic][action];
    if (!spec) {
        return 'no meta spec';
    }
    const [required, optional] = spec;
    for (const key in meta) {
        if (meta[key] !== undefined
            && required.indexOf(key) === -1
            && optional.indexOf(key) === -1) {
            return `meta object has unknown key ${key}`;
        }
    }
    return;
}
exports.validateUnkownMeta = validateUnkownMeta;
function validateMeta(topic, action, meta) {
    const spec = exports.META_PARAMS_SPEC[topic][action];
    if (!spec) {
        return 'no meta spec';
    }
    const [required,] = spec;
    for (const req of required) {
        if (meta[req] === undefined) {
            return `meta object does not have required key ${req}`;
        }
    }
    return;
}
exports.validateMeta = validateMeta;
function hasCorrelationId(topic, action) {
    const spec = exports.META_PARAMS_SPEC[topic][action];
    if (!spec) {
        return;
    }
    const [required, optional] = spec;
    return (required.indexOf(message_constants_1.META_KEYS.correlationId) !== -1) || (optional.indexOf(message_constants_1.META_KEYS.correlationId) !== -1);
}
exports.hasCorrelationId = hasCorrelationId;
//# sourceMappingURL=message-validator.js.map