/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'rpc permissions', function() {
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
	describe( 'permissions open rpcs', function(){
		it( 'provides a rpc', function( done ){
			clientA.rpc.provide( 'double', function( data, response ){
				response.send( data * 2 );
			});
			setTimeout( done, 20 );
		});

		it( 'makes a rpc', function( done ){
			clientB.rpc.make( 'double', 7, function( err, result ){
				expect( clientAErrors.length ).toBe( 0 );
				expect( clientBErrors.length ).toBe( 0 );
				expect( err ).toBe( null );
				expect( result ).toBe( 14 );
				done();
			});
		});
	});


	describe( 'only allows a to provide and b to request', function(){
		it( 'provides a rpc', function( done ){
			clientA.rpc.provide( 'a-provide-b-request', function( data, response ){
				response.send( data * 3 );
			});
			setTimeout( done, 20 );
		});

		it( 'makes a rpc', function( done ){
			clientB.rpc.make( 'a-provide-b-request', 7, function( err, result ){
				expect( clientAErrors.length ).toBe( 0 );
				expect( clientBErrors.length ).toBe( 0 );
				expect( result ).toBe( 21 );
				done();
			});
		});

		it( 'cant provide rpc', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			expect( clientBErrors.length ).toBe( 0 );

			clientB.rpc.provide( 'a-provide-b-request', function( data, response ){
				response.send( data * 3 );
			});

			setTimeout( function(){
				expect( clientAErrors.length ).toBe( 0 );
				expect( clientBErrors.length ).toBe( 1 );
				//TODO order is muddled up, should be [ 0 ][ 1 ]
				expect( clientBErrors[ 0 ][ 0 ] ).toEqual(  [ 'MESSAGE_DENIED', 'a-provide-b-request', 'S' ] );
				done();
			}, 40 );
		});

		it( 'cant make rpc', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			expect( clientBErrors.length ).toBe( 0 );

			clientA.rpc.make( 'a-provide-b-request', 11, function( error, result ){
				expect( error ).toBe( 'MESSAGE_DENIED' );
				done();
			});
		});
	});

	describe( 'only allow rpcs with full data', function(){
		var reachedProvider = false;

		it( 'provides the rpc', function( done ){
			clientA.rpc.provide( 'only-full-user-data', function( data, response ){
				reachedProvider = true;
				response.send( 'ok' );
			});

			setTimeout( done, 30 );
		});

		it( 'makes the rpc without data', function( done ){
			clientB.rpc.make( 'only-full-user-data', null, function( error, result ){
				expect( 'it should never get here' ).toBe( true );
				done();
			});
			setTimeout( function(){
				expect( clientAErrors.length ).toBe( 0 );
				expect( clientBErrors.length ).toBe( 1 );
				expect( clientBErrors[ 0 ][ 0 ][ 0 ] ).toBe( 'MESSAGE_PERMISSION_ERROR' );
				expect( clientBErrors[ 0 ][ 0 ][ 1 ] ).toBe( 'only-full-user-data' );
				expect( clientBErrors[ 0 ][ 0 ][ 2 ] ).toBe( 'REQ' );
				// Number 3 is correlation id, which is random
				expect( clientBErrors[ 0 ][ 0 ][ 4 ] ).toBe( 'L' );
				done();
			}, 100 );
		});

		it( 'makes the rpc with incomplete data', function( done ){
			clientB.rpc.make( 'only-full-user-data', { firstname: 'Wolfram' }, function( error, result ){
				expect( error ).toBe( 'MESSAGE_DENIED' );
				expect( result ).toBe( undefined );
				expect( reachedProvider ).toBe( false );
				done();
			});
		});

		it( 'successfully makes the rpc with complete data', function( done ){
			clientB.rpc.make( 'only-full-user-data', { firstname: 'Wolfram', lastname: 'Hempel' }, function( error, result ){
				expect( error ).toBe( null );
				expect( result ).toBe( 'ok' );
				expect( reachedProvider ).toBe( true );
				done();
			});
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
