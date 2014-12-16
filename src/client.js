var C = require( './constants/constants' ),
	Emitter = require( 'component-emitter' ),
	Connection = require( './message/connection' ),
	EventHandler = require( './event/event-handler' ),
	RpcHandler = require( './rpc/rpc-handler' ),
	defaultOptions = require( './default-options' );
	

var Client = function( url, options ) {
	this._url = url;
	this._options = this._getOptions( options || {} );

	this._connection = new Connection( this, this._url, this._options );

	this._messageCallbacks = {};

	this.event = new EventHandler( this._options, this._connection );
	this.rpc = new RpcHandler( this._options, this._connection, this );

	this._messageCallbacks[ C.TOPIC.EVENT ] = this.event._$handle.bind( this.event );
	this._messageCallbacks[ C.TOPIC.RPC ] = this.rpc._$handle.bind( this.rpc );
	this._messageCallbacks[ C.TOPIC.ERROR ] = this._$onError;
};

Emitter( Client.prototype );

Client.prototype.login = function( authParams, callback ) {
	this._connection.authenticate( authParams, callback );
	return this;
};

Client.prototype.close = function() {
	this._connection.close();
};

Client.prototype.getConnectionState = function() {
	return this._connection.getState();
};

Client.prototype.onRecordSubscription = function( pattern, callback ) {

};

Client.prototype.getRecord = function( name, persist ) {

};

Client.prototype.getList = function( name, persist ) {

};

Client.prototype.getAnonymousRecord = function() {

};

/**
 * Returns a random string. The first block of characters
 * is a timestamp, in order to allow databases to optimize for semi-
 * sequentuel numberings
 *
 * @public
 * @returns {String} unique id
 */
Client.prototype.getUid = function() {
	var f = function() {
		return (Math.random() * 10000000000000000).toString(36).replace( '.', '' );
	};
	
	return (new Date()).getTime().toString(36) + '-' + f() + '-' + f();
};

Client.prototype._$onMessage = function( message ) {
	if( this._messageCallbacks[ message.topic ] ) {
		this._messageCallbacks[ message.topic ]( message );
	} else {
		this._$onError( message.topic, message.action, 'received message for unknown topic ' + message.topic );
	}

	if( message.action === C.ACTIONS.ERROR && !message.processedError ) {
		this._$onError( message.topic, message.action, message.data[ 0 ] );
	}
};

Client.prototype._$onError = function( topic, event, msg ) {
	if( this.hasListeners( 'error' ) ) {
		this.emit( 'error', msg, event, topic );
		this.emit( event, topic, msg );
	} else {
		console.log( '--- You can catch all deepstream errors by subscribing to the error event ---' );
		
		var errorMsg = event + ': ' + msg;
		
		if( topic ) {
			errorMsg += ' (' + topic + ')';
		}

		throw new Error( errorMsg );
	}
};

Client.prototype._getOptions = function( options ) {
	var mergedOptions = {},
		key;

	for( key in defaultOptions ) {
		mergedOptions[ key ] = options[ key ] || defaultOptions[ key ];
	}

	return mergedOptions;
};

module.exports = function( url, options ) {
	return new Client( url, options );
};