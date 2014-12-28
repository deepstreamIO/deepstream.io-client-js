var utils = require( '../utils/utils' );

var JsonPath = function( record, path ) {
	this._record = record;
	this._path = path;
	this._tokens = [];

	this._tokenize();
};

JsonPath.prototype._splitRegExp = /[\.\[\]]/g;
JsonPath.prototype._asterisk = '*';

JsonPath.prototype.getValue = function() {
	var node = this._record._$data,
		i;

	for( i = 0; i < this._tokens.length; i++ ) {
		if( node[ this._tokens[ i ] ] !== undefined ) {
			node = node[ this._tokens[ i ] ];
		} else {
			return undefined;
		}
	}

	return node;
};

JsonPath.prototype.setValue = function( value ) {
	var node = this._record._$data,
		i;


	for( i = 0; i < this._tokens.length - 1; i++ ) {
		if( node[ this._tokens[ i ] ] !== undefined ) {
			node = node[ this._tokens[ i ] ];
		}
		else if( this._tokens[ i + 1 ] && !isNaN( this._tokens[ i + 1 ] ) ){
			node = node[ this._tokens[ i ] ] = [];
		}
		else {
			node = node[ this._tokens[ i ] ] = {};
		}
	}

	node[ this._tokens[ i ] ] = value;
};

JsonPath.prototype._tokenize = function() {
	var parts = this._path.split( this._splitRegExp ),
		part,
		i;

	for( i = 0; i < parts.length; i++ ) {
		part = utils.trim( parts[ i ] );

		if( part.length === 0 ) {
			continue;
		}

		if( !isNaN( part ) ) {
			this._tokens.push( parseInt( part, 10 ) );
			continue;
		}

		if( part === this._asterisk ) {
			this._tokens.push( true );
			continue;
		}

		this._tokens.push( part );
	}
};

module.exports = JsonPath;