/* global describe, it, expect, jasmine */
var Cluster = require( '../tools/cluster'),
	deepstreamClient = require( '../../src/client' ),
	config = require( '../config' );

describe( 'record cluster', function() {
	var cluster,

		clientA,
		clientB,
		clientC,

		recordA,
		recordB,
		recordC,

		callbackA = jasmine.createSpy( 'callbackA' ),
		callbackB = jasmine.createSpy( 'callbackB' ),
		callbackC = jasmine.createSpy( 'callbackC' );

	/**************** SETUP ****************/
	it( 'starts two servers', function( done ){
		cluster = new Cluster( [ 6001, 6002, 6003 ], false );
		cluster.on( 'ready', done );
	});

	it( 'creates clientA', function( done ) {
		clientA = deepstreamClient( 'localhost:6001' );
		clientA.login( { username: 'clientA' }, function(){ done(); });
	});

	it( 'creates clientB', function( done ) {
		clientB = deepstreamClient( 'localhost:6002' );
		clientB.login( { username: 'clientB' }, function(){ done(); });
	});

	it( 'creates clientC', function( done ) {
		clientC = deepstreamClient( 'localhost:6003' );
		clientC.login( { username: 'clientC' }, function(){ done(); });
	});

	 /**************** TEST ****************/
	it( 'gets recordA', function( done ){
		recordA = clientA.record.getRecord( 'testRecord' );
		recordA.on( 'ready', done );
	});

	it( 'gets recordB', function( done ){
		recordB = clientB.record.getRecord( 'testRecord' );
		recordB.on( 'ready', done );
	});

	it( 'gets recordC', function( done ){
		recordC = clientC.record.getRecord( 'testRecord' );
		recordC.on( 'ready', done );
	});

	it( 'sets a simple value', function( done ){
		recordA.set( 'color', 'red' );
		setTimeout( function(){
			expect( recordA.get( 'color' ) ).toBe( 'red' );
			expect( recordB.get( 'color' ) ).toBe( 'red' );
			expect( recordC.get( 'color' ) ).toBe( 'red' );
			done();
		}, config.messageTimeout );
	});

	it( 'subscribes to a path', function( done ){
		recordA.subscribe( 'doors[2]', callbackA );
		recordB.subscribe( 'doors[2]', callbackB );
		recordC.subscribe( 'doors[2]', callbackC );
		setTimeout( done, config.messageTimeout );
	});

	it( 'sets the path', function( done ){
		recordB.set( 'doors[ 2 ]', 'driverDoor' );
		setTimeout( done, config.messageTimeout );
	});

	it( 'has updated all records and called their callbacks', function(){
		expect( callbackA ).toHaveBeenCalledWith( 'driverDoor' );
		expect( callbackB ).toHaveBeenCalledWith( 'driverDoor' );
		expect( callbackC ).toHaveBeenCalledWith( 'driverDoor' );
		expect( recordA.get() ).toEqual({ color: 'red', doors: [ null, null, 'driverDoor' ] });
		expect( recordB.get() ).toEqual({ color: 'red', doors: [ null, null, 'driverDoor' ] });
		expect( recordC.get() ).toEqual({ color: 'red', doors: [ null, null, 'driverDoor' ] });
	});

	 /**************** TEAR DOWN ****************/
	it( 'closes the clients', function() {
		clientA.close();
		clientB.close();
		clientC.close();
	});

	it( 'stops both servers', function(done) {
		cluster.on( 'stopped', done );
		cluster.stop();
	});
});