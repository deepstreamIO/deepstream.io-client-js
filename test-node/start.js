var client = require( '../src/client' )( 'localhost:6021' );

client.on( 'connectionStateChanged', function(){
	console.log( 'Connection state changed', client.getConnectionState() );
});

client.login({ username: 'Wolfram' });



var rpcTimes = [],
	processed = 0,
	lastError = 0;
var makeRpc = function() {
	console.time( 'totalRpcTime' );
	
	client.rpc.make( 'addTwo', { numA: 3, numB: 43 }, function( err, result ){
		console.timeEnd( 'totalRpcTime' );
	});
};

if( process.argv[ 2 ] === 'many' ) {
	setInterval(function(){
		makeRpc();
	}, 100 );
} else if( process.argv[ 2 ] === 'one' ) {
	setTimeout(makeRpc, 1000 );
} else if( process.argv[ 2 ] === 'burst' ) {
	var number = parseInt( process.argv[ 3 ], 10 );
	
	var results = 0;
	var inc = function( expected, err, result ){
		if( err && err !== lastError ){
			console.log( 'ERROR', arguments );
			lastError = err;
			return;
		}
		if( result !== 'X' + ( expected + 2 ) ) {
			console.log( 'expected ' + expected + ' but was ' + result );
			console.log( arguments );
		}
		results++;
		if( results === number ) {
			console.timeEnd( number + ' RPCs' );
		}

		
	};
	
	setTimeout(function() {
		console.log( 'making ' + number + ' rpcs' );
		console.time( number + ' RPCs' );
	    for( var i = 0; i < number; i++) {
			client.rpc.make( 'addTwo', { numA: i, numB: 2 }, inc.bind( this, i ) );
		}
	}, 1000 );

} else {
	client.rpc.provide( 'addTwo', function( data, response ) {
		processed++;
		//console.log( 'answering', processed );
		if( !data ) {
			console.log( 'Received invalid data for request ' + processed );
			response.send( null );
		} else {
			response.send( 'X' + ( data.numA + data.numB ) );	
		}
		
	});
}

