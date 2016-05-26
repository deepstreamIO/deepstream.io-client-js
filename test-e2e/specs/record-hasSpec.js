/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'record HAS request', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA;

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

	 /**************** TEST ****************/
	it( 'callback is false if deepstream does not have record', function( done ){
		clientA.record.has( 'doesntHaveRecord', function( error, hasRecord ) {
			expect( error ).toBeNull();
			expect( hasRecord ).toBe( false );
			done();
		} );
	});

	it( 'callback is true if deepstream has the record', function( done ){
		var record = clientA.record.getRecord( 'hasRecordRemotely' );
		record.whenReady( function() {
			record.discard();

			clientA.record.has( 'hasRecordRemotely', function( error, hasRecord ) {
				expect( error ).toBeNull();
				expect( hasRecord ).toBe( true );
				done();
			} );
		} );
	});

	it( 'callback is true if client has the record locally', function( done ){
		var record = clientA.record.getRecord( 'hasRecordLocally' );
		record.whenReady( function() {
			clientA.record.has( 'hasRecordLocally', function( error, hasRecord ) {
				expect( error ).toBeNull();
				expect( hasRecord ).toBe( true );
				done();
			} );
		} );
	});

	/**************** TEAR DOWN ****************/
	it( 'closes the clients', function() {
		clientA.close();
	});

	it( 'shuts clients and server down', function(done) {
		deepstreamServer.on( 'stopped', done );
		deepstreamServer.stop();
	});
});