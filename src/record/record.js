var JsonPath = require( './json-path' ),
	utils = require( '../utils/utils' ),
	EventEmitter = require( 'component-emitter' ),
	C = require( '../constants/constants' ),
	messageBuilder = require( '../message/message-builder' ),
	ALL_EVENT = 'ALL_EVENT';

var Record = function( name, recordOptions, connection, options ) {
	this.name = name;
	this._recordOptions = recordOptions;
	this._connection = connection;
	this._options = options;
	this.isReady = false;
	this._$data = {};
	this._version = null;
	this._paths = {};
	this._oldPathValues = null;
	this._eventEmitter = new EventEmitter();
	this._readAckTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.ACK_TIMEOUT ), this._options.recordReadAckTimeout );
	this._readTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.RESPONSE_TIMEOUT ), this._options.recordReadTimeout );
	this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.CREATEORREAD, [ this.name ] );
};

EventEmitter( Record.prototype );

Record.prototype.get = function( path ) {
	var value;

	if( path ) {
		value = this._getPath( path ).getValue();
	} else {
		value = this._$data;
	}

	return utils.shallowCopy( value );
};

Record.prototype.set = function( pathOrData, data ) {
	if( !this.isReady ) {
		this.emit( 'error', 'Can\'t set record data for ' + this._name + '. Record not ready yet' );
		return;
	}

	this._beginChange();
	this._version++;

	if( arguments.length === 1 ) {
		this._$data = pathOrData;
		this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.UPDATE, [
			this.name, 
			this._version, 
			this._$data 
		]);
	} else {
		this._getPath( pathOrData ).setValue( data );
		this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.PATCH, [ 
			this.name, 
			this._version, 
			pathOrData, 
			messageBuilder.typed( data ) 
		]);
	}

	this._completeChange();
};

Record.prototype.subscribe = function( pathOrCallback, callback ) {
	var event = arguments.length === 2 ? pathOrCallback : ALL_EVENT;
	this._eventEmitter.on( event, callback );
};

Record.prototype.unsubscribe = function( pathOrCallback, callback ) {
	var event = arguments.length === 2 ? pathOrCallback : ALL_EVENT;
	this._eventEmitter.off( event, callback );
};

Record.prototype.delete = function() {

};

Record.prototype.discard = function() {

};

Record.prototype._$onMessage = function( message ) {
	if( message.action === C.ACTIONS.READ ) {
		this._clearTimeouts();
		this._onRead( message );
	}
	else if( message.action === C.ACTIONS.ACK && message.data[ 0 ] === C.ACTIONS.SUBSCRIBE ) {
		clearTimeout( this._readAckTimeout );
	}
};

Record.prototype._onRead = function( message ) {
	this._version = message.data[ 1 ];
	this._$data = message.data[ 2 ];
	this.isReady = true;
	this.emit( 'ready' );
};

Record.prototype._getPath = function( path ) {
	if( !this._paths[ path ] ) {
		this._paths[ path ] = new JsonPath( this, path );
	}

	return this._paths[ path ];
};

Record.prototype._beginChange = function() {
	// This is very specific to the implementation of component-emitter.
	if( !this._eventEmitter._callbacks ) {
		return;
	}

	var paths = Object.keys( this._eventEmitter._callbacks ),
		i;

	this._oldPathValues = {};

	for( i = 0; i < paths.length; i++ ) {
		this._oldPathValues[ paths[ i ] ] = this._getPath( paths[ i ] ).getValue();
	}
};

Record.prototype._completeChange = function() {
	this._eventEmitter.emit( ALL_EVENT );

	if( this._oldPathValues === null ) {
		return;
	}

	var path, currentValue;

	for( path in this._oldPathValues ) {
		currentValue = this._getPath( path ).getValue();

		if( currentValue !== this._oldPathValues[ path ] ) {
			this._eventEmitter.emit( path, currentValue );
		}
	}

	this._oldPathValues = null;
};

Record.prototype._clearTimeouts = function() {
	clearTimeout( this._readAckTimeout );
	clearTimeout( this._readTimeout );
};

Record.prototype._onTimeout = function( timeoutType ) {
	this._clearTimeouts();
	this.emit( 'error', timeoutType );
};

module.exports = Record;