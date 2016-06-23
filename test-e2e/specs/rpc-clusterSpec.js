/* global describe, it, expect, jasmine */
var Cluster = require( '../tools/cluster'),
	deepstreamClient = require( '../../src/client' );

describe( 'rpc cluster', function() {
	var cluster,

		clientA,
		clientB,
		clientC,
		clientD,


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
		clientB = deepstreamClient( 'localhost:6003' );
		clientB.login( { username: 'clientB' }, function(){ done(); });
	});

	it( 'creates clientC', function( done ) {
		clientC = deepstreamClient( 'localhost:6003' );
		clientC.login( { username: 'clientC' }, function(){ done(); });
	});

	// it( 'creates clientD', function( done ) {
	//     clientD = deepstreamClient( 'localhost:6002' );
	//     clientD.login( { username: 'clientD' }, function(){ done(); });
	// });

	 /**************** TEST ****************/
	// it( 'registers as an rpc provider', function( done ){
	//     clientA.rpc.provide( 'plusOne', function( data, response ){
	//         response.send( data + 1 );
	//     });

	//     clientB.rpc.provide( 'plusOne', function( data, response ){
	//         response.send( data + 2 );
	//     });

	//     clientC.rpc.provide( 'plusOne', function( data, response ){
	//         response.send( data + 3 );
	//     });

	//     setTimeout( done, 30 );
	// });

	// it( 'makes rpc and is serviced by a local provider', function(done) {
	//     clientD.rpc.make( 'plusOne', 2, function( error, result ){
	//         expect( result ).toBe( 5 );
	//         done();
	//     });
	// });

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