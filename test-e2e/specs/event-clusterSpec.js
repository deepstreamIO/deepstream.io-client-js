/* global describe, it, expect, jasmine */
var Cluster = require( '../tools/cluster'),
	deepstreamClient = require( '../../src/client' ),
	config = require( '../config' );

describe( 'event cluster', function() {
	var cluster,

		clientA,
		clientB,
		clientC,

		callbackA = jasmine.createSpy( 'callbackA' ),
		callbackB = jasmine.createSpy( 'callbackB' ),
		callbackC = jasmine.createSpy( 'callbackC' );

	/**************** SETUP ****************/
	it( 'starts three servers', function( done ) {
		cluster = new Cluster( [ 6001, 6002, 6003 ], false );
		cluster.on( 'ready', function(){ done(); } );
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
	it( 'subscribes and emits an event', function( done ){
		clientA.event.subscribe( 'event1', function( data ){
			expect( data ).toBe( 'someData' );
			done();
		});

		clientB.event.emit( 'event1', 'someData' );
	});

	it( 'receives its own events', function( done ){
		var clientAReceivedEvent = false,
			clientBReceivedEvent = false,
			checkDone = function() {
				if( clientAReceivedEvent && clientBReceivedEvent ) {
					done();
				}
			};

		clientA.event.subscribe( 'event2', function( data ){
			clientAReceivedEvent = true;
			expect( data ).toBe( 44 );
			checkDone();
		});

		clientB.event.subscribe( 'event2', function( data ){
			clientBReceivedEvent = true;
			expect( data ).toBe( 44 );
			checkDone();
		});

		clientB.event.emit( 'event2', 44 );
	});

	it( 'subscribes and unsubscribes', function(done){
		var calls = 0,
			callback = function( data ){
				expect( data ).toEqual( { an: 'object' } );
				calls++;
				expect( calls ).toBe( 1 );
				clientA.event.unsubscribe( 'event3', callback );
				clientB.event.emit( 'event3', { an: 'object' } );

				setTimeout(function(){
					expect( calls ).toBe( 1 );
					done();
				}, config.messageTimeout );
			};

		clientA.event.subscribe( 'event3', callback );
		clientB.event.emit( 'event3', { an: 'object' } );
	});

	it( 'sends events across multiple cluster nodes', function( done ){
		clientA.event.subscribe( 'event4', callbackA );
		clientB.event.subscribe( 'event4', callbackB );
		clientC.event.subscribe( 'event4', callbackC );

		setTimeout( done, config.messageTimeout );
	});

	it( 'sends events', function( done ){
		clientA.event.emit( 'event4', 'value1' );
		clientB.event.emit( 'event4', 'value2' );
		clientC.event.emit( 'event4', 'value3' );

		setTimeout( done, config.messageTimeout );
	});

	it( 'all client have received all events', function( done ){
		expect( callbackA.calls.count() ).toBe( 3 );
		expect( callbackA ).toHaveBeenCalledWith( 'value1' );
		expect( callbackA ).toHaveBeenCalledWith( 'value2' );
		expect( callbackA ).toHaveBeenCalledWith( 'value3' );

		expect( callbackB.calls.count() ).toBe( 3 );
		expect( callbackB ).toHaveBeenCalledWith( 'value1' );
		expect( callbackB ).toHaveBeenCalledWith( 'value2' );
		expect( callbackB ).toHaveBeenCalledWith( 'value3' );

		expect( callbackC.calls.count() ).toBe( 3 );
		expect( callbackC ).toHaveBeenCalledWith( 'value1' );
		expect( callbackC ).toHaveBeenCalledWith( 'value2' );
		expect( callbackC ).toHaveBeenCalledWith( 'value3' );

		done();
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