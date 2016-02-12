var messageBuilder = require( '../message/message-builder' ),
	messageParser = require( '../message/message-parser' ),
	AckTimeoutRegistry = require( '../utils/ack-timeout-registry' ),
	ResubscribeNotifier = require( '../utils/resubscribe-notifier' ),
	C = require( '../constants/constants' ),
	Listener = require( '../utils/listener' ),
	EventEmitter = require( 'component-emitter' );

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
var EventHandler = function( options, connection, client ) {
	this._options = options;
	this._connection = connection;
	this._client = client;
	this._emitter = new EventEmitter();
	this._listener = {};
	this._ackTimeoutRegistry = new AckTimeoutRegistry( client, C.TOPIC.EVENT, this._options.subscriptionTimeout );
	this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._resubscribe.bind( this ) );
};

/**
 * Subscribe to an event. This will receive both locally emitted events
 * as well as events emitted by other connected clients.
 *
 * @param   {String}   eventName
 * @param   {Function} callback
 *
 * @public
 * @returns {void}
 */
EventHandler.prototype.subscribe = function( eventName, callback ) {
	if( !this._emitter.hasListeners( eventName ) ) {
		this._ackTimeoutRegistry.add( eventName, C.ACTIONS.SUBSCRIBE );
		this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.SUBSCRIBE, [ eventName ] );
	}

	this._emitter.on( eventName, callback );
};

/**
 * Removes a callback for a specified event. If all callbacks
 * for an event have been removed, the server will be notified
 * that the client is unsubscribed as a listener
 *
 * @param   {String}   eventName
 * @param   {Function} callback
 *
 * @public
 * @returns {void}
 */
EventHandler.prototype.unsubscribe = function( eventName, callback ) {
	this._emitter.off( eventName, callback );
	
	if( !this._emitter.hasListeners( eventName ) ) {
		this._ackTimeoutRegistry.add( eventName, C.ACTIONS.UNSUBSCRIBE );
		this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.UNSUBSCRIBE, [ eventName ] );
	}
};

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
EventHandler.prototype.emit = function( name, data ) {
	this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.EVENT, [ name, messageBuilder.typed( data ) ] );
	this._emitter.emit( name, data );
};

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
EventHandler.prototype.listen = function( pattern, callback ) {
	if( this._listener[ pattern ] ) {
		this._client._$onError( C.TOPIC.EVENT, C.EVENT.LISTENER_EXISTS, pattern );
	} else {
		this._listener[ pattern ] = new Listener( C.TOPIC.EVENT, pattern, callback, this._options, this._client, this._connection );
	}
};

/**
 * Removes a listener that was previously registered with listenForSubscriptions
 *
 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
 * @param   {Function} callback
 *
 * @public
 * @returns {void}
 */
EventHandler.prototype.unlisten = function( pattern ) {
	if( this._listener[ pattern ] ) {
		this._ackTimeoutRegistry.add( pattern, C.EVENT.UNLISTEN );
		this._listener[ pattern ].destroy();
		delete this._listener[ pattern ];
	} else {
		this._client._$onError( C.TOPIC.EVENT, C.EVENT.NOT_LISTENING, pattern );
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
EventHandler.prototype._$handle = function( message ) {
	var name = message.data[ message.action === C.ACTIONS.ACK ? 1 : 0 ];

	if( message.action === C.ACTIONS.EVENT ) {
		if( message.data && message.data.length === 2 ) {
			this._emitter.emit( name, messageParser.convertTyped( message.data[ 1 ], this._client ) );
		} else {
			this._emitter.emit( name );
		}
		return;
	}

	if( this._listener[ name ] ) {
		this._listener[ name ]._$onMessage( message );
		return;
	}

	if( message.action === C.ACTIONS.ACK ) {
		this._ackTimeoutRegistry.clear( message );
		return;
	}
	
	if( message.action === C.ACTIONS.ERROR ) {
		message.processedError = true;
		this._client._$onError( C.TOPIC.EVENT, message.data[ 0 ], message.data[ 1 ] );
		return;
	}

	this._client._$onError( C.TOPIC.EVENT, C.EVENT.UNSOLICITED_MESSAGE, name );
};


/**
 * Resubscribes to events when connection is lost
 *
 * @package private
 * @returns {void}
 */
EventHandler.prototype._resubscribe = function() {
	var callbacks = this._emitter._callbacks;
	for( var eventName in callbacks ) {
		this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.SUBSCRIBE, [ eventName ] );
	}
};

module.exports = EventHandler;