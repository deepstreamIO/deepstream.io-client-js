var JsonPath = require( './json-path' ),
	utils = require( '../utils/utils' ),
	EventEmitter = require( 'component-emitter' ),
	C = require( '../constants/constants' ),
	messageBuilder = require( '../message/message-builder' ),
	messageParser = require( '../message/message-parser' ),
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
	
	if( arguments.length === 2 ) {
		if( utils.deepEquals( this._getPath( pathOrData ).getValue(), data ) ) {
			return;
		}
	} else {
		if( utils.deepEquals( this._$data, pathOrData ) ) {
			return;
		}
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

Record.prototype.subscribe = function( pathOrCallback, callback, triggerNow ) {
	var i, args = {};


	for( i = 0; i < arguments.length; i++ ) {
		if( typeof arguments[ i ] === 'string' ) {
			args.path = arguments[ i ];
		}
		else if( typeof arguments[ i ] === 'function' ) {
			args.callback = arguments[ i ];
		}
		else if( typeof arguments[ i ] === 'boolean' ) {
			args.triggerNow = arguments[ i ];
		}
	}

	this._eventEmitter.on( args.path || ALL_EVENT, callback );

	if( args.triggerNow ) {
		if( args.path ) {
			callback( this._getPath( args.path ).getValue() );
		} else {
			callback( this._$data );
		}
	}
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
	else if( message.action === C.ACTIONS.UPDATE || message.action === C.ACTIONS.PATCH ) {
		this._applyUpdate( message );
	}
};

Record.prototype._applyUpdate = function( message ) {
	var version = parseInt( message.data[ 1 ], 10 );

	if( this._version + 1 !== version ) {
		//TODO - handle gracefully and retry / merge
		this.emit( 'error', 'received update for ' + version + ' but version is ' + this._version );
	}
	this._beginChange();
	this._version = version;

	if( message.action === C.ACTIONS.UPDATE ) {
		this._$data = JSON.parse( message.data[ 2 ] );
	} else {
		this._getPath( message.data[ 2 ] ).setValue( messageParser.convertTyped( message.data[ 3 ] ) );
	}

	this._completeChange();
};

Record.prototype._onRead = function( message ) {
	this._beginChange();
	this._version = parseInt( message.data[ 1 ], 10 );
	this._$data = JSON.parse( message.data[ 2 ] );
	this.isReady = true;
	this.emit( 'ready' );
	this._completeChange();
};

Record.prototype._getPath = function( path ) {
	if( !this._paths[ path ] ) {
		this._paths[ path ] = new JsonPath( this, path );
	}

	return this._paths[ path ];
};

Record.prototype._beginChange = function() {
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