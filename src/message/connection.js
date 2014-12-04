var engineIoClient = require( 'engine.io-client'),
	messageParser = require( './message-parser' ),
	messageBuilder = require( './message-builder' ),
	C = require( '../constants/constants' );

var Connection = function( client, url, options, authParams ) {
	this._client = client;
	this._url = url;
	this._options = options;
	this._authParams = authParams;
	this._state = C.CONNECTION_STATE.CLOSED;

	this._engineIo = engineIoClient( url, options );
	this._engineIo.on( 'open', this._onOpen.bind( this ) );
	this._engineIo.on( 'error', this._onError.bind( this ) );
	this._engineIo.on( 'close', this._onClose.bind( this ) );
	this._engineIo.on( 'message', this._onMessage.bind( this ) );
};

Connection.prototype._onOpen = function() {
	this._state = C.CONNECTION_STATE.AUTHENTICATING;
	this._client.emit( C.CONNECTION_STATE.AUTHENTICATING );
	var authMessage = messageBuilder.getMsg( C.TOPIC.AUTH, C.ACTIONS.REQUEST, [ this._authParams ] );
	this._engineIo.send( authMessage );
};

Connection.prototype._onError = function() {
	console.log( 'error', arguments );
};

Connection.prototype._onClose = function() {
	console.log( 'close', arguments );
};

Connection.prototype._onMessage = function() {
	console.log( 'message', arguments );
};

module.exports = Connection;