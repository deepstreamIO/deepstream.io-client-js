/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'event permissions', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB,
		clientAErrors = [],
		clientBErrors = [];

	beforeEach(function(){
		clientAErrors = [];
		clientBErrors = [];
	});

	/**************** SETUP ****************/
	it( 'starts the server', function( done ){
		deepstreamServer = new DeepstreamServer( {
			showLogo: false,
			permission: {
				type: 'config',
				options: {
					path: './test-e2e/permissions-complex.json'
				}
			}
		} );
		deepstreamServer.on( 'started', done );
		deepstreamServer.set( 'logger', logger );
		deepstreamServer.set( 'showLogo', false );
		deepstreamServer.start();
	});

	it( 'creates clientA', function( done ) {
		clientA = deepstreamClient( 'localhost:6021' );
		clientA.on( 'error', function(){
			clientAErrors.push( arguments );
		});
		clientA.login({ username: 'client-a' }, function( success ){
			expect( success ).toBe( true );
			done();
		});
	});

	it( 'creates clientB', function( done ) {
		clientB = deepstreamClient( 'localhost:6021' );
		clientB.on( 'error', function(){
			clientBErrors.push( arguments );
		});
		clientB.login( { username: 'client-b' }, function( success ){
			expect( success ).toBe( true );
			done();
		});
	});

	/**************** TEST ****************/
	describe( 'permissions events', function(){

		it( 'subsribes and publishes an open event', function( done ){
			clientA.event.subscribe( 'open/some-event', function( data ){
				expect( data ).toEqual({ 'bla': 'blub' });
				done();
			});

			setTimeout(function(){
				clientB.event.emit( 'open/some-event', { 'bla': 'blub' });
			}, 30 );
		});

		it( 'prevents subscription and publishing of events', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			expect( clientBErrors.length ).toBe( 0 );

			clientA.event.subscribe( 'forbidden/some-event', function( data ){
				expect( 'it should never get here' ).toBe( true );
			});

			clientB.event.emit( 'forbidden/some-event', { 'bla': 'blub' });

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				expect( clientBErrors.length ).toBe( 1 );
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				expect( clientBErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 50 );
		});

		it( 'allows a to publish and b to subscribe', function( done ){
			clientB.event.subscribe( 'a-to-b/some-event', function( data ){
				expect( clientAErrors.length ).toBe( 0 );
				expect( clientBErrors.length ).toBe( 0 );
				expect( data ).toBe( 14 );
				done();
			});

			setTimeout(function(){
				clientA.event.emit( 'a-to-b/some-event', 14 );
			}, 30 );
		});

		it( 'prevents b from publishing and a from subscribing', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			expect( clientBErrors.length ).toBe( 0 );

			clientA.event.subscribe( 'a-to-b/some-other-event', function( data ){
				expect( 'it should never get here' ).toBe( true );
			});

			setTimeout(function(){
				clientB.event.emit( 'a-to-b/some-other-event', 14 );
			}, 30 );

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				expect( clientBErrors.length ).toBe( 1 );
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				expect( clientBErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 200 );
		});

		it( 'does not allow news about regular pigs', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.event.emit( 'news/regular-pigs' );

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 30 );
		});

		it( 'does allow news about tea cup pigs', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.event.emit( 'news/tea-cup-pigs' );

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 0 );
				done();
			}, 30 );
		});

		it( 'does not allow numbers < 10', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.event.emit( 'number', 5 );

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 30 );
		});

		it( 'does not allow numbers as strings', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.event.emit( 'number', '12' );

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 30 );
		});

		it( 'does allow numbers > 10', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.event.emit( 'number', 12 );

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 0 );
				done();
			}, 30 );
		});

		it( 'allows places in berlin', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.event.emit( 'place/berlin', { address: {
				city: 'Berlin'
			}});

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 0 );
				done();
			}, 30 );
		});

		it( 'allows places in berlin', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.event.emit( 'place/munich', { address: {
				city: 'Berlin'
			}});

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 30 );
		});
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
