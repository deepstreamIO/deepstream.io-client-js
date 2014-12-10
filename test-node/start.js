var client = require( '../src/client' )( 'localhost:6020' );

client.on( 'connectionStateChanged', function(){
	console.log( 'Connection state changed', client.getConnectionState() );
});

client.login({ username: 'Wolfram' });

if( process.argv[ 2 ] ) {
	setInterval(function(){
		console.time( 'makeRpc' );
		client.rpc.make( 'addTwo', { numA: 3, numB: 43 }, function( err, result ){
			console.timeEnd( 'makeRpc' );
		});
	}, 100 );
	
} else {
	client.rpc.provide( 'addTwo', function( data, response ) {
		data = JSON.parse( data );
		response.send( data.numA + data.numB );	
	});
}

client.event.subscribe( 'raven', function( data ){
	console.log( 'received raven', data );
});