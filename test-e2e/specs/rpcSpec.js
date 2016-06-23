/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
		deepstreamClient = require( '../../src/client' ),
		TestLogger = require( '../tools/test-logger' );

describe( 'rpc', function() {
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
	});

	it( 'creates clientB', function( done ) {
			clientB = deepstreamClient( 'localhost:6021' );
			clientB.login( null, function(){ done(); });
	});

	it( 'creates clientC', function( done ) {
			clientC = deepstreamClient( 'localhost:6021' );
			clientC.login( null, function(){ done(); });
	});

	 /**************** TEST ****************/
	it( 'provides and calls an rpc', function(done) {
		 clientA.rpc.provide( 'addTwo', function( data, response ){
				 response.send( data.numA + data.numB );
		 });

		 clientB.rpc.make( 'addTwo', { numA: 3, numB: 7 }, function( error, response ){
				 expect( response ).toBe( 10 );
				 done();
		 });
	});

	it( 'rejects an rpc and is the only provider', function(done) {
		 clientA.rpc.provide( 'wontWork', function( data, response ){
				 response.reject();
		 });

		 clientB.rpc.make( 'wontWork', { numA: 3, numB: 7 }, function( error, response ){
				 expect( error ).toBe( 'NO_RPC_PROVIDER' );
				 expect( response ).toBe( undefined );
				 done();
		 });
	});

	it( 'reroutes a rejected rpc to another provider', function( done ){
			var wasRejected = false,
					clientAWasCalled = false,
					clientBWasCalled = false;

			clientA.rpc.provide( 'willBeRerouted', function( data, response ){
					clientAWasCalled = true;
					if( wasRejected === false ) {
							wasRejected = true;
							response.reject();
					} else {
							response.send( 'BOBO' );
					}
			});

			clientB.rpc.provide( 'willBeRerouted', function( data, response ){
					clientBWasCalled = true;
					if( wasRejected === false ) {
							wasRejected = true;
							response.reject();
					} else {
							response.send( 'BOBO' );
					}
			});

			clientC.rpc.make( 'willBeRerouted', null, function( error, result ){
					expect( error ).toBe( null );
					expect( wasRejected ).toBe( true );
					expect( clientAWasCalled ).toBe( true );
					expect( clientBWasCalled ).toBe( true );
					expect( result ).toBe( 'BOBO' );
					done();
			});
	});
	 /**************** TEAR DOWN ****************/
	it( 'closes the clients', function() {
			clientA.close();
			clientB.close();
			clientC.close();
	});

	it( 'shuts clients and server down', function(done) {
		deepstreamServer.on( 'stopped', done );
		deepstreamServer.stop();
	});
});