var client = require( '../src/client' )( 'localhost:6020' );

client.on( 'connectionStateChanged', function(){
	console.log( 'Connection state changed', client.getConnectionState() );
});

client.login({ username: 'Wolfram' });

if( process.argv[ 2 ] ) {
	client.event.emit( 'raven', 'nevermore' );
}

client.event.subscribe( 'raven', function( data ){
	console.log( 'received raven', data );
});