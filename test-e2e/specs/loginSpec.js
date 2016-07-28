/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	C = require( '../../src/constants/constants' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'login', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB,
		authenticationHandler = {
			isValidUser: function( handshakeData, authData, callback ) {
				if( authData.username === 'validUserA' || authData.username === 'validUserB' ) {
					callback( true, {
						username: authData.username,
						clientData: 'test-data'
					});
				} else {
					callback( false, {
						clientData: 'Invalid user'
					});
				}
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
		deepstreamServer.set( 'authenticationHandler', authenticationHandler );
		deepstreamServer.set( 'unauthenticatedClientTimeout', 200 );
		deepstreamServer.start();
	});

	/**************** TESTS ****************/
	it( 'does not login in the expected time', function( done ) {
		clientA = deepstreamClient( 'localhost:6021' );
		clientA.once( 'error', function( data, event, topic ){
			expect( topic ).toBe( C.TOPIC.CONNECTION );
			expect( event ).toBe( C.EVENT.CONNECTION_AUTHENTICATION_TIMEOUT );
			done();
		});
	});

	it( 'can\'t login after connection times out', function( done ) {
		clientA.once( 'error', function( data, event, topic ){
			expect( topic ).toBe( C.TOPIC.ERROR );
			expect( event ).toBe( C.EVENT.IS_CLOSED );
			done();
		});
		clientA.login();
	});

	it( 'tries to log in with an invalid user', function( done ) {
		clientA = deepstreamClient( 'localhost:6021' );
		clientA.login({ username: 'Egon'}, function( success, data ){
			expect( success ).toBe( false );
			expect( data ).toBe( 'Invalid user' );
			done();
		});
	});

	it( 'tries to log in a second time and exceeds maxAuthAttempts', function(done) {
		var firstcall = true;

		clientA.login({ username: 'Egon'}, function( success, data ){
			if( firstcall ) {
				expect( success ).toBe( false );
				expect( data ).toBe( 'Invalid user' );
				firstcall = false;
			} else {
				expect( success ).toBe( false );
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

		clientA.login({ username: 'Egon'}, function( success, data ){
			expect( this ).toBe( 'never called' );
		});
	});

	it( 'recreates the client and logs in successfully', function( done ){
		clientA = deepstreamClient( 'localhost:6021' );
		clientA.on( 'error', function(){
			console.log( 'clientA error', arguments );
		})
		clientA.login({ username: 'validUserA'}, function( success, data ){
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