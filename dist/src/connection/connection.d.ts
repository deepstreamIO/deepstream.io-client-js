import { CONNECTION_STATE } from '../constants';
import { TOPIC, Message } from '../../binary-protocol/src/message-constants';
import { Services } from '../client';
import { Options } from '../client-options';
export declare type AuthenticationCallback = (success: boolean, clientData: object) => void;
export declare type ResumeCallback = (error?: object) => void;
export declare class Connection {
    isConnected: boolean;
    emitter: Emitter;
    private internalEmitter;
    private services;
    private options;
    private stateMachine;
    private authParams;
    private clientData;
    private authCallback;
    private resumeCallback;
    private originalUrl;
    private url;
    private heartbeatInterval;
    private lastHeartBeat;
    private endpoint;
    private handlers;
    private deliberateClose;
    private reconnectTimeout;
    private reconnectionAttempt;
    constructor(services: Services, options: Options, url: string, emitter: Emitter);
    onLost(callback: Function): void;
    onReestablished(callback: Function): void;
    registerHandler(topic: TOPIC, callback: Function): void;
    sendMessage(message: Message): void;
    /**
     * Sends the specified authentication parameters
     * to the server. Can be called up to <maxAuthAttempts>
     * times for the same connection.
     *
     * @param   {Object}   authParams A map of user defined auth parameters.
     *                E.g. { username:<String>, password:<String> }
     * @param   {Function} callback   A callback that will be invoked with the authenticationr result
     */
    authenticate(authParamsOrCallback?: object | null, callback?: AuthenticationCallback | null): void;
    getConnectionState(): CONNECTION_STATE;
    private isOpen();
    /**
     * Closes the connection. Using this method
     * will prevent the client from reconnecting.
     */
    close(): void;
    pause(): void;
    resume(callback: ResumeCallback): void;
    /**
     * Creates the endpoint to connect to using the url deepstream
     * was initialised with.
     */
    private createEndpoint();
    /********************************
    ****** Endpoint Callbacks ******
    /********************************/
    /**
    * Will be invoked once the connection is established. The client
    * can't send messages yet, and needs to get a connection ACK or REDIRECT
    * from the server before authenticating
    */
    private onOpen();
    /**
     * Callback for generic connection errors. Forwards
     * the error to the client.
     *
     * The connection is considered broken once this method has been
     * invoked.
     */
    private onError(error);
    /**
     * Callback when the connection closes. This might have been a deliberate
     * close triggered by the client or the result of the connection getting
     * lost.
     *
     * In the latter case the client will try to reconnect using the configured
     * strategy.
     */
    private onClose();
    /**
     * Callback for messages received on the connection.
     */
    private onMessages(parseResults);
    /**
    * Sends authentication params to the server. Please note, this
    * doesn't use the queued message mechanism, but rather sends the message directly
    */
    private sendAuthParams();
    /**
    * Ensures that a heartbeat was not missed more than once, otherwise it considers the connection
    * to have been lost and closes it for reconnection.
    */
    private checkHeartBeat();
    /**
    * If the connection drops or is closed in error this
    * method schedules increasing reconnection intervals
    *
    * If the number of failed reconnection attempts exceeds
    * options.maxReconnectAttempts the connection is closed
    */
    private tryReconnect();
    /**
     * Attempts to open a errourosly closed connection
     */
    private tryOpen();
    /**
     * Stops all further reconnection attempts,
     * either because the connection is open again
     * or because the maximal number of reconnection
     * attempts has been exceeded
     */
    private clearReconnect();
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
    private handleConnectionResponse(message);
    /**
     * Callback for messages received for the AUTH topic. If
     * the authentication was successful this method will
     * open the connection and send all messages that the client
     * tried to send so far.
     */
    private handleAuthResponse(message);
    private onAwaitingAuthentication();
    private onAuthSuccessful(clientData);
    private onAuthUnSuccessful();
    private updateClientData(data);
}
