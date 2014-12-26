exports.isNode = function() {
	return typeof process !== 'undefined' && process.toString() === '[object process]';
};

exports.nextTick = function( fn ) {
	if( exports.isNode() ) {
		process.nextTick( fn );
	} else {
		setTimeout( fn, 0 );
	}
};

exports.trim = function( inputString ) {
	if( inputString.trim ) {
		return inputString.trim();
	} else {
		return inputString.replace( trimRegExp, '' );
	}
};

var trimRegExp = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

var OBJECT = 'object';

exports.deepEquals = function( objA, objB ) {
	var isEqual = true, 
		next;

	if( typeof objA !== OBJECT ) {
		return objA === objB;
	}

	next = function( _objA, _objB ) {
		for( var key in _objA ) {
			if( typeof _objA[ key ] === OBJECT ) {
				next( _objA[ key ], _objB[ key ] );
			} else if( _objA[ key ] !== _objB[ key ] ) {
				isEqual = false;
				return;
			}
		}
	};

	next( objA, objB );

	return isEqual;
};