"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const state_machine_1 = require("../util/state-machine");
const message_parser_1 = require("../../protocol/text/src/message-parser");
const message_builder_1 = require("../../protocol/text/src/message-builder");
const NodeWebSocket = require("ws");
const utils = require("../util/utils");
const Emitter = require("component-emitter2");
class Connection extends Emitter {
    constructor(services, options, url, emitter) {
        super();
        this.options = options;
        this.services = services;
        this.authParams = null;
        // tslint:disable-next-line:no-empty
        this.authCallback = () => { };
        this.deliberateClose = false;
        this.emitter = emitter;
        this.stateMachine = new state_machine_1.StateMachine(this.services.logger, {
            init: constants_1.CONNECTION_STATE.CLOSED,
            transitions: [
                { name: "connect" /* CONNECT */, from: constants_1.CONNECTION_STATE.CLOSED, to: constants_1.CONNECTION_STATE.AWAITING_CONNECTION },
                { name: "challenge" /* CHALLENGE */, from: constants_1.CONNECTION_STATE.CHALLENGING, to: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION },
                { name: "authenticate" /* AUTHENTICATE */, from: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION, to: constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION },
            ]
        });
        this.originalUrl = utils.parseUrl(url, this.options.path);
        this.url = this.originalUrl;
    }
    registerHandler(topic, callback) {
        this.handlers.set(topic, callback);
    }
    sendMessage(message) {
        this.endpoint.send(message_builder_1.getMessage(message, false));
    }
    /**
     * Sends the specified authentication parameters
     * to the server. Can be called up to <maxAuthAttempts>
     * times for the same connection.
     *
     * @param   {Object}   authParams A map of user defined auth parameters.
     *                E.g. { username:<String>, password:<String> }
     * @param   {Function} callback   A callback that will be invoked with the authenticationr result
     */
    authenticate(authParams = {}, callback = null) {
        if (typeof authParams !== 'object') {
            throw new Error('invalid argument authParams');
        }
        this.authParams = authParams;
        if (callback) {
            this.authCallback = callback;
        }
        if (this.stateMachine.inEndState) {
            if (this.deliberateClose) {
                this.createEndpoint();
            }
            else {
                this.services.logger.error({ topic: constants_1.TOPIC.CONNECTION }, constants_1.EVENT.IS_CLOSED);
            }
            return;
        }
        if (this.stateMachine.state === constants_1.CONNECTION_STATE.AWAITING_AUTHENTICATION) {
            this.sendAuthParams();
        }
    }
    /*
    * Returns the current connection state.
    */
    getConnectionState() {
        return this.stateMachine.state;
    }
    /**
     * Closes the connection. Using this method
     * sets a _deliberateClose flag that will prevent the client from
     * reconnecting.
     */
    close() {
        clearInterval(this.heartbeatInterval);
        this.deliberateClose = true;
        this.endpoint.close();
    }
    /**
     * Creates the endpoint to connect to using the url deepstream
     * was initialised with.
     */
    createEndpoint() {
        this.endpoint = new NodeWebSocket(this.url, this.options.nodeSocketOptions);
        this.endpoint.onopen = this.onOpen.bind(this);
        this.endpoint.onerror = this.onError.bind(this);
        this.endpoint.onclose = this.onClose.bind(this);
        this.endpoint.onmessage = this.onMessage.bind(this);
    }
    /********************************
    ****** Endpoint Callbacks ******
    /********************************/
    /**
    * Will be invoked once the connection is established. The client
    * can't send messages yet, and needs to get a connection ACK or REDIRECT
    * from the server before authenticating
    */
    onOpen() {
        this.clearReconnect();
        this.lastHeartBeat = Date.now();
        this.heartbeatInterval = utils.setInterval(this.checkHeartBeat.bind(this), this.options.heartbeatInterval);
        this.stateMachine.transition('connect');
    }
    /**
     * Callback for generic connection errors. Forwards
     * the error to the client.
     *
     * The connection is considered broken once this method has been
     * invoked.
     */
    onError(error) {
        clearInterval(this.heartbeatInterval);
        this.stateMachine.transition('error');
        /*
         * If the implementation isn't listening on the error event this will throw
         * an error. So let's defer it to allow the reconnection to kick in.
         */
        setTimeout(() => {
            let msg;
            if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
                msg = `Can't connect! Deepstream server unreachable on ${this.originalUrl}`;
            }
            else {
                try {
                    msg = JSON.stringify(error);
                }
                catch (e) {
                    msg = error.toString();
                }
            }
            this.services.logger.error({ topic: constants_1.TOPIC.CONNECTION }, constants_1.EVENT.CONNECTION_ERROR, msg);
        }, 1);
    }
    /**
     * Callback when the connection closes. This might have been a deliberate
     * close triggered by the client or the result of the connection getting
     * lost.
     *
     * In the latter case the client will try to reconnect using the configured
     * strategy.
     */
    onClose() {
        clearInterval(this.heartbeatInterval);
        if (this.stateMachine.state === constants_1.CONNECTION_STATE.REDIRECTING) {
            this.createEndpoint();
        }
        else if (this.deliberateClose === true) {
            this.stateMachine.transition("close" /* CLOSE */);
        }
        else {
            this.tryReconnect();
        }
    }
    /**
     * Callback for messages received on the connection.
     */
    onMessage(rawMessage) {
        const parsedMessages = message_parser_1.parse(rawMessage);
        for (let i = 0; i < parsedMessages.length; i++) {
            const message = parsedMessages[i];
            if (message === null) {
                continue;
            }
            else if (message.topic === constants_1.TOPIC.CONNECTION) {
                this.handleConnectionResponse(parsedMessages[i]);
            }
            else if (message.topic === constants_1.TOPIC.AUTH) {
                this.handleAuthResponse(parsedMessages[i]);
            }
        }
    }
    /**
    * Sends authentication params to the server. Please note, this
    * doesn't use the queued message mechanism, but rather sends the message directly
    */
    sendAuthParams() {
        this.stateMachine.transition("authenticate" /* AUTHENTICATE */);
        this.sendMessage({
            topic: constants_1.TOPIC.AUTH,
            action: constants_1.AUTH_ACTION.REQUEST,
            parsedData: this.authParams
        });
    }
    /**
    * Ensures that a heartbeat was not missed more than once, otherwise it considers the connection
    * to have been lost and closes it for reconnection.
    */
    checkHeartBeat() {
        const heartBeatTolerance = this.options.heartbeatInterval * 2;
        if (Date.now() - this.lastHeartBeat > heartBeatTolerance) {
            clearInterval(this.heartbeatInterval);
            this.endpoint.close();
            this.services.logger.error({
                topic: constants_1.TOPIC.CONNECTION
            }, constants_1.EVENT.CONNECTION_ERROR, `heartbeat not received in the last ${heartBeatTolerance} milliseconds`);
        }
    }
    /**
    * If the connection drops or is closed in error this
    * method schedules increasing reconnection intervals
    *
    * If the number of failed reconnection attempts exceeds
    * options.maxReconnectAttempts the connection is closed
    */
    tryReconnect() {
        if (this.reconnectTimeout !== null) {
            return;
        }
        if (this.reconnectionAttempt < this.options.maxReconnectAttempts) {
            this.stateMachine.transition("reconnect" /* RECONNECT */);
            this.reconnectTimeout = setTimeout(this.tryOpen.bind(this), Math.min(this.options.maxReconnectInterval, this.options.reconnectIntervalIncrement * this.reconnectionAttempt));
            this.reconnectionAttempt++;
            return;
        }
        this.clearReconnect();
        this.close();
        this.emitter.emit(constants_1.EVENT[constants_1.EVENT.MAX_RECONNECTION_ATTEMPTS_REACHED], this.reconnectionAttempt);
    }
    /**
     * Attempts to open a errourosly closed connection
     */
    tryOpen() {
        this.url = this.originalUrl;
        this.createEndpoint();
        this.reconnectTimeout = null;
    }
    /**
     * Stops all further reconnection attempts,
     * either because the connection is open again
     * or because the maximal number of reconnection
     * attempts has been exceeded
     */
    clearReconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        this.reconnectTimeout = null;
        this.reconnectionAttempt = 0;
    }
    /**
     * The connection response will indicate whether the deepstream connection
     * can be used or if it should be forwarded to another instance. This
     * allows us to introduce load-balancing if needed.
     *
     * If authentication parameters are already provided this will kick of
     * authentication immediately. The actual 'open' event won't be emitted
     * by the client until the authentication is successful.
     *
     * If a challenge is recieved, the user will send the url to the server
     * in response to get the appropriate redirect. If the URL is invalid the
     * server will respond with a REJECTION resulting in the client connection
     * being permanently closed.
     *
     * If a redirect is recieved, this connection is closed and updated with
     * a connection to the url supplied in the message.
     */
    handleConnectionResponse(message) {
        if (message.action === constants_1.CONNECTION_ACTION.PING) {
            this.lastHeartBeat = Date.now();
            this.sendMessage({ topic: constants_1.TOPIC.CONNECTION, action: constants_1.CONNECTION_ACTION.PONG });
            return;
        }
        if (message.action === constants_1.CONNECTION_ACTION.ACCEPT) {
            this.stateMachine.transition("accepted" /* ACCEPTED */);
            return;
        }
        if (message.action === constants_1.CONNECTION_ACTION.CHALLENGE) {
            this.stateMachine.transition("challenging" /* CHALLENGING */);
            this.sendMessage({
                topic: constants_1.TOPIC.CONNECTION,
                action: constants_1.CONNECTION_ACTION.CHALLENGE_RESPONSE,
                parsedData: this.originalUrl
            });
            return;
        }
        if (message.action === constants_1.CONNECTION_ACTION.REJECTION) {
            this.stateMachine.transition("challenge-rejected" /* CHALLENGE_REJECTED */);
            this.close();
            return;
        }
        if (message.action === constants_1.CONNECTION_ACTION.REDIRECT) {
            this.url = message.data;
            this.stateMachine.transition("redirected" /* CONNECTION_REDIRECTED */);
            this.endpoint.close();
            return;
        }
        if (message.action === constants_1.CONNECTION_ACTION.CONNECTION_AUTHENTICATION_TIMEOUT) {
            this.deliberateClose = true;
            this.services.logger.error(message);
            return;
        }
    }
    /**
     * Callback for messages received for the AUTH topic. If
     * the authentication was successful this method will
     * open the connection and send all messages that the client
     * tried to send so far.
     */
    handleAuthResponse(message) {
        if (message.action === constants_1.AUTH_ACTION.TOO_MANY_AUTH_ATTEMPTS) {
            this.deliberateClose = true;
            this.stateMachine.transition("too-many-auth-attempts" /* TOO_MANY_AUTH_ATTEMPTS */);
            return;
        }
        if (message.action === constants_1.AUTH_ACTION.AUTH_UNSUCCESSFUL) {
            this.deliberateClose = true;
            this.authCallback(false, { reason: constants_1.EVENT.INVALID_AUTHENTICATION_DETAILS });
            return;
        }
        if (message.action === constants_1.AUTH_ACTION.AUTH_SUCCESSFUL) {
            this.stateMachine.transition('open');
            this.authCallback(true, message.parsedData);
            return;
        }
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map