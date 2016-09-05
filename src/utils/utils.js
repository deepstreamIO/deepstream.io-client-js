/**
 * A regular expression that matches whitespace on either side, but
 * not in the center of a string
 *
 * @type {RegExp}
 */
var TRIM_REGULAR_EXPRESSION = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/**
 * Used in typeof comparisons
 *
 * @type {String}
 */
var OBJECT = 'object';

/**
 * True if environment is node, false if it's a browser
 * This seems somewhat inelegant, if anyone knows a better solution,
 * let's change this (must identify browserify's pseudo node implementation though)
 *
 * @public
 * @type {Boolean}
 */
exports.isNode = typeof process !== 'undefined' && process.toString() === '[object process]';

/**
 * Provides as soon as possible async execution in a cross
 * platform way
 *
 * @param   {Function} fn the function to be executed in an asynchronous fashion
 *
 * @public
 * @returns {void}
 */
exports.nextTick = function( fn ) {
	if( exports.isNode ) {
		process.nextTick( fn );
	} else {
		setTimeout( fn, 0 );
	}
};

/**
 * Removes whitespace from the beginning and end of a string
 *
 * @param   {String} inputString
 *
 * @public
 * @returns {String} trimmedString
 */
exports.trim = function( inputString ) {
	if( inputString.trim ) {
		return inputString.trim();
	} else {
		return inputString.replace( TRIM_REGULAR_EXPRESSION, '' );
	}
};

/**
 * Compares two objects for deep (recoursive) equality
 *
 * This used to be a significantly more complex custom implementation,
 * but JSON.stringify has gotten so fast that it now outperforms the custom
 * way by a factor of 1.5 to 3.
 *
 * In IE11 / Edge the custom implementation is still slightly faster, but for
 * consistencies sake and the upsides of leaving edge-case handling to the native
 * browser / node implementation we'll go for JSON.stringify from here on.
 *
 * Please find performance test results here
 *
 * http://jsperf.com/deep-equals-code-vs-json
 *
 * @param   {Mixed} objA
 * @param   {Mixed} objB
 *
 * @public
 * @returns {Boolean} isEqual
 */
exports.deepEquals= function( objA, objB ) {
	if ( objA === objB ) {
		return true
	}
	else if( typeof objA !== OBJECT || typeof objB !== OBJECT ) {
		return false;
	}
	else {
		return JSON.stringify( objA ) === JSON.stringify( objB );
	}
};

/**
 * Similar to deepEquals above, tests have shown that JSON stringify outperforms any attempt of
 * a code based implementation by 50% - 100% whilst also handling edge-cases and keeping implementation
 * complexity low.
 *
 * If ES6/7 ever decides to implement deep copying natively (what happened to Object.clone? that was briefly
 * a thing...), let's switch it for the native implementation. For now though, even Object.assign({}, obj) only
 * provides a shallow copy.
 *
 * Please find performance test results backing these statements here:
 *
 * http://jsperf.com/object-deep-copy-assign
 *
 * @param   {Mixed} obj the object that should be cloned
 *
 * @public
 * @returns {Mixed} clone
 */
exports.deepCopy = function( obj ) {
	if( typeof obj === OBJECT ) {
		return JSON.parse( JSON.stringify( obj ) );
	} else {
		return obj;
	}
};

/**
 * Copy the top level of items, but do not copy its items recourisvely. This
 * is much quicker than deepCopy does not guarantee the object items are new/unique.
 * Mainly used to change the reference to the actual object itself, but not its children.
 *
 * @param   {Mixed} obj the object that should cloned
 *
 * @public
 * @returns {Mixed} clone
 */
exports.shallowCopy = function ( obj ) {
	if ( Array.isArray( obj ) ) {
		return obj.slice( 0 );
	}
	else if ( typeof obj === OBJECT ) {
		var copy = Object.create( null );
		var props = Object.keys( obj );
		for ( var i = 0; i < props.length; i++ ) {
			copy[ props[ i ] ] = obj[ props[ i ] ];
		}
	  return copy;
	}
	return obj;
}
