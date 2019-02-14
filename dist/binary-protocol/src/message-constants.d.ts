/// <reference types="node" />
export declare type ALL_ACTIONS = RECORD_ACTIONS | PRESENCE_ACTIONS | RPC_ACTIONS | EVENT_ACTIONS | AUTH_ACTIONS | CONNECTION_ACTIONS | PARSER_ACTIONS | STATE_ACTIONS | CLUSTER_ACTIONS | LOCK_ACTIONS;
export declare enum META_KEYS {
    payloadEncoding = "e",
    name = "n",
    names = "m",
    subscription = "s",
    correlationId = "c",
    version = "v",
    path = "p",
    reason = "r",
    url = "u",
    originalTopic = "t",
    originalAction = "a",
    protocolVersion = "x",
    requestorName = "rn",
    requestorData = "rd",
    trustedSender = "ts",
    registryTopic = "rt"
}
export declare enum PAYLOAD_ENCODING {
    JSON = "j",
    BINARY = "b"
}
export interface Message {
    topic: TOPIC;
    action: ALL_ACTIONS;
    name?: string;
    isError?: boolean;
    isAck?: boolean;
    data?: string | Buffer;
    parsedData?: any;
    payloadEncoding?: PAYLOAD_ENCODING;
    parseError?: false;
    raw?: string | Buffer;
    originalTopic?: TOPIC;
    originalAction?: ALL_ACTIONS;
    subscription?: string;
    names?: Array<string>;
    isWriteAck?: boolean;
    correlationId?: string;
    path?: string;
    version?: number;
    reason?: string;
    url?: string;
    protocolVersion?: string;
}
export interface StateMessage extends Message {
    name: string;
}
export interface SubscriptionMessage extends Message {
    name: string;
}
export interface BulkSubscriptionMessage extends Message {
    names: Array<string>;
}
export interface EventMessage extends SubscriptionMessage {
    action: EVENT_ACTIONS;
}
export interface RPCMessage extends SubscriptionMessage {
    action: RPC_ACTIONS;
    correlationId: string;
}
export interface PresenceMessage extends Message {
    action: PRESENCE_ACTIONS;
    correlationId: string;
}
export interface ListenMessage extends SubscriptionMessage {
    action: RECORD_ACTIONS | EVENT_ACTIONS;
    subscription: string;
    raw?: string;
}
export interface RecordMessage extends SubscriptionMessage {
    action: RECORD_ACTIONS;
}
export interface RecordWriteMessage extends RecordMessage {
    version: number;
    isWriteAck: boolean;
    path?: string;
    name: string;
}
export interface RecordAckMessage extends RecordMessage {
    path?: string;
    data: any;
}
export interface ParseError {
    parseError: boolean;
    action: PARSER_ACTIONS;
    parsedMessage: Message;
    raw?: Buffer;
    description?: string;
}
export declare type ParseResult = Message | ParseError;
export declare enum TOPIC {
    ERROR = 0,
    PARSER = 1,
    CONNECTION = 2,
    AUTH = 3,
    EVENT = 4,
    RECORD = 5,
    RPC = 6,
    PRESENCE = 7,
    SUBSCRIPTIONS = 16,
    ONLINE_USERS = 17,
    EVENT_SUBSCRIPTIONS = 32,
    RECORD_SUBSCRIPTIONS = 33,
    RPC_SUBSCRIPTIONS = 34,
    PRESENCE_SUBSCRIPTIONS = 35,
    RECORD_LISTEN_PATTERNS = 36,
    EVENT_LISTEN_PATTERNS = 37,
    RECORD_PUBLISHED_SUBSCRIPTIONS = 38,
    EVENT_PUBLISHED_SUBSCRIPTIONS = 39,
    RECORD_LISTENING = 40,
    EVENT_LISTENING = 41,
    STATE_REGISTRY = 48,
    CLUSTER = 49,
    LOCK = 50
}
export declare enum PARSER_ACTIONS {
    UNKNOWN_TOPIC = 80,
    UNKNOWN_ACTION = 81,
    INVALID_MESSAGE = 82,
    MESSAGE_PARSE_ERROR = 83,
    MAXIMUM_MESSAGE_SIZE_EXCEEDED = 84,
    ERROR = 85,
    INVALID_META_PARAMS = 86
}
export declare enum CONNECTION_ACTIONS {
    ERROR = 0,
    PING = 1,
    PONG = 2,
    ACCEPT = 3,
    CHALLENGE = 4,
    REJECT = 6,
    REDIRECT = 7,
    CLOSING = 8,
    CLOSED = 9,
    AUTHENTICATION_TIMEOUT = 80,
    INVALID_MESSAGE = 82
}
export declare enum AUTH_ACTIONS {
    ERROR = 0,
    REQUEST = 1,
    AUTH_SUCCESSFUL = 2,
    AUTH_UNSUCCESSFUL = 3,
    TOO_MANY_AUTH_ATTEMPTS = 80,
    INVALID_MESSAGE = 82,
    INVALID_MESSAGE_DATA = 98
}
export declare enum EVENT_ACTIONS {
    ERROR = 0,
    EMIT = 1,
    SUBSCRIBE = 2,
    SUBSCRIBE_ACK = 130,
    UNSUBSCRIBE = 3,
    UNSUBSCRIBE_ACK = 131,
    LISTEN = 4,
    LISTEN_ACK = 132,
    UNLISTEN = 5,
    UNLISTEN_ACK = 133,
    LISTEN_ACCEPT = 6,
    LISTEN_REJECT = 7,
    SUBSCRIPTION_FOR_PATTERN_FOUND = 8,
    SUBSCRIPTION_FOR_PATTERN_REMOVED = 9,
    INVALID_LISTEN_REGEX = 80,
    MESSAGE_PERMISSION_ERROR = 96,
    MESSAGE_DENIED = 97,
    INVALID_MESSAGE_DATA = 98,
    MULTIPLE_SUBSCRIPTIONS = 99,
    NOT_SUBSCRIBED = 100
}
export declare enum RECORD_ACTIONS {
    ERROR = 0,
    READ = 1,
    READ_RESPONSE = 2,
    HEAD = 3,
    HEAD_RESPONSE = 4,
    DELETE = 5,
    DELETE_SUCCESS = 6,
    DELETED = 8,
    WRITE_ACKNOWLEDGEMENT = 9,
    CREATE = 16,
    CREATEANDUPDATE = 17,
    CREATEANDUPDATE_WITH_WRITE_ACK = 18,
    CREATEANDPATCH = 19,
    CREATEANDPATCH_WITH_WRITE_ACK = 20,
    UPDATE = 21,
    UPDATE_WITH_WRITE_ACK = 22,
    PATCH = 23,
    PATCH_WITH_WRITE_ACK = 24,
    ERASE = 25,
    ERASE_WITH_WRITE_ACK = 26,
    SUBSCRIBEANDHEAD = 32,
    SUBSCRIBEANDREAD = 34,
    SUBSCRIBECREATEANDREAD = 36,
    SUBSCRIBECREATEANDUPDATE = 38,
    SUBSCRIBE = 40,
    SUBSCRIBE_ACK = 168,
    UNSUBSCRIBE = 41,
    UNSUBSCRIBE_ACK = 169,
    LISTEN = 48,
    LISTEN_ACK = 176,
    UNLISTEN = 49,
    UNLISTEN_ACK = 177,
    LISTEN_ACCEPT = 50,
    LISTEN_REJECT = 51,
    SUBSCRIPTION_HAS_PROVIDER = 52,
    SUBSCRIPTION_HAS_NO_PROVIDER = 53,
    SUBSCRIPTION_FOR_PATTERN_FOUND = 54,
    SUBSCRIPTION_FOR_PATTERN_REMOVED = 55,
    CACHE_RETRIEVAL_TIMEOUT = 80,
    STORAGE_RETRIEVAL_TIMEOUT = 81,
    VERSION_EXISTS = 82,
    RECORD_LOAD_ERROR = 83,
    RECORD_CREATE_ERROR = 84,
    RECORD_UPDATE_ERROR = 85,
    RECORD_DELETE_ERROR = 86,
    RECORD_NOT_FOUND = 88,
    INVALID_VERSION = 89,
    INVALID_PATCH_ON_HOTPATH = 90,
    INVALID_LISTEN_REGEX = 91,
    MESSAGE_PERMISSION_ERROR = 96,
    MESSAGE_DENIED = 97,
    INVALID_MESSAGE_DATA = 98,
    MULTIPLE_SUBSCRIPTIONS = 99,
    NOT_SUBSCRIBED = 100
}
export declare enum RPC_ACTIONS {
    ERROR = 0,
    REQUEST = 1,
    ACCEPT = 2,
    RESPONSE = 3,
    REJECT = 4,
    REQUEST_ERROR = 5,
    PROVIDE = 6,
    PROVIDE_ACK = 134,
    UNPROVIDE = 7,
    UNPROVIDE_ACK = 135,
    NO_RPC_PROVIDER = 80,
    ACCEPT_TIMEOUT = 82,
    MULTIPLE_ACCEPT = 83,
    INVALID_RPC_CORRELATION_ID = 84,
    RESPONSE_TIMEOUT = 85,
    MULTIPLE_RESPONSE = 86,
    MESSAGE_PERMISSION_ERROR = 96,
    MESSAGE_DENIED = 97,
    INVALID_MESSAGE_DATA = 98,
    MULTIPLE_PROVIDERS = 99,
    NOT_PROVIDED = 100
}
export declare enum PRESENCE_ACTIONS {
    ERROR = 0,
    QUERY_ALL = 1,
    QUERY_ALL_RESPONSE = 2,
    QUERY = 3,
    QUERY_RESPONSE = 4,
    PRESENCE_JOIN = 5,
    PRESENCE_JOIN_ALL = 6,
    PRESENCE_LEAVE = 7,
    PRESENCE_LEAVE_ALL = 8,
    SUBSCRIBE = 9,
    SUBSCRIBE_ACK = 137,
    UNSUBSCRIBE = 10,
    UNSUBSCRIBE_ACK = 138,
    SUBSCRIBE_ALL = 11,
    SUBSCRIBE_ALL_ACK = 139,
    UNSUBSCRIBE_ALL = 12,
    UNSUBSCRIBE_ALL_ACK = 140,
    INVALID_PRESENCE_USERS = 80,
    MESSAGE_PERMISSION_ERROR = 96,
    MESSAGE_DENIED = 97,
    MULTIPLE_SUBSCRIPTIONS = 99,
    NOT_SUBSCRIBED = 100
}
export declare enum LOCK_ACTIONS {
    ERROR = 0,
    REQUEST = 1,
    RESPONSE = 2,
    RELEASE = 3
}
export declare enum STATE_ACTIONS {
    ERROR = 0,
    ADD = 1,
    REMOVE = 2,
    REQUEST_FULL_STATE = 3,
    FULL_STATE = 4
}
export declare enum CLUSTER_ACTIONS {
    PING = 0,
    PONG = 1,
    CLOSE = 2,
    REJECT = 3,
    REJECT_DUPLICATE = 4,
    IDENTIFICATION_REQUEST = 5,
    IDENTIFICATION_RESPONSE = 6,
    KNOWN_PEERS = 7
}
export declare const ACTIONS: {
    [TOPIC.PARSER]: typeof PARSER_ACTIONS;
    [TOPIC.CONNECTION]: typeof CONNECTION_ACTIONS;
    [TOPIC.AUTH]: typeof AUTH_ACTIONS;
    [TOPIC.EVENT]: typeof EVENT_ACTIONS;
    [TOPIC.RECORD]: typeof RECORD_ACTIONS;
    [TOPIC.RPC]: typeof RPC_ACTIONS;
    [TOPIC.PRESENCE]: typeof PRESENCE_ACTIONS;
    [TOPIC.LOCK]: typeof LOCK_ACTIONS;
    [TOPIC.STATE_REGISTRY]: typeof STATE_ACTIONS;
    [TOPIC.CLUSTER]: typeof CLUSTER_ACTIONS;
};
export declare enum EVENT {
    INFO = "INFO",
    DEPRECATED = "DEPRECATED",
    INCOMING_CONNECTION = "INCOMING_CONNECTION",
    CLOSED_SOCKET_INTERACTION = "CLOSED_SOCKET_INTERACTION",
    CLIENT_DISCONNECTED = "CLIENT_DISCONNECTED",
    CONNECTION_ERROR = "CONNECTION_ERROR",
    AUTH_ERROR = "AUTH_ERROR",
    PLUGIN_ERROR = "PLUGIN_ERROR",
    PLUGIN_INITIALIZATION_ERROR = "PLUGIN_INITIALIZATION_ERROR",
    PLUGIN_INITIALIZATION_TIMEOUT = "PLUGIN_INITIALIZATION_TIMEOUT",
    TIMEOUT = "TIMEOUT",
    LEADING_LISTEN = "LEADING_LISTEN",
    LOCAL_LISTEN = "LOCAL_LISTEN",
    INVALID_CONFIG_DATA = "INVALID_CONFIG_DATA",
    INVALID_STATE_TRANSITION = "INVALID_STATE_TRANSITION",
    INVALID_LEADER_REQUEST = "INVALID_LEADER_REQUEST"
}
