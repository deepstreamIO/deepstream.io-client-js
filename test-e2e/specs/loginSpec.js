/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'login', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB,
		permissionHandler = {
			isValidUser: function( handshakeData, authData, callback ) {
				if( authData.username === 'validUserA' || authData.username === 'validUserB' ) {
					callback( null, authData.username, 'test-data' );
				} else {
					callback( 'Invalid user' );
				}
			},

			canPerformAction: function( username, message, callback ) {
				callback( null, true );
			},
			isReady: true
		};

	/**************** SETUP ****************/
	it( 'starts the server', function( done ){
		deepstreamServer = new DeepstreamServer();
		deepstreamServer.on( 'started', done );
		deepstreamServer.set( 'logger', logger );
		deepstreamServer.set( 'showLogo', false );
		deepstreamServer.set( 'maxAuthAttempts', 2 );
		deepstreamServer.set( 'permissionConfigPath', './test-e2e/permissions.json' );
		deepstreamServer.set( 'permissionHandler', permissionHandler );
		deepstreamServer.start();
	});

	/**************** TESTS ****************/
	it( 'tries to log in with an invalid user', function( done ) {
		clientA = deepstreamClient( 'localhost:6021' );
		clientA.login({ username: 'Egon'}, function( success, event, data ){
			expect( success ).toBe( false );
			expect( event ).toBe( 'INVALID_AUTH_DATA' );
			expect( data ).toBe( 'Invalid user' );
			done();
		});
	});

	it( 'tries to log in a second time and exceeds maxAuthAttempts', function(done) {
		var firstcall = true;

		clientA.login({ username: 'Egon'}, function( success, event, data ){
			if( firstcall ) {
				expect( success ).toBe( false );
				expect( event ).toBe( 'INVALID_AUTH_DATA' );
				expect( data ).toBe( 'Invalid user' );
				firstcall = false;
			} else {
				expect( success ).toBe( false );
				expect( event ).toBe( 'TOO_MANY_AUTH_ATTEMPTS' );
				expect( data ).toBe( 'too many authentication attempts' );
				done();
			}
		});
	});

	it( 'tries to log in again after the client has been kicked', function(done) {
		clientA.on( 'error', function( data, event, topic ){
			expect( topic ).toBe( 'X' );
			expect( event ).toBe( 'IS_CLOSED' );
			done();
		});

		clientA.login({ username: 'Egon'}, function( success, event, data ){
			expect( this ).toBe( 'never called' );
		});
	});

	it( 'recreates the client and logs in successfully', function( done ){
		clientA = deepstreamClient( 'localhost:6021' );
		clientA.on( 'error', function(){
			console.log( 'clientA error', arguments );
		})
		clientA.login({ username: 'validUserA'}, function( success, event, data ){
			expect( success ).toBe( true );
			expect( data ).toBe( 'test-data' )
			done();
		});
	});

	 /**************** TEAR DOWN ****************/
	it( 'closes the clients', function() {
		clientA.close();
		//clientB.close();
	});

	it( 'shuts clients and server down', function(done) {
		deepstreamServer.on( 'stopped', done );
		deepstreamServer.stop();
	});
});