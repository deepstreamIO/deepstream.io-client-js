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