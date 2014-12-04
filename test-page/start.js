window.onload = function() {
	client = deepstream( 'localhost:6020' );
	client.connect({
		'username': 'Wolfram',
		'password': 'blah'
	});
};