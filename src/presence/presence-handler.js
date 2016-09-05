var EventEmitter = require( 'component-emitter' ),
	C = require( '../constants/constants' ),
	AckTimeoutRegistry = require( '../utils/ack-timeout-registry' ),
	messageParser = require( '../message/message-parser' ),
	messageBuilder = require( '../message/message-builder' );

var PresenceHandler = function( options, connection, client ) {
		this._options = options;
		this._connection = connection;
		this._client = client;
		this._emitter = new EventEmitter();
		this._ackTimeoutRegistry = new AckTimeoutRegistry( client, C.TOPIC.PRESENCE, this._options.subscriptionTimeout );
};

PresenceHandler.prototype.getCurrentClients = function( callback ) {
	this._emitter.on( C.ACTIONS.QUERY, callback );
	this._ackTimeoutRegistry.add( C.ACTIONS.QUERY );
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.QUERY );
	return this;
};

PresenceHandler.prototype.onClientLogin = function( callback ) {
	this._emitter.on( C.ACTIONS.PRESENCE_JOIN, callback );
	this._ackTimeoutRegistry.add( C.ACTIONS.PRESENCE_JOIN, C.ACTIONS.SUBSCRIBE );
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ C.ACTIONS.PRESENCE_JOIN ] );
};

PresenceHandler.prototype.onClientLogout = function( callback ) {
	this._emitter.on( C.ACTIONS.PRESENCE_LEAVE, callback );
	this._ackTimeoutRegistry.add( C.ACTIONS.PRESENCE_LEAVE, C.ACTIONS.SUBSCRIBE );
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ C.ACTIONS.PRESENCE_LEAVE ] );
};

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