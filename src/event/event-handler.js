var messageBuilder = require( '../message/message-builder' ),
	C = require( '../constants/constants' ),
	EventEmitter = require( 'component-emitter' );

var EventHandler = function( options, connection ) {
	this._options = options;
	this._connection = connection;
	this._emitter = new EventEmitter();
};

EventHandler.prototype.subscribe = function( eventName, callback ) {
	if( !this._emitter.hasListeners( eventName ) ) {
		this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.SUBSCRIBE, [ eventName ] );
	}

	this._emitter.on( eventName, callback );
};

EventHandler.prototype.unsubscribe = function( eventName, callback ) {
	this._emitter.off( eventName, callback );
	
	if( !this._emitter.hasListeners( eventName ) ) {
		this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.UNSUBSCRIBE, [ eventName ] );
	}
};

EventHandler.prototype.emit = function( name, data ) {
	this._connection.sendMsg( C.TOPIC.EVENT, C.ACTIONS.EVENT, [ name, data ] );
	this._emitter.emit( name, data );
};

EventHandler.prototype._$handle = function( message ) {
	if( message.action === C.ACTIONS.EVENT ) {
		if( message.data && message.data.length === 2 ) {
			this._emitter.emit( message.data[ 0 ], message.data[ 1 ] );
		} else {
			this._emitter.emit( message.data[ 0 ] );
		}
		
	}
};

module.exports = EventHandler;