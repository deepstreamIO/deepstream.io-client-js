/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'anonymous record', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB,
		recordA,
		recordB,
		anonymousRecord,
		currentPet;

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

	 /**************** TEST ****************/
	it( 'creates recordA', function( done ){
		recordA = clientA.record.getRecord( 'recordA' );
		recordA.set( 'pet', 'hamster' );
		recordA.on( 'ready', done );
	});

	it( 'creates recordB', function( done ){
		recordB = clientB.record.getRecord( 'recordB' );
		recordB.set( 'pet', 'pug' );
		recordB.on( 'ready', done );
	});

	it( 'creates the anonymous record', function(done) {
		anonymousRecord = clientA.record.getAnonymousRecord();
		expect( anonymousRecord.get( 'pet' ) ).toBe( undefined );
		anonymousRecord.subscribe( 'pet', function( _pet ){ currentPet = _pet; } );
		done();
	});

	it( 'sets recordA', function(done) {
		anonymousRecord.once( 'ready', function(){
			expect( anonymousRecord.get() ).toEqual({ pet: 'hamster' });
			expect( currentPet ).toBe( 'hamster' );
			done();
		});
		anonymousRecord.setName( 'recordA' );
	});

	it( 'sets recordB', function(done) {
		anonymousRecord.once( 'ready', function(){
			expect( anonymousRecord.get() ).toEqual({ pet: 'pug' });
			expect( currentPet ).toBe( 'pug' );
			done();
		});
		anonymousRecord.setName( 'recordB' );
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