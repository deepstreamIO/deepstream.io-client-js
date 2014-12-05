window.onload = function() {

	client = deepstream( 'localhost:6020' ).login({
		'username': 'Wolfram',
		'password': 'blah'
	}, function( success, errorEvent, message ){
		console.log( arguments );
	});
};