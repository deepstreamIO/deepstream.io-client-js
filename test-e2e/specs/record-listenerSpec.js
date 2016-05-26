/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'record listener', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB;

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
	});

	it( 'creates clientB', function( done ) {
		clientB = deepstreamClient( 'localhost:6021' );
		clientB.login( null, function(){ done(); });
	});

	it( 'waits', function( done ){
		setTimeout( done, 40 );
	});
	 /**************** TEST ****************/
	it( 'listens for record subscriptions', function(done){
		var matches = [];

		clientA.record.listen( 'user\/[a-z0-9]', function( match ){
			matches.push( match );

			if( matches.length === 2 ) {
				expect( matches.indexOf( 'user/matchespattern' ) ).not.toBe( -1 ) ;
				expect( matches.indexOf( 'user/some33' ) ).not.toBe( -1 );
				done();
			}
		});

		clientB.record.getRecord( 'user/matchespattern' );
		clientB.record.getRecord( 'user/doesNotMatch' );
		clientA.record.getRecord( 'user/some33' );
	});

	it( 'listens, gets notified and unlistens', function(done) {
		var match;

		var callback = function( _match ){
			match = _match;
		};

		clientB.record.listen( 'a[0-9]', callback );
		// Might receive an unsolicited message error due to unlisten and getRecord happening at the same time
		clientB.on( 'error', function(){} );
		clientA.record.getRecord( 'a1' );
		clientA.record.getRecord( 'aa' );

		setTimeout(function(){
			expect( match ).toBe( 'a1' );
			clientB.record.unlisten( 'a[0-9]' );
			clientA.record.getRecord( 'a2' );

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