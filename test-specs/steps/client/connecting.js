var deepstream = require( '../../../src/client' );
var config = require( '../config' );
var check = require( '../helper' ).check;
var lastAuthArgs;

var errors;
var catchError;

module.exports = function() {
	this.Before( function( scenario ) {
		errors = [];
		catchError = false;
	});

	this.After( function( scenario ) {
		if( !catchError && errors.length > 0 ) {
			throw 'Unexpected error occured during scenario. Errors: ' + JSON.stringify( errors );
		}
	});

	this.Given( /^the client is initialised$/, function( callback ){
		if( global.dsClient ) {
			global.dsClient.close();
			global.dsClient.removeListener( 'error' );
		}
		global.dsClient = deepstream( config.testServerHost + ':' + config.testServerPort, {
			subscriptionTimeout: 100,
			recordReadAckTimeout: 200,
			recordReadTimeout: 260,
			recordDeleteTimeout: 100,
			rpcResponseTimeout: 200
		});
		global.dsClient.on( 'error', function(){
			errors.push( arguments );
		});
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When( /^some time passes$/, function( callback ){
		setTimeout( callback, 200 );
	});

	this.When( /^two seconds later$/, function( callback ){
		setTimeout( callback, 2000 );
	});

	this.When( /^the client logs in with username "(\w*)" and password "(\w*)"$/, function( username, password, callback ){
		global.dsClient.login({ username: username, password: password }, function(){
			lastAuthArgs = arguments;
		});
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.Then( /^the last login was successful$/, function( callback ){
		check( 'last login result', true, lastAuthArgs[ 0 ], callback );
	});

	this.Then( /^the clients connection state is "(\w*)"$/, function( connectionState, callback ){
		check( 'connectionState', connectionState, global.dsClient.getConnectionState(), callback );
	});

	this.Then( /^the client throws a "(\w*)" error with message "(.*)"$/, function( error, errorMessage, callback ){
		catchError = true;
		var lastErrorArgs = errors[ errors.length - 1 ];

		if( errors.length === 0 ) {
			callback( 'No errors were thrown' );
			return;
		}

		var error = check( 'last error', error, lastErrorArgs[ 1 ] );
		var errorMessage = check( 'last error message', errorMessage, lastErrorArgs[ 0 ] );
		if( error || errorMessage ) {
			callback( error + ' ' + errorMessage );
			return;
		}

		callback();
	});

	this.Then( /^the last login failed with error message "(.*)"$/, function( errorMessage, callback ){
		catchError = true;
		//check( 'last auth error', error, lastAuthArgs[ 1 ], callback, true );
		check( 'last auth error message', errorMessage, lastAuthArgs[ 1 ], callback );
	});
};