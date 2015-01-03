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

	if( objA === null || objB === null ) {
		return objA === objB;
	}

	if( typeof objA !== OBJECT || typeof objB !== OBJECT ) {
		return objA === objB;
	}

	next = function( _objA, _objB ) {
		if( _objA === null || _objB === null || typeof _objA !== OBJECT || typeof _objB !== OBJECT ) {
			isEqual = objA === objB;
			return;
		}

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
	
	if( isEqual ) {
		next( objB, objA );
	}
	
	return isEqual;
};

exports.shallowCopy = function( obj ) {
	if( typeof obj !== OBJECT ) {
		return obj;
	}

	var copy, i;

	if( obj instanceof Array ) {
		copy = [];

		for( i = 0; i < obj.length; i++ ) {
			copy[ i ] = obj[ i ];
		}
	} else {
		copy = {};

		for( i in obj ) {
			copy[ i ] = obj[ i ];
		}
	}

	return copy;
};