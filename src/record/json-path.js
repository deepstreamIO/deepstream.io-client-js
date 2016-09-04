var utils = require( '../utils/utils' );
var PARTS_REG_EXP = /([^\.\[\]\s]+)/g;

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
		if ( data === undefined ) {
			return undefined;
		}
		if ( typeof data !== 'object' ) {
			throw new Error( 'invalid data or path' );
		}
		data = data[ tokens[ i ] ];
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
 * @returns {Mixed} updated value
 */
module.exports.set = function( data, path, value, deepCopy ) {
	var tokens = tokenize( path );

	if ( tokens.length === 0 ) {
		return patch( data, value, deepCopy );
	}

	var oldValue = module.exports.get( data, path, false );
	var newValue = patch( oldValue, value, deepCopy );

	if ( newValue === oldValue ) {
		return data;
	}

	var result = utils.shallowCopy( data );

	var node = result;
	for( var i = 0; i < tokens.length; i++ ) {
		if ( i === tokens.length - 1) {
			node[ tokens[ i ] ] = newValue;
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

	return result;
};

/**
 * Merge the new value into the old value
 * @param  {Mixed} oldValue
 * @param  {Mixed} newValue
 * @param  {boolean} deepCopy
 * @return {Mixed}
 */
function patch( oldValue, newValue, deepCopy ) {
	var i;

	if ( utils.deepEquals( oldValue, newValue ) ) {
		return oldValue;
	}
	else if ( Array.isArray( oldValue ) && Array.isArray( newValue ) ) {
		var arr = [];
		for ( i = 0; i < newValue.length; i++ ) {
			arr[ i ] = patch( oldValue[ i ], newValue[ i ], deepCopy );
		}
		return arr;
	}
	else if ( !Array.isArray( newValue ) && typeof oldValue === 'object' && typeof newValue === 'object' ) {
		var props = Object.keys( newValue );
		var obj = Object.create( null );
		for ( i = 0; i < props.length; i++ ) {
			obj[ props[ i ] ] = patch( oldValue[ props[ i ] ], newValue[ props[ i ] ], deepCopy );
		}
		return obj;
	}
	else {
		return deepCopy !== false ? utils.deepCopy( newValue ) : newValue;
	}
}

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

	var parts = String(path) !== 'undefined' ? String( path ).match(PARTS_REG_EXP) : [];

	if ( !parts ) {
		throw new Error('invalid path ' + path)
	}

	return cache[ path ] = parts.map( function( part ) {
		return !isNaN( part ) ? parseInt( part, 10 ) : part;
	} );
};
