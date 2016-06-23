/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'list', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB,
		listA,
		listB;

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
	it( 'retrieves listA', function(done) {
		listA = clientA.record.getList( 'someList' );
		listA.addEntry( 'Carrot' );
		listA.addEntry( 'Tomato' );
		setTimeout( done, 50 );
	});

	it( 'retrieves listB', function(done) {
		listB = clientB.record.getList( 'someList' );
		listB.on( 'ready', function(){
			expect( listB.getEntries() ).toEqual([ 'Carrot', 'Tomato' ]);
			done();
		});
	});

	it( 'removes an entry', function(done) {
		var callback = function(){
			expect( listA.getEntries() ).toEqual( [ 'Carrot' ] );
			listA.unsubscribe( callback );
			done();
		};

		listA.subscribe( callback );
		listB.removeEntry( 'Tomato' );
	});

	it( 'sets entries', function(done) {
		var callback = function(){
			expect( listB.getEntries() ).toEqual( [ 'Figs', 'Dates' ] );
			listB.unsubscribe( callback );
			done();
		};

		listB.subscribe( callback );
		listA.setEntries([ 'Figs', 'Dates' ]);
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