var engineIoClient = require( 'engine.io-client'),
	messageParser = require( './message-parser' ),
	messageBuilder = require( './message-builder' ),
	C = require( '../constants/constants' );

var Connection = function( client, url, options ) {
	this._client = client;
	this._url = url;
	this._options = options;
	this._authParams = null;
	this._authCallback = null;

	this._state = C.CONNECTION_STATE.CLOSED;

	this._engineIo = engineIoClient( url, options );
	this._engineIo.on( 'open', this._onOpen.bind( this ) );
	this._engineIo.on( 'error', this._onError.bind( this ) );
	this._engineIo.on( 'close', this._onClose.bind( this ) );
	this._engineIo.on( 'message', this._onMessage.bind( this ) );
};

Connection.prototype.getState = function() {
	return this._state;
};

Connection.prototype.authenticate = function( authParams, callback ) {
	this._authParams = authParams;
	this._authCallback = callback;

	if( this._state === C.CONNECTION_STATE.AUTHENTICATING ) {
		this._sendAuthParams();
	}
};

Connection.prototype.send = function( message ) {

};

Connection.prototype._sendAuthParams = function() {
	var authMessage = messageBuilder.getMsg( C.TOPIC.AUTH, C.ACTIONS.REQUEST, [ this._authParams ] );
	this._engineIo.send( authMessage );
};

Connection.prototype._onOpen = function() {
	this._setState( C.CONNECTION_STATE.AUTHENTICATING );
	
	if( this._authParams ) {
		this._sendAuthParams();
	}
};

Connection.prototype._onError = function( error ) {
	this._setState( C.CONNECTION_STATE.ERROR );
	this._client._$onError( null, C.EVENT.CONNECTION_ERROR, error.toString() );
};

Connection.prototype._onClose = function() {
	this._setState( C.CONNECTION_STATE.CLOSED );
	//TODO Reconnection strategy & add flag if close was deliberately called
};

Connection.prototype._onMessage = function( message ) {
	var parsedMessages = messageParser.parse( message ),
		i;

	for( i = 0; i < parsedMessages.length; i++ ) {
		if( parsedMessages[ i ].topic === C.TOPIC.AUTH ) {
			this._handleAuthResponse( parsedMessages[ i ] );
		} else {
			this._client._$onMessage( parsedMessages[ i ] );
		}
	}
};

Connection.prototype._handleAuthResponse = function( message ) {
	if( message.action === C.ACTIONS.ERROR ) {
		if( this._authCallback ) {
			this._authCallback( false, message.data[ 0 ], message.data[ 1 ] );
		}
	} else if( message.action === C.ACTIONS.ACK ) {
		this._setState( C.CONNECTION_STATE.OPEN );
		
		if( this._authCallback ) {
			this._authCallback( true );
		}
	}
};

Connection.prototype._setState = function( state ) {
	this._state = state;
	this._client.emit( C.EVENT.CONNECTION_STATE_CHANGED, state );
};

module.exports = Connection;