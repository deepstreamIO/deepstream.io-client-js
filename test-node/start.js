var client = require( '../src/client' )( 'localhost:6021' );

client.on( 'connectionStateChanged', function(){
	console.log( 'Connection state changed', client.getConnectionState() );
});

client.login({ username: 'Wolfram' });

var makeRpc = function() {
	console.time( 'totalRpcTime' );
	console.time( 'rpcStart' );
	
	client.rpc.make( 'addTwo', { numA: 3, numB: 43 }, function( err, result ){
		console.timeEnd( 'totalRpcTime' );
	});
};
if( process.argv[ 2 ] === 'many' ) {
	setInterval(function(){
		makeRpc();
	}, 1000 );
	
} else if( process.argv[ 2 ] === 'one' ) {
	setTimeout(makeRpc, 1000 );
} else {
	client.rpc.provide( 'addTwo', function( data, response ) {
		data = JSON.parse( data );
		response.send( data.numA + data.numB );	
	});
}

client.event.subscribe( 'raven', function( data ){
	console.log( 'received raven', data );
});