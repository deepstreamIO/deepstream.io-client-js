/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'event listener', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB,
		clientC;

	/**************** SETUP ****************/
	it( 'starts the server', function( done ){
		deepstreamServer = new DeepstreamServer();
		deepstreamServer.on( 'started', done );
		deepstreamServer.set( 'logger', logger );
		deepstreamServer.set( 'showLogo', false );
		deepstreamServer.start();
	});

	it( 'creates clientA', function( done ) {
		clientA = deepstreamClient( 'localhost:6021' );
		clientA.login( null, function(){ done(); });
		clientA.on( 'error', () => {})
	});

	it( 'creates clientB', function( done ) {
		clientB = deepstreamClient( 'localhost:6021' );
		clientB.login( null, function(){ done(); });
		clientB.on( 'error', () => {})
	});

	it( 'creates clientC', function( done ) {
		clientC = deepstreamClient( 'localhost:6021' );
		clientC.login( null, function(){ done(); });
		clientC.on( 'error', () => {})
	});

	 /**************** TEST ****************/
	it( 'listens for event subscriptions', function(done){
		var matches = [];

		clientA.event.listen( 'event\/[a-z0-9]', function( match, isSubscribed, response ) {
			response.accept();
			matches.push( match );
			if( matches.length === 2 ) {
				expect( matches.indexOf( 'event/matchespattern' ) ).not.toBe( -1 ) ;
				expect( matches.indexOf( 'event/some33' ) ).not.toBe( -1 );

				done();
			}
		});

		clientB.event.subscribe( 'event/matchespattern', function() {} );
		clientB.event.subscribe( 'event/DOES_NOT_MATCH', function() {} );
		clientC.event.subscribe( 'event/some33', function() {} );
	});

	it( 'listens, gets notified and unlistens', function(done) {
		var match;

		var callback = function( _match, isSubscribed, repsonse ){
			match = _match;
			repsonse.accept();
		};

		clientB.event.listen( 'a[0-9]', callback );
		// Might receive an unsolicited message error due to unlisten and subscribed happening at the same time
		clientB.on( 'error', function(){} );
		clientA.event.subscribe( 'a1', function() {} );
		clientA.event.subscribe( 'aa', function() {} );

		setTimeout(function(){
		   expect( match ).toBe( 'a1' );
		   clientB.event.unlisten( 'a[0-9]' );
		   clientA.event.subscribe( 'a2', function() {} );

		   setTimeout(function(){
			   expect( match ).toBe( 'a1' );
			   done();
		   }, 50 );
		}, 20 );
	});

	 /**************** TEAR DOWN ****************/
	it( 'closes the clients', function() {
		clientA.close();
		clientB.close();
	});

	it( 'shuts clients and server down', function(done) {
		deepstreamServer.on( 'stopped', done );
		deepstreamServer.stop();
	});
});
