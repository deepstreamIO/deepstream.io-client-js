import { Connection } from "../message/connection";
import { Client } from "../client";
import { Actions, Topic } from "../constants/constants";
import { ParsedMessage } from "../message/message-parser";
var EventEmitter = require( 'component-emitter' ),
	C = require( '../constants/constants' ),
	AckTimeoutRegistry = require( '../utils/ack-timeout-registry' ),
	messageParser = require( '../message/message-parser' ),
	messageBuilder = require( '../message/message-builder' ),
	ResubscribeNotifier = require( '../utils/resubscribe-notifier' );


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
	public _emitter: EventEmitter;
	public _ackTimeoutRegistry: AckTimeoutRegistry;
	public _resubscribeNotifier: ResubscribeNotifier;

	public constructor(options: any, connection: Connection, client: Client) { // TODO: Option type
		this._options = options;
		this._connection = connection;
		this._client = client;
		this._emitter = new EventEmitter();
		this._ackTimeoutRegistry = new AckTimeoutRegistry( client, C.TOPIC.PRESENCE, this._options.subscriptionTimeout );
		this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._resubscribe.bind( this ) );
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
		if( !this._emitter.hasListeners( C.ACTIONS.QUERY ) ) {
			// At least one argument is required for a message to be permissionable
			this._connection.sendMessage(Topic.PRESENCE, Actions.QUERY, [ Actions.QUERY ] );
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
		if ( callback !== undefined && typeof callback !== 'function' ) {
			throw new Error( 'invalid argument callback' );
		}

		if( !this._emitter.hasListeners( Topic.PRESENCE ) ) {
			this._ackTimeoutRegistry.add( Topic.PRESENCE, Actions.SUBSCRIBE );
			this._connection.sendMessage( Topic.PRESENCE, Actions.SUBSCRIBE, [ Actions.SUBSCRIBE ] );
		}

		this._emitter.on( Topic.PRESENCE, callback );
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
		if ( callback !== undefined && typeof callback !== 'function' ) {
			throw new Error( 'invalid argument callback' );
		}

		this._emitter.off( Topic.PRESENCE, callback );

		if( !this._emitter.hasListeners(Topic.PRESENCE)) {
			this._ackTimeoutRegistry.add(Topic.PRESENCE, Actions.UNSUBSCRIBE);
			this._connection.sendMessage(Topic.PRESENCE, Actions.UNSUBSCRIBE, [ Actions.UNSUBSCRIBE ]);
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
	private _$handle(message: ParsedMessage): void {
		if( message.action === C.ACTIONS.ERROR && message.data[ 0 ] === C.EVENT.MESSAGE_DENIED ) {
			this._ackTimeoutRegistry.remove( C.TOPIC.PRESENCE, message.data[ 1 ] );
			message.processedError = true;
			this._client._$onError( C.TOPIC.PRESENCE, C.EVENT.MESSAGE_DENIED, message.data[ 1 ] );
		}
		else if( message.action === C.ACTIONS.ACK ) {
			this._ackTimeoutRegistry.clear( message );
		}
		else if( message.action === C.ACTIONS.PRESENCE_JOIN ) {
			this._emitter.emit( C.TOPIC.PRESENCE, message.data[ 0 ], true );
		}
		else if( message.action === C.ACTIONS.PRESENCE_LEAVE ) {
			this._emitter.emit( C.TOPIC.PRESENCE, message.data[ 0 ], false );
		}
		else if( message.action === C.ACTIONS.QUERY ) {
			this._emitter.emit( C.ACTIONS.QUERY, message.data );
		}
		else {
			this._client._$onError( C.TOPIC.PRESENCE, C.EVENT.UNSOLICITED_MESSAGE, message.action );
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
		if( callbacks && callbacks[ C.TOPIC.PRESENCE ] ) {
			this._connection.sendMessage( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ C.ACTIONS.SUBSCRIBE ] );
		}
	}
}

export namespace PresenceHandler {
	export type SubscribeCallback = (username: string, loggedIn: boolean) => void;
}
