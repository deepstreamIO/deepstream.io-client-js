/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'record', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB;

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
		clientA.login( null, function( success ){
			expect( success ).toBe( true );
			done();
		});
	});

	it( 'creates clientB', function( done ) {
		clientB = deepstreamClient( 'localhost:6021' );
		clientB.login( null, function( success ){
			expect( success ).toBe( true );
			done();
		});
	});

	 /**************** TEST ****************/
	it( 'subscribes and sets a record', function(done) {
		clientA.record.getRecord( 'record1' ).subscribe( 'user.firstname', function( firstname ){
			expect( firstname ).toBe( 'Wolfram' );
			done();
		});

		clientB.record.getRecord( 'record1' ).set({
			user: {
				firstname: 'Wolfram',
				lastname: 'Hempel'
			}
		});
	});

	it( 'maintains a local copy of the record', function() {
		expect( clientA.record.getRecord( 'record1' ).get( 'user.lastname' ) ).toBe( 'Hempel' );
	});

	it( 'sets a path', function( done ) {
		clientB.record.getRecord( 'record1' ).set( 'city', 'London' );
		expect( clientB.record.getRecord( 'record1' ).get( 'city' ) ).toBe( 'London' );
		expect( clientA.record.getRecord( 'record1' ).get( 'city' ) ).toBe( undefined );

		setTimeout(function(){
			expect( clientA.record.getRecord( 'record1' ).get( 'city' ) ).toBe( 'London' );
			done();
		}, 20 );
	});

	it( 'sets a path with null', function( done ) {
		clientB.record.getRecord( 'record1' ).set( 'city', null );
		expect( clientB.record.getRecord( 'record1' ).get( 'city' ) ).toBeNull();
		expect( clientA.record.getRecord( 'record1' ).get( 'city' ) ).toBe( 'London' );

		setTimeout(function(){
			expect( clientA.record.getRecord( 'record1' ).get( 'city' ) ).toBeNull();
			done();
		}, 20 );
	});
	
	it( 'does not keep objects by reference', function() {
		var a = {
			number: 1
		};
		clientB.record.getRecord( 'record1' ).set( 'myObject', a );
		a.number = 2;
		expect( clientB.record.getRecord( 'record1' ).get( 'myObject' ) ).not.toEqual( a );
	} );
	
	it( 'does update after object properties are changed and set' ,function( done ) {
		var b = {
			digit: 1
		};
		clientB.record.getRecord( 'record1' ).set( 'myObject', b );
		b.digit = 2;
		clientB.record.getRecord( 'record1' ).set( 'myObject', b );
		expect( clientB.record.getRecord( 'record1' ).get( 'myObject' ) ).toEqual( b );
		setTimeout( function() {
			expect( clientA.record.getRecord( 'record1' ).get( 'myObject' ) ).toEqual( b );
			done();
		}, 20 );
	});
	
	it( 'subscribes and unsubscribes', function( done ) {
		var pet,
			recordA2 = clientA.record.getRecord( 'record2' ),
			recordB2 = clientB.record.getRecord( 'record2' ),
			setPet = function( _pet ){ pet = _pet; };

		// Set value before record is ready
		recordA2.set( 'pets[2]', 'Samoyed' );
		recordA2.subscribe( 'pets[ 2 ]', setPet , true );

		recordA2.on( 'ready', function(){
			// Record was created correctly
			expect( recordA2.get() ).toEqual({ pets: [ null, null, 'Samoyed' ] });

			// subscriber was notified
			expect( pet ).toBe( 'Samoyed' );

			// subscriber notified of change
			recordA2.set( 'pets[2]', 'Turtle' );
			expect( pet ).toBe( 'Turtle' );

			// subscriber removed
			recordA2.unsubscribe( 'pets[ 2 ]', setPet );

			// subscriber won't be notified
			recordA2.set( 'pets[2]', 'Guineapig' );
			expect( pet ).toBe( 'Turtle' );

			// structure was changed correctly
			expect( recordA2.get() ).toEqual({ pets: [ null, null, 'Guineapig' ] });

			// all good
			done();
		});
	});

	it( 'subscribes and discards', function( done ) {
		var city,
			recordA3 = clientA.record.getRecord( 'record3' ),
			recordB3 = clientB.record.getRecord( 'record3' );

		// Trigger immediatly
		recordA3.subscribe( 'city', function( _city ){ city = _city; }, true );
		expect( city ).toBe( undefined );

		recordB3.set( 'city', 'Berlin' );
		expect( city ).toBe( undefined );

		setTimeout(function(){
			expect( city ).toBe( 'Berlin' );
			recordA3.discard();
			recordB3.set( 'city', 'Dresden' );
			setTimeout(function() {
				expect( city ).toBe( 'Berlin' );
				done();
			}, 20 );
		}, 20 );
	});

	it( 'allows discard to be called before the record is ready', function( done ) {
		var recordToDiscard = clientA.record.getRecord( 'recordToDiscardImmediately' );
		recordToDiscard
			.set( { key: 'value' } )
			.discard();

		setTimeout( function() {
			//Not failing the test is proof this works
			done();
		}, 20 );
	});

	it( 'allows delete to be called before the record is ready', function( done ) {
		var recordToDelete = clientA.record.getRecord( 'recordToDeleteImmediately' );
		recordToDelete
			.set( { key: 'value' } )
			.delete();

		setTimeout( function() {
			//Not failing the test is proof this works
			done();
		}, 20 );
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
