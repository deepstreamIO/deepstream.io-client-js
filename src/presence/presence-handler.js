'use strict';

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

PresenceHandler.prototype.getCurrentClients( callback ) {
	this._emitter.on( C.ACTIONS.QUERY, callback );
	this._presentClientsCallback = callback;
	this._ackTimeoutRegistry.add( C.ACTIONS.QUERY );
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.QUERY );
};

PresenceHandler.prototype.onClientLogin( callback ) {
	this._emitter.on( C.ACTIONS.PRESENCE_JOIN, callback );
	this._ackTimeoutRegistry.add( C.ACTIONS.PRESENCE_JOIN, C.ACTIONS.SUBSCRIBE );
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ C.ACTIONS.PRESENCE_JOIN ] );
};

PresenceHandler.prototype.onClientLogout( callback ) {
	this._emitter.on( C.ACTIONS.PRESENCE_LEAVE, callback );
	this._ackTimeoutRegistry.add( C.ACTIONS.PRESENCE_LEAVE, C.ACTIONS.SUBSCRIBE );
	this._connection.sendMsg( C.TOPIC.PRESENCE, C.ACTIONS.SUBSCRIBE, [ C.ACTIONS.PRESENCE_LEAVE ] );
};

PresenceHandler.prototype._$handle( message ) {
	if( message.action === C.ACTIONS.PRESENCE_JOIN ) {
		this._emitter.emit( C.ACTIONS.PRESENCE_JOIN, message.data );
	}
	else if( message.action === C.ACTIONS.PRESENCE_LEAVE ) {
		this._emitter.emit( C.ACTIONS.PRESENCE_LEAVE, message.data );
	}
	else if( message.action === C.ACTIONS.QUERY ) {
		this._emitter.emit( C.ACTIONS.QUERY, message.data );
	}
};

