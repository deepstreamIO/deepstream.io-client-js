/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' ),
	RedisCacheConnector = require( 'deepstream.io-cache-redis' ),
	config = require( '../config' );

function assertMessageDenied( clientErrors ) {
	if( clientErrors[ 0 ] ) {
		expect( clientErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
	}
}

describe( 'record permissions with internal cache', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB,
		clientAErrors = [],
		clientBErrors = [],
		redisCache = new RedisCacheConnector({
			port: config.redisPort,
			host: config.redisHost
		});

	beforeEach(function(){
		clientAErrors = [];
		clientBErrors = [];
	});

	beforeAll(function( done ){
		//delete everything from the cache
		redisCache.client.flushall( done );
	});

	/**************** SETUP ****************/
	it( 'starts the server', function( done ){
		deepstreamServer = new DeepstreamServer( {
			showLogo: false,
			permission: {
				type: 'config',
				options: {
					path: './test-e2e/permissions-complex.json'
				}
			}
		} );
		deepstreamServer.on( 'started', done );
		deepstreamServer.set( 'logger', logger );
		deepstreamServer.set( 'cache', redisCache );
		deepstreamServer.start();
	});

	it( 'creates clientA', function( done ) {
		clientA = deepstreamClient( 'localhost:6021', {
			mergeStrategy: deepstreamClient.MERGE_STRATEGIES.LOCAL_WINS
		} );
		clientA.on( 'error', function(){
			clientAErrors.push( arguments );
		});
		clientA.login({ username: 'client-a' }, function( success ){
			expect( success ).toBe( true );
			done();
		});
	});

	it( 'creates clientB', function( done ) {
		clientB = deepstreamClient( 'localhost:6021' );
		clientB.on( 'error', function(){
			clientBErrors.push( arguments );
		});
		clientB.login( { username: 'client-b' }, function( success ){
			expect( success ).toBe( true );
			done();
		});
	});

	 /**************** TEST ****************/

	describe( 'it reads and writes from an open record', function(){
		it( 'creates the record with clientA and sets some data', function( done ){
			var record = clientA.record.getRecord( 'open/some-user' );
			record.set( 'firstname', 'wolfram' );
			setTimeout( done, 200 );
		});

		it( 'reads from the open record using clientB', function( done ){
			clientB.record.getRecord( 'open/some-user' ).whenReady(function( record ){
				expect( record.get( 'firstname') ).toBe( 'wolfram' );
				done();
			});
		});
	});

	describe( 'basic record permissions', function(){
		it( 'successfully creates and updates a public record', function(done) {
			var recA1 = clientA.record.getRecord( 'public/rec1' );
			var recB1 = clientB.record.getRecord( 'public/rec1' );
			recB1.subscribe( 'firstname', function( firstname ){
				expect( firstname ).toBe( 'Wolfram' );
				expect( clientAErrors.length ).toBe( 0 );
				expect( clientBErrors.length ).toBe( 0 );
				done();
			});
			recA1.set( 'firstname', 'Wolfram' );
		});

		it( 'creates a private write record', function( done ){
			clientA.record.getRecord( 'public-read-private-write/client-a' ).whenReady( done );
		});
		it( 'reads from public read and private write is private', function(done) {
			expect( clientAErrors.length ).toBe( 0 );
			expect( clientBErrors.length ).toBe( 0 );

			var recA1 = clientA.record.getRecord( 'public-read-private-write/client-a' );
			var recB1 = clientB.record.getRecord( 'public-read-private-write/client-a' );

			recB1.subscribe( 'firstname', function( firstname ){
				expect( firstname ).toBe( 'Wolfram' );
				expect( clientAErrors.length ).toBe( 0 );
				expect( clientBErrors.length ).toBe( 0 );
				done();
			});

			recA1.set( 'firstname', 'Wolfram' );
		});

		it( 'reads public and write is private', function( done ) {
			var recA1 = clientA.record.getRecord( 'public-read-private-write/client-a' );
			var recB1 = clientB.record.getRecord( 'public-read-private-write/client-a' );
			var recASubscribeCalled = false;

			recA1.subscribe( 'firstname', function( firstname ){
				var recASubscribeCalled = true;
				expect( 'it should never get here' ).toBe( true );
			});

			recB1.set( 'lastname', 'Hempel' );
			setTimeout(function(){
				expect( recASubscribeCalled ).toBe( false );
				expect( recA1.get( 'lastname' ) ).toBe( undefined );
				expect( clientAErrors.length ).toBe( 0 );
				expect( clientBErrors.length ).toBe( 1 );
				assertMessageDenied( clientBErrors );
				done();
			}, 200 );
		});
	});

	describe( 'rule referencing old and new data', function(){
		 it( 'can increment this record', function( done ) {
			var rec = clientA.record.getRecord( 'only-increment' );
			rec.set( 'value', 0 );
			rec.set({ value: 1 });
			rec.set({ value: 3 });

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 0 );
				done();
			}, 200);
		});

		it( 'can not decrement this record', function( done ) {
			var rec = clientA.record.getRecord( 'only-increment' );
			expect( rec.get( 'value' ) ).toBe( 3 );
			rec.set( 'value', 2 );
			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				assertMessageDenied( clientAErrors );
				done();
			}, 200 );
		});

		it( 'sends a valid update, which results in a version conflict', function( done ) {
			var rec = clientA.record.getRecord( 'only-increment' );
			// Current local state, not valid on server since it was denied
			expect( rec.get( 'value' ) ).toBe( 2 );
			// Current state, future state
			rec.set( { value: 4 } );
			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 0 );
				done();
			}, 200 );
		});

		it( 'works when setting values in quick succession', function( done ) {
			var rec = clientA.record.getRecord( 'only-increment' );
			rec.set({ value: 5 });
			rec.set({ value: 6 });
			rec.set({ value: 7 });
			rec.set({ value: 3 });
			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				assertMessageDenied( clientAErrors );
				done();
			}, 2000 );
		});

		it( 'works when setting different records in quick mixed succession', function( done ) {
			var incrementRecord = clientA.record.getRecord( 'only-increment' );
			var decrementRecord = clientB.record.getRecord( 'only-decrement' );

			decrementRecord.set( { value: 200 });
			incrementRecord.set( { value: 8 });
			decrementRecord.set( { value: 99 });
			incrementRecord.set( { value: 9 });
			decrementRecord.set( { value: 98 });

			incrementRecord.set( { value: 1 });
			decrementRecord.set( { value: 200 });


			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				assertMessageDenied( clientAErrors );

				expect( clientBErrors.length ).toBe( 1 );
				assertMessageDenied( clientBErrors )

				done();
			}, 2000 );
		});
	});

	describe( 'delete rules based on multiple path paramenters', function(){
		it( 'creates egon and mike', function( done ){
			 clientA.record.getRecord( 'only-delete-egon-miller/Egon/fisher' );
			 clientA.record.getRecord( 'only-delete-egon-miller/mike/fisher' );
			 clientA.record.getRecord( 'only-delete-egon-miller/Egon/miller' );
			 setTimeout( done, 200 );
		});

		it( 'fails to delete egon fisher', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.record.getRecord( 'only-delete-egon-miller/Egon/fisher' ).delete();
			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				assertMessageDenied( clientAErrors );
				done();
			}, 200 );
		});

		it( 'successfully deletes egon miller', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.record.getRecord( 'only-delete-egon-miller/Egon/miller' ).delete();
			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 0 );
				done();
			}, 200 );
		});

		it( 'fails to delete mike fisher', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.record.getRecord( 'only-delete-egon-miller/mike/fisher' ).delete();
			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				assertMessageDenied( clientAErrors );
				done();
			}, 200 );
		});
	});

	describe( 'it cross references another record in a permission', function(){
		it( 'creates the cross referenced records', function( done ){
			clientA.record.getRecord( 'item/a' ).set( 'stock', 3 );
			clientA.record.getRecord( 'item/b' ).set( 'stock', 0 );
			setTimeout( done, 200 );
		});

		it( 'successfully creates a transaction for an item that is in stock', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			var purchaseA = clientA.record.getRecord( 'only-allows-purchase-of-products-in-stock/pa' );

			purchaseA.set({
				itemId: 'a',
				customer: 'mike'
			});

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 0 );
				done();
			}, 200 );
		});

		it( 'fails to create a transaction for an item that is out of stock', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			var purchaseA = clientA.record.getRecord( 'only-allows-purchase-of-products-in-stock/pb' );

			purchaseA.set({
				itemId: 'b',
				customer: 'mike'
			});

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				assertMessageDenied( clientAErrors );
				done();
			}, 200 );
		});

		it( 'sets the amout of items to 0 and immediately retries the transaction', function( done ){
			clientA.record.getRecord( 'item/a' ).set( 'stock', 0 );
			expect( clientAErrors.length ).toBe( 0 );
			var purchaseA = clientA.record.getRecord( 'only-allows-purchase-of-products-in-stock/pc' );

			purchaseA.set({
				itemId: 'a',
				customer: 'mike'
			});

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				assertMessageDenied( clientAErrors );
				done();
			}, 200 );
		});
	});

	/**************** TEAR DOWN ****************/
	// closes the clients
	afterAll( function() {
		clientA.close();
		clientB.close();
	});

	// shuts clients and server down
	afterAll( function(done) {
		deepstreamServer.on( 'stopped', done );
		deepstreamServer.stop();
	});
});
