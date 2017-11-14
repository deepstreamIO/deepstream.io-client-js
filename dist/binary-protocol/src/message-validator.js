"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_constants_1 = require("./message-constants");
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
        message_constants_1.RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT,
        message_constants_1.RECORD_ACTIONS.VERSION_EXISTS,
    ],
    [message_constants_1.TOPIC.RPC]: [
        message_constants_1.RPC_ACTIONS.REQUEST,
        message_constants_1.RPC_ACTIONS.RESPONSE,
    ],
    [message_constants_1.TOPIC.EVENT]: [
        message_constants_1.EVENT_ACTIONS.EMIT,
    ],
    [message_constants_1.TOPIC.PRESENCE]: [
        message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE,
        message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE,
        message_constants_1.PRESENCE_ACTIONS.QUERY,
        message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE,
        message_constants_1.PRESENCE_ACTIONS.QUERY_ALL_RESPONSE,
    ]
};
const corrIdMap = {
    [message_constants_1.TOPIC.RPC]: [
        message_constants_1.RPC_ACTIONS.REQUEST,
        message_constants_1.RPC_ACTIONS.REQUEST_ERROR,
        message_constants_1.RPC_ACTIONS.ACCEPT,
        message_constants_1.RPC_ACTIONS.REJECT,
        message_constants_1.RPC_ACTIONS.RESPONSE,
        message_constants_1.RPC_ACTIONS.MULTIPLE_RESPONSE,
        message_constants_1.RPC_ACTIONS.RESPONSE_TIMEOUT,
        message_constants_1.RPC_ACTIONS.INVALID_RPC_CORRELATION_ID,
        message_constants_1.RPC_ACTIONS.MULTIPLE_ACCEPT,
        message_constants_1.RPC_ACTIONS.ACCEPT_TIMEOUT,
        message_constants_1.RPC_ACTIONS.NO_RPC_PROVIDER,
        message_constants_1.RPC_ACTIONS.MESSAGE_PERMISSION_ERROR,
        message_constants_1.RPC_ACTIONS.MESSAGE_DENIED,
        message_constants_1.RPC_ACTIONS.INVALID_MESSAGE_DATA,
        message_constants_1.RPC_ACTIONS.MULTIPLE_PROVIDERS,
        message_constants_1.RPC_ACTIONS.NOT_PROVIDED,
    ],
    [message_constants_1.TOPIC.PRESENCE]: [
        message_constants_1.PRESENCE_ACTIONS.QUERY,
        message_constants_1.PRESENCE_ACTIONS.QUERY_RESPONSE,
        message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE,
        message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ACK,
        message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE,
        message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ACK,
    ]
};
const ackMap = {
    [message_constants_1.TOPIC.EVENT]: [
        message_constants_1.EVENT_ACTIONS.SUBSCRIBE,
        message_constants_1.EVENT_ACTIONS.UNSUBSCRIBE,
        message_constants_1.EVENT_ACTIONS.LISTEN,
        message_constants_1.EVENT_ACTIONS.UNLISTEN,
    ],
    [message_constants_1.TOPIC.RECORD]: [
        message_constants_1.RECORD_ACTIONS.SUBSCRIBE,
        message_constants_1.RECORD_ACTIONS.UNSUBSCRIBE,
        message_constants_1.RECORD_ACTIONS.LISTEN,
        message_constants_1.RECORD_ACTIONS.UNLISTEN,
        message_constants_1.RECORD_ACTIONS.DELETE,
    ],
    [message_constants_1.TOPIC.PRESENCE]: [
        message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE,
        message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE,
        message_constants_1.PRESENCE_ACTIONS.SUBSCRIBE_ALL,
        message_constants_1.PRESENCE_ACTIONS.UNSUBSCRIBE_ALL,
    ],
    [message_constants_1.TOPIC.RPC]: [
        message_constants_1.RPC_ACTIONS.PROVIDE,
        message_constants_1.RPC_ACTIONS.UNPROVIDE,
    ],
};
function mapOfArraysHas(map, topic, action) {
    const actions = map[topic];
    if (!actions) {
        return false;
    }
    return actions.indexOf(action) !== -1;
}
exports.hasCorrelationId = (topic, action) => mapOfArraysHas(corrIdMap, topic, action);
exports.hasAck = (topic, action) => mapOfArraysHas(ackMap, topic, action);
exports.hasPayload = (topic, action) => mapOfArraysHas(payloadMap, topic, action);
function validate(message) {
    let action = message.action;
    if (message.isAck) {
        if (!exports.hasAck(message.topic, message.action)) {
            return 'should not have an ack';
        }
        action = message.action + 0x80;
    }
    /* errors e.g. MESSAGE_DENIED have might have different params dependent on the parameters of the
     * original message
     */
    if (action >= 0x60 && action < 0x70) {
        return;
    }
    const shouldHaveCorrelationId = exports.hasCorrelationId(message.topic, action);
    if (!!message.correlationId !== shouldHaveCorrelationId) {
        return `should ${shouldHaveCorrelationId ? '' : 'not '}have a correlationId`;
    }
    return;
}
exports.validate = validate;
//# sourceMappingURL=message-validator.js.map