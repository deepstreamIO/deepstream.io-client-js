/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../../src/client' );

xdescribe( 'record', function() {
	var deepstreamServer,
		clientA,
		clientB;

	/**************** SETUP ****************/
	it( 'starts the server', function( done ){
		deepstreamServer = new DeepstreamServer();
		deepstreamServer.on( 'started', done );
		deepstreamServer.set( 'logger', {
			isReady: true,
			log: function( logLevel, event, logMessage ) {
				if( logLevel === 3 ) {
					throw new Error( 'Critical error occured on deepstream ' +  event + ' ' + logMessage );
				}
			},
			setLogLevel: function() {}
		} );
		deepstreamServer.set( 'showLogo', false );
		deepstreamServer.start();
	});

	it( 'creates clientA', function( done ) {
		clientA = deepstreamClient( 'localhost:6021' );
		console.log( 'loggin in')
		clientA.login( null, function( success ){
			console.log( 'logged in')
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

	it( 'create and discards two times in a row', function( done ) {
		var counter = 0
		function syncCb() {
			counter++
			if (counter == 2) {
				done()
			}
		}
		var record1 = clientA.record.getRecord( 'record-x' );
		record1.set({ x: 1 });
		record1.on( 'discard', syncCb)
		record1.discard();
		record2 = clientA.record.getRecord( 'record-x' );
		record2.set({ x: 2 });
		record2.on( 'discard', syncCb)
		record2.discard();
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