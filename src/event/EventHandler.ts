import Emitter = require("component-emitter");
import { ParsedMessage, MessageParser } from "../message/MessageParser";
import { Connection } from "../message/Connection";
import { Client } from "../Client";
import { Listener } from "../utils/Listener";
import { AckTimeoutRegistry } from "../utils/AckTimeoutRegistry";
import { ResubscribeNotifier } from "../utils/ResubscribeNotifier";
import { Topics, Actions, Events } from "../constants/Constants";
import { MessageBuilder } from "../message/MessageBuilder";
import { DeepstreamOptions } from "../DefaultOptions";

/**
 * This class handles incoming and outgoing messages in relation
 * to deepstream events. It basically acts like an event-hub that's
 * replicated across all connected clients.
 *
 * @param {Object} options    deepstream options
 * @param {Connection} connection
 * @param {Client} client
 * @public
 * @constructor
 */
export class EventHandler {
	private _connection: Connection;
	private _client: Client;
	private _emitter: Emitter;
	private _listener: {[key: string]: Listener};
	private _ackTimeoutRegistry: AckTimeoutRegistry;
	private _resubscribeNotifier: ResubscribeNotifier;

	private get _options(): DeepstreamOptions { return this._client.options; }

	public constructor(client: Client, connection: Connection) {
		this._client = client;
		this._connection = connection;
		this._emitter = new Emitter();
		this._listener = {};
		this._ackTimeoutRegistry = new AckTimeoutRegistry( client, Topics.EVENT, this._options.subscriptionTimeout );
		this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._resubscribe.bind( this ) );
	}

	/**
	 * Subscribe to an event. This will receive both locally emitted events
	 * as well as events emitted by other connected clients.
	 *
	 * @param   {String}   name
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	public subscribe(name: string, callback: () => void): void { // TODO: Proper callback type
		if ( typeof name !== 'string' || name.length === 0 ) {
			throw new Error( 'invalid argument name' );
		}
		if ( typeof callback !== 'function' ) {
			throw new Error( 'invalid argument callback' );
		}

		if( !this._emitter.hasListeners( name ) ) {
			this._ackTimeoutRegistry.add( name, Actions.SUBSCRIBE );
			this._connection.sendMessage( Topics.EVENT, Actions.SUBSCRIBE, [ name ] );
		}

		this._emitter.on( name, callback );
	}

	/**
	 * Removes a callback for a specified event. If all callbacks
	 * for an event have been removed, the server will be notified
	 * that the client is unsubscribed as a listener
	 *
	 * @param   {String}   name
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	public unsubscribe(name: string, callback: () => void): void { // TODO: Callback type
		if ( typeof name !== 'string' || name.length === 0 ) {
			throw new Error( 'invalid argument name' );
		}
		if ( callback !== undefined && typeof callback !== 'function' ) {
			throw new Error( 'invalid argument callback' );
		}
		this._emitter.off( name, callback );

		if( !this._emitter.hasListeners( name ) ) {
			this._ackTimeoutRegistry.add( name, Actions.UNSUBSCRIBE );
			this._connection.sendMessage( Topics.EVENT, Actions.UNSUBSCRIBE, [ name ] );
		}
	}

	/**
	 * Emits an event locally and sends a message to the server to
	 * broadcast the event to the other connected clients
	 *
	 * @param   {String} name
	 * @param   {Mixed} data will be serialized and deserialized to its original type.
	 *
	 * @public
	 * @returns {void}
	 */
	public emit(name: string, data: string): void {
		if ( typeof name !== 'string' || name.length === 0 ) {
			throw new Error( 'invalid argument name' );
		}

		this._connection.sendMessage( Topics.EVENT, Actions.EVENT, [ name, MessageBuilder.typed( data ) ] );
		this._emitter.emit( name, data );
	}

	/**
	 * Allows to listen for event subscriptions made by this or other clients. This
	 * is useful to create "active" data providers, e.g. providers that only provide
	 * data for a particular event if a user is actually interested in it
	 *
	 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	public listen(pattern: string, callback: () => void): void { // TODO: Callback type
		if ( typeof pattern !== 'string' || pattern.length === 0 ) {
			throw new Error( 'invalid argument pattern' );
		}
		if ( typeof callback !== 'function' ) {
			throw new Error( 'invalid argument callback' );
		}

		if( this._listener[ pattern ] && !this._listener[ pattern ].destroyPending ) {
			return this._client._$onError( Topics.EVENT, Events.LISTENER_EXISTS, pattern );
		} else if( this._listener[ pattern ] ) {
			this._listener[ pattern ].destroy();
		}

		this._listener[ pattern ] = new Listener( Topics.EVENT, pattern, callback, this._client, this._connection );
	}

	/**
	 * Removes a listener that was previously registered with listenForSubscriptions
	 *
	 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
	 * @param   {Function} callback
	 *
	 * @public
	 * @returns {void}
	 */
	public unlisten(pattern: string): void {
		if ( typeof pattern !== 'string' || pattern.length === 0 ) {
			throw new Error( 'invalid argument pattern' );
		}

		let listener = this._listener[ pattern ];

		if( listener && !listener.destroyPending ) {
			listener.sendDestroy();
		} else if( this._listener[ pattern ] ) {
			this._ackTimeoutRegistry.add( pattern, Events.NOT_LISTENING );
			this._listener[ pattern ].destroy();
			delete this._listener[ pattern ];
		} else {
			this._client._$onError( Topics.RECORD, Events.NOT_LISTENING, pattern );
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
	private _handle(message: ParsedMessage): void {
		let name = message.data[ message.action === Actions.ACK ? 1 : 0 ];

		if( message.action === Actions.EVENT ) {
			if( message.data && message.data.length === 2 ) {
				this._emitter.emit( name, MessageParser.convertTyped( message.data[ 1 ], this._client ) );
			} else {
				this._emitter.emit( name );
			}
			return;
		}

		if( message.action === Actions.ACK && message.data[ 0 ] === Actions.UNLISTEN &&
			this._listener[ name ] && this._listener[ name ].destroyPending
		) {
			this._listener[ name ].destroy();
			delete this._listener[ name ];
			return;
		} else if( this._listener[ name ] ) {
			this._listener[ name ]._$onMessage( message );
			return;
		} else if( message.action === Actions.SUBSCRIPTION_FOR_PATTERN_REMOVED ) {
			// An unlisten ACK was received before an PATTERN_REMOVED which is a valid case
			return;
		}  else if( message.action === Actions.SUBSCRIPTION_HAS_PROVIDER ) {
			// record can receive a HAS_PROVIDER after discarding the record
			return;
		}

		if( message.action === Actions.ACK ) {
			this._ackTimeoutRegistry.clear( message );
			return;
		}

		if( message.action === Actions.ERROR ) {
			if (message.data[0] === Events.MESSAGE_DENIED){
				this._ackTimeoutRegistry.remove( message.data[1], message.data[2] );
			}
			else if ( message.data[0] === Events.NOT_SUBSCRIBED ){
				this._ackTimeoutRegistry.remove( message.data[1], Actions.UNSUBSCRIBE );
			}
			message.processedError = true;
			this._client._$onError( Topics.EVENT, message.data[ 0 ], message.data[ 1 ] );
			return;
		}

		this._client._$onError( Topics.EVENT, Events.UNSOLICITED_MESSAGE, name );
	}

	/**
	 * Resubscribes to events when connection is lost
	 *
	 * @package private
	 * @returns {void}
	 */
	private _resubscribe(): void {
		let callbacks = this._emitter._callbacks;
		for(let eventName in callbacks) {
			this._connection.sendMessage( Topics.EVENT, Actions.SUBSCRIBE, [ eventName ] );
		}
	}
}
