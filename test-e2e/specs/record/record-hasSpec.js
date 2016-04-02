/* global describe, it, expect, jasmine */
var singleServer = require( '../../tools/single'),
    deepstreamClient = require( '../../../src/client' );
	
describe( 'record HAS request', function() {
	var clientA;
	
	/**************** SETUP ****************/
    it( 'starts the server', singleServer.start );
	
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
	
    it( 'shuts clients and server down', singleServer.close );
});