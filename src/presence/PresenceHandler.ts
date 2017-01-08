import { Connection } from "../message/Connection";
import { Client } from "../Client";
import { Actions, Topics, Events } from "../constants/Constants";
import { ParsedMessage } from "../message/MessageParser";
import { AckTimeoutRegistry } from "../utils/AckTimeoutRegistry";
import { ResubscribeNotifier } from "../utils/ResubscribeNotifier";

import Emitter = require("component-emitter");

/**
 * The main class for presence in deepstream
 *
 * Provides the presence interface and handles incoming messages
 * on the presence topic
 *
 * @param {Object} options deepstream configuration options
 * @param {Connection} connection
 * @param {Client} client
 *
 * @constructor
 * @public
 */
export class PresenceHandler {
    public _options: any; // TODO: Type
    public _connection: Connection;
    public _client: Client;
    public _emitter: any; // `Emitter`, but not exported
    public _ackTimeoutRegistry: AckTimeoutRegistry;
    public _resubscribeNotifier: ResubscribeNotifier;

    public constructor(options: any, connection: Connection, client: Client) { // TODO: Option type
        this._options = options;
        this._connection = connection;
        this._client = client;
        this._emitter = new Emitter();
        this._ackTimeoutRegistry = new AckTimeoutRegistry(client, Topics.PRESENCE, this._options.subscriptionTimeout);
        this._resubscribeNotifier = new ResubscribeNotifier(this._client, this._resubscribe.bind(this));
    }

    /**
     * Queries for clients logged into deepstream.
     *
     * @param   {Function} callback Will be invoked with an array of clients
     *
     * @public
     * @returns {void}
     */
    public getAll(): Promise<Client[]> {
        let resolve: (() => void) | undefined;
        let promise = new Promise(r => resolve = r);
        if (!this._emitter.hasListeners(Actions.QUERY)) {
            // At least one argument is required for a message to be permissionable
            this._connection.sendMessage(Topics.PRESENCE, Actions.QUERY, [Actions.QUERY]);
        }
        if (resolve) {
            this._emitter.once(Actions.QUERY, resolve);
        } else {
            throw new Error("Resolve was not set.");
        }
        return promise;
    }

    /**
     * Subscribes to client logins or logouts in deepstream
     *
     * @param   {Function} callback Will be invoked with the username of a client,
     *                              and a boolean to indicate if it was a login or
     *                              logout event
     * @public
     * @returns {void}
     */
    public subscribe(callback: PresenceHandler.SubscribeCallback): void {
        if (callback !== undefined && typeof callback !== 'function') {
            throw new Error('invalid argument callback');
        }

        if (!this._emitter.hasListeners(Topics.PRESENCE)) {
            this._ackTimeoutRegistry.add(Topics.PRESENCE, Actions.SUBSCRIBE);
            this._connection.sendMessage(Topics.PRESENCE, Actions.SUBSCRIBE, [Actions.SUBSCRIBE]);
        }

        this._emitter.on(Topics.PRESENCE, callback);
    }

    /**
     * Removes a callback for a specified presence event
     *
     * @param   {Function} callback The callback to unregister via {PresenceHandler#unsubscribe}
     *
     * @public
     * @returns {void}
     */
    public unsubscribe(callback: PresenceHandler.SubscribeCallback): void {
        if (callback !== undefined && typeof callback !== 'function') {
            throw new Error('invalid argument callback');
        }

        this._emitter.off(Topics.PRESENCE, callback);

        if (!this._emitter.hasListeners(Topics.PRESENCE)) {
            this._ackTimeoutRegistry.add(Topics.PRESENCE, Actions.UNSUBSCRIBE);
            this._connection.sendMessage(Topics.PRESENCE, Actions.UNSUBSCRIBE, [Actions.UNSUBSCRIBE]);
        }
    }

    /**
     * Handles incoming messages from the server
     *
     * @param   {Object} message parsed deepstream message
     *
     * @package private
     * @returns {void}
     */
    public _$handle(message: ParsedMessage): void {
        if (message.action === Actions.ERROR && message.data[0] === Events.MESSAGE_DENIED) {
            this._ackTimeoutRegistry.remove(Topics.PRESENCE, message.data[1]);
            message.processedError = true;
            this._client._$onError(Topics.PRESENCE, Events.MESSAGE_DENIED, message.data[1]);
        }
        else if (message.action === Actions.ACK) {
            this._ackTimeoutRegistry.clear(message);
        }
        else if (message.action === Actions.PRESENCE_JOIN) {
            this._emitter.emit(Topics.PRESENCE, message.data[0], true);
        }
        else if (message.action === Actions.PRESENCE_LEAVE) {
            this._emitter.emit(Topics.PRESENCE, message.data[0], false);
        }
        else if (message.action === Actions.QUERY) {
            this._emitter.emit(Actions.QUERY, message.data);
        }
        else {
            this._client._$onError(Topics.PRESENCE, Events.UNSOLICITED_MESSAGE, message.action);
        }
    }

    /**
     * Resubscribes to presence subscription when connection is lost
     *
     * @package private
     * @returns {void}
     */
    private _resubscribe(): void {
        let callbacks = this._emitter._callbacks;
        if (callbacks && callbacks[Topics.PRESENCE]) {
            this._connection.sendMessage(Topics.PRESENCE, Actions.SUBSCRIBE, [Actions.SUBSCRIBE]);
        }
    }
}

export namespace PresenceHandler {
    export type SubscribeCallback = (username: string, loggedIn: boolean) => void;
}
