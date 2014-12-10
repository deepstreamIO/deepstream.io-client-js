var client = require( '../src/client' )( 'localhost:6020' );

client.on( 'connectionStateChanged', function(){
	console.log( 'Connection state changed', client.getConnectionState() );
});

client.login({ username: 'Wolfram' });

var makeRpc = function() {
	console.log( client.transport );
	console.time( 'makeRpc' );
	client.rpc.make( 'addTwo', { numA: 3, numB: 43 }, function( err, result ){
		console.timeEnd( 'makeRpc' );
	});
};
if( process.argv[ 2 ] === 'many' ) {
	setInterval(function(){
		makeRpc();
	}, 100 );
	
} else if( process.argv[ 2 ] === 'one' ) {
	makeRpc();
} else {
	client.rpc.provide( 'addTwo', function( data, response ) {
		data = JSON.parse( data );
		response.send( data.numA + data.numB );	
	});
}

client.event.subscribe( 'raven', function( data ){
	console.log( 'received raven', data );
});