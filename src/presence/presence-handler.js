var EventEmitter = require( 'component-emitter' ),
	C = require( '../constants/constants' ),
	AckTimeoutRegistry = require( '../utils/ack-timeout-registry' ),
	messageParser = require( '../message/message-parser' ),
	messageBuilder = require( '../message/message-builder' );

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
	this._emitter.on( C.ACTIONS.QUERY, callback );
	this._ackTimeoutRegistry.add( C.ACTIONS.QUERY, C.TOPIC.PRESENCE);
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.QUERY );
};

/**
 * Subscribes to client logins in deepstream
 *
 * @param   {Function} callback Will be invoked with the username of a client
 *								that logs in
 *
 * @public
 * @returns {void}
 */
PresenceHandler.prototype.onClientLogin = function( callback ) {
	this._emitter.on( C.ACTIONS.PRESENCE_JOIN, callback );
	this._ackTimeoutRegistry.add( C.ACTIONS.PRESENCE_JOIN, C.ACTIONS.SUBSCRIBE );
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ C.ACTIONS.PRESENCE_JOIN ] );
};

/**
 * Subscribes to client logouts in deepstream
 *
 * @param   {Function} callback Will be invoked with the username of a client
 *								that logs out
 *
 * @public
 * @returns {void}
 */
PresenceHandler.prototype.onClientLogout = function( callback ) {
	this._emitter.on( C.ACTIONS.PRESENCE_LEAVE, callback );
	this._ackTimeoutRegistry.add( C.ACTIONS.PRESENCE_LEAVE, C.ACTIONS.SUBSCRIBE );
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ C.ACTIONS.PRESENCE_LEAVE ] );
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
};

module.exports = PresenceHandler;