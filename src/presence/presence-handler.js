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
 * Queries for clients logged into deepstream
 *
 * @param   {Function} callback Will be invoked with an array of clients
 *
 * @public
 * @returns {void}
 */
PresenceHandler.prototype.getCurrentClients = function( callback ) {
	this._emitter.once( C.ACTIONS.QUERY, callback );
	// At least one argument is required for a message to be permissionable
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.QUERY, [ C.ACTIONS.QUERY ] );
};

/**
 * Subscribes to client logins or logouts in deepstream
 *
 * @param 	{String} event the presence join or leave event to subscribe to
 * @param   {Function} callback Will be invoked with the username of a client
 *								that logs in or out
 *
 * @public
 * @returns {void}
 */
PresenceHandler.prototype.subscribe = function( event, callback ) {
	if ( callback !== undefined && typeof callback !== 'function' ) {
		throw new Error( 'invalid argument callback' );
	}

	if( !this._emitter.hasListeners( event ) ) {
		this._ackTimeoutRegistry.add( event, C.ACTIONS.SUBSCRIBE );
		this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ event ] );
	}
	this._emitter.on( event, callback );
};

/**
 * Removes a callback for a specified presence event
 *
 * @param 	{String} event the presence join or leave event to subscribe to
 * @param   {Function} callback Will be invoked with the username of a client
 *								that logs in or out
 *
 * @public
 * @returns {void}
 */
PresenceHandler.prototype.unsubscribe = function( event, callback ) {
	if ( callback !== undefined && typeof callback !== 'function' ) {
		throw new Error( 'invalid argument callback' );
	}
	this._emitter.off( event, callback );

	if( !this._emitter.hasListeners( event ) ) {
		this._ackTimeoutRegistry.add( event, C.ACTIONS.UNSUBSCRIBE );
		this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.UNSUBSCRIBE, [ event ] );
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
	if( message.action === C.ACTIONS.ACK ) {
		this._ackTimeoutRegistry.clear( message );
	}
	else if( message.action === C.ACTIONS.PRESENCE_JOIN ) {
		this._emitter.emit( C.ACTIONS.PRESENCE_JOIN, message.data[ 0 ] );
	}
	else if( message.action === C.ACTIONS.PRESENCE_LEAVE ) {
		this._emitter.emit( C.ACTIONS.PRESENCE_LEAVE, message.data[ 0 ] );
	}
	else if( message.action === C.ACTIONS.QUERY ) {
		this._emitter.emit( C.ACTIONS.QUERY, message.data );
	}
	else {
		this._client._$onError( C.TOPIC.PRESENCE, C.EVENT.UNSOLICITED_MESSAGE, message.action );
	}
};

/**
 * Resubscribes to events when connection is lost
 *
 * @package private
 * @returns {void}
 */
PresenceHandler.prototype._resubscribe = function() {
	var callbacks = this._emitter._callbacks;
	for( var event in callbacks ) {
		this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ event ] );
	}
};

module.exports = PresenceHandler;