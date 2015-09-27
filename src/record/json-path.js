var utils = require( '../utils/utils' ),
	SPLIT_REG_EXP = /[\.\[\]]/g,
	ASTERISK = '*';

/**
 * This class allows to set or get specific
 * values within a json data structure using
 * string-based paths
 *
 * @param {Record} record
 * @param {String} path A path, e.g. users[2].firstname
 *
 * @constructor
 */
var JsonPath = function( record, path ) {
	this._record = record;
	this._path = String( path );
	this._tokens = [];

	this._tokenize();
};

/**
 * Returns the value of the path or
 * undefined if the path can't be resolved
 *
 * @public
 * @returns {Mixed}
 */
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

/**
 * Sets the value of the path. If the path (or parts
 * of it) doesn't exist yet, it will be created
 *
 * @param {Mixed} value
 *
 * @public
 * @returns {void}
 */
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

/**
 * Parses the path. Splits it into
 * keys for objects and indices for arrays.
 *
 * @private
 * @returns {void}
 */
JsonPath.prototype._tokenize = function() {
	var parts = this._path.split( SPLIT_REG_EXP ),
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

		if( part === ASTERISK ) {
			this._tokens.push( true );
			continue;
		}

		this._tokens.push( part );
	}
};

module.exports = JsonPath;