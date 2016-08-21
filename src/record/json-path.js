var utils = require( '../utils/utils' ),
	SPLIT_REG_EXP = /[\.\[\]]/g,
	ASTERISK = '*';

var cache = Object.create( null );

/**
 * Returns the value of the path or
 * undefined if the path can't be resolved
 *
 * @public
 * @returns {Mixed}
 */
module.exports.get = function ( data, path, deepCopy ) {
	var tokens = tokenize( path );

	for( var i = 0; i < tokens.length; i++ ) {
		if( data[ tokens[ i ] ] !== undefined ) {
			data = data[ tokens[ i ] ];
		} else {
			return undefined;
		}
	}

	return deepCopy !== false ? utils.deepCopy( data ) : data;
};

/**
 * Sets the value of the path. If the path (or parts
 * of it) doesn't exist yet, it will be created
 *
 * @param {Mixed} value
 *
 * @public
 * @returns updated value
 */
module.exports.set = function( data, path, value, deepCopy ) {
	var tokens = tokenize( path );

	if ( deepCopy !== false ) {
		value = utils.deepCopy( value );
	}

	if ( tokens.length === 0 ) {
		return value;
	}

	data = utils.shallowCopy( data );

	var node = data;
	for( var i = 0; i < tokens.length; i++ ) {
		if ( i === tokens.length - 1) {
			node[ tokens[ i ] ] = value;
		}
		else if( node[ tokens[ i ] ] !== undefined ) {
			node = node[ tokens[ i ] ] = utils.shallowCopy( node[ tokens[ i ] ] );
		}
		else if( tokens[ i + 1 ] && !isNaN( tokens[ i + 1 ] ) ){
			node = node[ tokens[ i ] ] = [];
		}
		else {
			node = node[ tokens[ i ] ] = Object.create( null );
		}
	}

	return data;
};

/**
 * Parses the path. Splits it into
 * keys for objects and indices for arrays.
 *
 * @returns Array of tokens
 */
function tokenize( path ) {
	if ( cache[ path ] ) {
		return cache[ path ];
	}

	var parts = path !== undefined
		? path.toString().replace(/\s/g, '').split( SPLIT_REG_EXP )
		: [];

	var tokens = [];

	for( var i = 0; i < parts.length; i++ ) {
		if( parts[ i ].length === 0 ) {
			continue;
		}

		if( !isNaN( parts[ i ] ) ) {
			tokens.push( parseInt( parts[ i ], 10 ) );
			continue;
		}

		if( parts[ i ] === ASTERISK ) {
			tokens.push( true );
			continue;
		}

		tokens.push( parts[ i ] );
	}

	return cache[ path ] = tokens;
};
