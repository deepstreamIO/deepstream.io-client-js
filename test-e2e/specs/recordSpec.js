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
		var clientARecord = clientA.record.getRecord( 'record1' );
		var clientBRecord = clientB.record.getRecord( 'record1' );

		var immediateSubscribeCalled = false;
		function immediateSubscribe( data ) {
			clientARecord.unsubscribe( immediateSubscribe );
			immediateSubscribeCalled = true;
			expect( data ).toEqual( {} );
		}
		expect( clientARecord.isReady ).toBe( false );
		clientARecord.subscribe( immediateSubscribe, true );
		expect( immediateSubscribeCalled ).toBe( false );

		var update = 1;
		clientARecord.subscribe( 'user.firstname', function( firstname ){
			if( update === 1 ) {
				expect( firstname ).toBeUndefined();
			} else if( update === 2 ) {
				expect( firstname ).toBe( 'Wolfram' );
				expect( immediateSubscribeCalled ).toBe( true );
				done();
			}
			update++;
		 }, true);

		clientBRecord.set({
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

	it( 'setting a leaf path to undefined deletes it', function( done ) {
		clientB.record.getRecord( 'record1' ).set( 'city', undefined );
		expect( clientB.record.getRecord( 'record1' ).get( 'city' ) ).toBeUndefined();
		expect( clientB.record.getRecord( 'record1' ).get() ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' } } );
		expect( clientA.record.getRecord( 'record1' ).get() ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' }, city: null } );

		setTimeout(function(){
			expect( clientA.record.getRecord( 'record1' ).get() ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' } } );
			done();
		}, 20 );
	});

	it( 'setting a branch path to undefined deletes everything under it', function( done ) {
		var clientARecord = clientA.record.getRecord( 'record1' );
		var clientBRecord = clientB.record.getRecord( 'record1' );

		clientBRecord.set( 'objectToDelete', { deleteMe: { key: 'value' } } );
		expect( clientBRecord.get( 'objectToDelete' ) ).toEqual( { deleteMe: { key: 'value' } } );

		setTimeout( function(){
			function subscribePath( value ){
				expect( value ).toBeUndefined();
			};
			clientARecord.subscribe( 'objectToDelete', subscribePath );
			clientBRecord.subscribe( 'objectToDelete', subscribePath );

			function subscribeObject( value ) {
				expect( value ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' } } );
			};
			clientARecord.subscribe( subscribeObject );
			clientBRecord.subscribe( subscribeObject );

			expect( clientARecord.get( 'objectToDelete' ) ).toEqual( { deleteMe: { key: 'value' } } );

			clientBRecord.set( 'objectToDelete', undefined );
			expect( clientBRecord.get( 'objectToDelete' ) ).toBeUndefined();
			expect( clientBRecord.get() ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' } } );
			expect( clientARecord.get() ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' }, objectToDelete: { deleteMe: { key: 'value' } } } );

			setTimeout(function(){
				expect( clientARecord.get() ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' } } );

				clientARecord.unsubscribe( 'objectToDelete', subscribePath );
				clientARecord.unsubscribe( subscribeObject );
				clientBRecord.unsubscribe( 'objectToDelete', subscribePath );
				clientBRecord.unsubscribe( subscribeObject );
				done();
			}, 20 );
		}, 20 );
	});

	it( 'setting a array index to undefined sets it as undefined', function( done ) {
		var clientARecord = clientA.record.getRecord( 'record1' );
		var clientBRecord = clientB.record.getRecord( 'record1' );

		clientBRecord.set( 'arrayToDeleteFrom', [ {}, {}, {}, {} ] );
		expect( clientBRecord.get( 'arrayToDeleteFrom' ) ).toEqual( [ {}, {}, {}, {} ] );

		setTimeout( function(){
			function subscribePath( value ){
				expect( value ).toEqual( [ {}, {}, null, {} ] );
			};
			clientARecord.subscribe( 'arrayToDeleteFrom', subscribePath );
			clientBRecord.subscribe( 'arrayToDeleteFrom', subscribePath );

			function subscribeObject( value ) {
				expect( value ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' }, arrayToDeleteFrom: [ {}, {}, null, {} ] } );
			};
			clientARecord.subscribe( subscribeObject );
			clientBRecord.subscribe( subscribeObject );

			expect( clientARecord.get( 'arrayToDeleteFrom' ) ).toEqual( [ {}, {}, {}, {} ] );

			clientBRecord.set( 'arrayToDeleteFrom.2', undefined );
			expect( clientBRecord.get( 'arrayToDeleteFrom' ) ).toEqual( [ {}, {}, null, {} ] );
			expect( clientBRecord.get() ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' }, arrayToDeleteFrom: [ {}, {}, null, {} ] } );
			expect( clientARecord.get() ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' }, arrayToDeleteFrom: [ {}, {}, {}, {} ] } );

			setTimeout(function(){
				expect( clientARecord.get() ).toEqual( { user: { firstname: 'Wolfram', lastname: 'Hempel' }, arrayToDeleteFrom: [ {}, {}, null, {} ] } );
				clientARecord.unsubscribe( 'objectToDelete', subscribePath );
				clientARecord.unsubscribe( subscribeObject );
				clientBRecord.unsubscribe( 'objectToDelete', subscribePath );
				clientBRecord.unsubscribe( subscribeObject );
				done();
			}, 20 );
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

	 /**************** TEAR DOWN ****************/
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