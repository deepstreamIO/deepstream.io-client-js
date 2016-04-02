/* global describe, it, expect, jasmine */
var singleServer = require( '../../tools/single'),
    deepstreamClient = require( '../../../src/client' ),
	C = require( '../../src/constants/constants' );
	
describe( 'record snapshot', function() {
	var clientA;
	
	/**************** SETUP ****************/
    it( 'starts the server', singleServer.start );
	
	it( 'creates clientA', function( done ) {
		clientA = deepstreamClient( 'localhost:6021' );
		clientA.login( null, function(){ done(); });
	});
	
	 /**************** TEST ****************/
	it( 'snapshot returns error if data doesn\'t exist remotely', function( done ){
		clientA.record.snapshot( 'nonExistantRecord', function( error, data ) {
			expect( error ).toBe( C.EVENT.RECORD_NOT_FOUND );
			expect( data ).toBeUndefined();
			done();
		} );
	});
	
	it( 'retrieves snapshot from deepstream', function( done ){
		var record = clientA.record.getRecord( 'remoteRecord' );
		record.set( { key: 'value' } );

		record.whenReady( function() {
			record.discard();

			setTimeout( function() {
				clientA.record.snapshot( 'remoteRecord', function( error, data ) {
					expect( error ).toBeNull();
					expect( data ).toEqual( { "key": "value" } );
					done();
				} );
			}, 10 );
		} );
	});

	it( 'retrieves local snapshot if client has the record', function( done ){
		var record = clientA.record.getRecord( 'localRecord' );
		record.set( { key: 'value' } );

		record.whenReady( function() {

			setTimeout( function() {
				clientA.record.snapshot( 'localRecord', function( error, data ) {
					expect( error ).toBeNull();
					expect( data ).toEqual( { key: 'value' } );
					done();
				} );
			 }, 10 );	
		} );
	});

	/**************** TEAR DOWN ****************/
	it( 'closes the clients', function() {
		clientA.close();
	});
	
    
    it( 'shuts clients and server down', singleServer.close );
});