/* global describe, it, expect, jasmine */
var DeepstreamServer = require( '../../../deepstream.io/src/deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'presence', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		callback = jasmine.createSpy( 'presenceCallback' ),
		clientA, aCreds = { username: "Homer" },
		clientB, bCreds = { username: "Marge" },
		clientC, cCreds = { username: "Bart" },
		clientD;

	/**************** SETUP ****************/
	it( 'starts the server', function( done ){
		deepstreamServer = new DeepstreamServer();
		deepstreamServer.on( 'started', done );
		deepstreamServer.set( 'logger', logger );
		deepstreamServer.set( 'showLogo', false );
		deepstreamServer.start();
	});

	it( 'creates a client', function( done ) {
		clientA = deepstreamClient( 'localhost:6021' );
		clientA.login( aCreds, function(){ done(); });
	});

	/**************** TEST *****************/
	it( 'subscribes to login events', function() {
		clientA.onClientLogin( callback );
		expect( callback ).not.toHaveBeenCalled();
	});

	it( 'client with no username logs in', function( done ){
		clientD = deepstreamClient( 'localhost:6021' );
		clientD.login( null, function(){ 
			setTimeout( function() {
				expect( callback ).not.toHaveBeenCalled();
				done();
			}, 0);
		});
	});

	it( 'another client logs in', function( done ){
		clientB = deepstreamClient( 'localhost:6021' );
		clientB.login( bCreds, function(){ 
			setTimeout( function() {
				expect( callback ).toHaveBeenCalledWith( 'Marge' );
				done();
			}, 0);
		});
		
	});

	it( 'subscribes to logout events', function() {
		callback.calls.reset();
		clientA.onClientLogout( callback );
		expect( callback ).not.toHaveBeenCalled();
	});

	it( 'client is notified of logout', function( done ){
		clientB.close();
		setTimeout(function() {
			expect( callback ).toHaveBeenCalledWith( 'Marge' );
			done();
		}, 0);
		
	});

	it( 'clientC logs in', function( done ) {
		clientC = deepstreamClient( 'localhost:6021' );
		clientC.login( cCreds, function(){ done(); });
	});

	it( 'queries for clients logged in with usernames', function() {
		clientA.getCurrentClients( callback );
		setTimeout(function() {
			expect( callback ).toHaveBeenCalledWith( [ 'Homer', 'Bart' ] );
		}, 250);
	});
	

	 /**************** TEAR DOWN ****************/
	it( 'closes the clients', function() {
		clientA.close();
		clientC.close();
		clientD.close();
	});

	it( 'shuts clients and server down', function(done) {
		deepstreamServer.on( 'stopped', done );
		deepstreamServer.stop();
	});
});