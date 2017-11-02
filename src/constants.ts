export enum EVENT {
    UNSOLICITED_MESSAGE,
    IS_CLOSED,
    MAX_RECONNECTION_ATTEMPTS_REACHED,
    CONNECTION_ERROR,
    INVALID_AUTHENTICATION_DETAILS,
    ACK_TIMEOUT,
    UNKNOWN_CORRELATION_ID,
    HEARTBEAT_TIMEOUT,
    LISTENER_EXISTS,
    NOT_LISTENING,
    CONNECTION_STATE_CHANGED = 'connectionStateChanged'
}

export enum CONNECTION_STATE {
    CLOSING = 'CLOSING',
    CLOSED = 'CLOSED',
    AWAITING_CONNECTION = 'AWAITING_CONNECTION',
    CHALLENGING = 'CHALLENGING',
    AWAITING_AUTHENTICATION = 'AWAITING_AUTHENTICATION',
    AUTHENTICATING = 'AUTHENTICATING',
    OPEN = 'OPEN',
    ERROR = 'ERROR',
    RECONNECTING = 'RECONNECTING',
    REDIRECTING = 'REDIRECTING',
    CHALLENGE_DENIED = 'CHALLENGE_DENIED',
    TOO_MANY_AUTH_ATTEMPTS = 'TOO_MANY_AUTH_ATTEMPTS',
    CONNECTION_AUTHENTICATION_TIMEOUT = 'CONNECTION_AUTHENTICATION_TIMEOUT',
}
