var client = require( '../src/client' )( 'localhost:6021' );

client.on( 'connectionStateChanged', function(){
	console.log( 'Connection state changed', client.getConnectionState() );
});

client.login({ username: 'Wolfram' });
var rpcTimes = [],
	processed = 0;
var makeRpc = function() {
	console.time( 'totalRpcTime' );
	
	client.rpc.make( 'addTwo', { numA: 3, numB: 43 }, function( err, result ){
		console.timeEnd( 'totalRpcTime' );
	});
};

if( process.argv[ 2 ] === 'many' ) {
	setInterval(function(){
		makeRpc();
	}, 10 );
} else if( process.argv[ 2 ] === 'one' ) {
	setTimeout(makeRpc, 1000 );
} else {
	client.rpc.provide( 'addTwo', function( data, response ) {
		processed++;
		console.log( 'answering', processed );
		response.send( data.numA + data.numB + processed );	
	});
}

client.event.subscribe( 'raven', function( data ){
	console.log( 'received raven', data );
});