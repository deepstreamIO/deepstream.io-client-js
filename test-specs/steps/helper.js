var sinon = require( 'sinon' );

exports.check = function( type, expected, actual, callback, dontCallbackOnSuccess ) {
	if( sinon.deepEqual( expected, actual ) ) {
		if( dontCallbackOnSuccess !== true && callback ) {
			callback();
		}
		return;
	} else {
		var error = new Error( 'Expected ' + type + ' to be ' + JSON.stringify( expected ) + ', but it was ' + JSON.stringify( actual ) );
		if( callback ) {
			callback( error );
		} else {
			return error;
		}

	}
};