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
var PresenceHandler = function( options, connection, client ) {
		this._options = options;
		this._connection = connection;
		this._client = client;
		this._emitter = new EventEmitter();
		this._ackTimeoutRegistry = new AckTimeoutRegistry( client, C.TOPIC.PRESENCE, this._options.subscriptionTimeout );
		this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._resubscribe.bind( this ) );
};

/**
 * Queries for clients logged into deepstream.
 *
 * @param   {Function} callback Will be invoked with an array of clients
 *
 * @public
 * @returns {void}
 */
PresenceHandler.prototype.getAll = function( callback ) {
	if( !this._emitter.hasListeners( C.ACTIONS.QUERY ) ) {
		// At least one argument is required for a message to be permissionable
		this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.QUERY, [ C.ACTIONS.QUERY ] );
	}
	this._emitter.once( C.ACTIONS.QUERY, callback );
};

/**
 * Subscribes to client logins or logouts in deepstream
 *
 * @param   {Function} callback Will be invoked with the username of a client,
 *                              and a boolean to indicate if it was a login or
 *                              logout event
 * @public
 * @returns {void}
 */
PresenceHandler.prototype.subscribe = function( callback ) {
	if ( callback !== undefined && typeof callback !== 'function' ) {
		throw new Error( 'invalid argument callback' );
	}

	if( !this._emitter.hasListeners( C.TOPIC.PRESENCE ) ) {
		this._ackTimeoutRegistry.add( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE );
		this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ C.ACTIONS.SUBSCRIBE ] );
	}

	this._emitter.on( C.TOPIC.PRESENCE, callback );
};

/**
 * Removes a callback for a specified presence event
 *
 * @param   {Function} callback The callback to unregister via {PresenceHandler#unsubscribe}
 *
 * @public
 * @returns {void}
 */
PresenceHandler.prototype.unsubscribe = function( callback ) {
	if ( callback !== undefined && typeof callback !== 'function' ) {
		throw new Error( 'invalid argument callback' );
	}

	this._emitter.off( C.TOPIC.PRESENCE, callback );

	if( !this._emitter.hasListeners( C.TOPIC.PRESENCE ) ) {
		this._ackTimeoutRegistry.add( C.TOPIC.PRESENCE, C.ACTIONS.UNSUBSCRIBE );
		this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.UNSUBSCRIBE, [ C.ACTIONS.UNSUBSCRIBE ] );
	}
};

/**
 * Handles incoming messages from the server
 *
 * @param   {Object} message parsed deepstream message
 *
 * @package private
 * @returns {void}
 */
PresenceHandler.prototype._$handle = function( message ) {
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
};

/**
 * Resubscribes to presence subscription when connection is lost
 *
 * @package private
 * @returns {void}
 */
PresenceHandler.prototype._resubscribe = function() {
	var callbacks = this._emitter._callbacks;
	if( callbacks && callbacks[ C.TOPIC.PRESENCE ] ) {
		this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ C.ACTIONS.SUBSCRIBE ] );
	}
};

module.exports = PresenceHandler;