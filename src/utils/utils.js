exports.isNode = function() {
	return typeof process !== 'undefined' && process.version;
};

exports.nextTick = function( fn ) {
	if( exports.isNode() ) {
		process.nextTick( fn );
	} else {
		setTimeout( fn, 0 );
	}
};