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
	var tokens = tokenize( path ),
		i;

	for( i = 0; i < tokens.length; i++ ) {
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
 * @returns old or new state
 */
module.exports.set = function( data, path, value, deepCopy ) {
	var i,
		tokens = tokenize( path );

	if ( deepCopy !== false ) {
		value = utils.deepCopy( value );
	}

	if ( tokens.length > 0 ) {
		data = utils.shallowCopy( data );

		var node = data;

		for( i = 0; i < tokens.length - 1; i++ ) {
			if( node[ tokens[ i ] ] !== undefined ) {
				node = node[ tokens[ i ] ] = utils.shallowCopy( node[ tokens[ i ] ] );
			}
			else if( tokens[ i + 1 ] && !isNaN( tokens[ i + 1 ] ) ){
				node = node[ tokens[ i ] ] = [];
			}
			else {
				node = node[ tokens[ i ] ] = {};
			}
		}

		node[ tokens[ i ] ] = value;
	}
	else {
		data = value;
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
	path = path ? path.toString() : undefined

	var tokens = cache[ path ];

	if ( tokens ) {
		return tokens;
	}

	tokens = [];

	var parts = path ? path.split( SPLIT_REG_EXP ) : [],
		tokens = [],
		part,
		i;

	for( i = 0; i < parts.length; i++ ) {
		part = utils.trim( parts[ i ] );

		if( part.length === 0 ) {
			continue;
		}

		if( !isNaN( part ) ) {
			tokens.push( parseInt( part, 10 ) );
			continue;
		}

		if( part === ASTERISK ) {
			tokens.push( true );
			continue;
		}

		tokens.push( part );
	}

	cache[ path ] = tokens;

	return tokens;
};
