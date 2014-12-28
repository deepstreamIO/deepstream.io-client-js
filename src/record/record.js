var JsonPath = require( './json-path' ),
	utils = require( '../utils/utils' ),
	EventEmitter = require( 'component-emitter' ),
	ALL_EVENT = 'ALL_EVENT';

var Record = function( name, options, connection ) {
	this.name = name;
	this._options = options;
	this._connection = connection;
	this.isReady = false;
	this._$data = {};
	this._paths = {};
	this._oldPathValues = null;
	this._eventEmitter = new EventEmitter();
};

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
	this._beginChange();

	if( arguments.length === 1 ) {
		this._$data = pathOrData;
	} else {
		this._getPath( pathOrData ).setValue( data );
	}
	
	this._sendChange();
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

Record.prototype._getPath = function( path ) {
	if( !this._paths[ path ] ) {
		this._paths[ path ] = new JsonPath( this, path );
	}

	return this._paths[ path ];
};

Record.prototype._sendChange = function() {

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

module.exports = Record;