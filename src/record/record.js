var JsonPath = require( './json-path' ),
	utils = require( '../utils/utils' );

var Record = function( name ) {
	this.name = name;
	this.isReady = false;
	this._data = null;
	this._paths = {};
};


Record.prototype.get = function( path ) {
	if( path ) {
		return this._getPath( path ).getValue();
	} else {
		return this._data;
	}
};

Record.prototype.set = function( pathOrData, data ) {
	if( arguments.length === 1 ) {
		this._data = pathOrData;
	} else {
		this._getPath( pathOrData ).setValue( data );
	}
	
};

Record.prototype.subscribe = function( path, callback ) {

};

Record.prototype.unsubscribe = function( path, callback ) {

};

Record.prototype.delete = function() {

};

Record.prototype.discard = function() {

};

Record.prototype._getPath = function( path ) {
	if( !this._paths[ path ] ) {
		this._paths[ path ] = new JsonPath( this._data, path );
	}

	return this._paths[ path ];
};