/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
	deepstreamClient = require( '../../src/client' ),
	TestLogger = require( '../tools/test-logger' );

describe( 'record permissions with internal cache', function() {
	var deepstreamServer,
		logger = new TestLogger(),
		clientA,
		clientB,
		clientAErrors = [],
		clientBErrors = [];

	beforeEach(function(){
		clientAErrors = [];
		clientBErrors = [];
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
		deepstreamServer.start();
	});

	it( 'creates clientA', function( done ) {
		clientA = deepstreamClient( 'localhost:6021' );
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

		it( 'reads from public read and private write is private', function(done) {
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
				expect( clientBErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
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
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 200);
		});
	});

	describe( 'delete rules based on multiple path paramenters', function(){
		it( 'creates egon and mike', function( done ){
			 clientA.record.getRecord( 'only-delete-egon-miller/Egon/fisher' );
			 clientA.record.getRecord( 'only-delete-egon-miller/mike/fisher' );
			 clientA.record.getRecord( 'only-delete-egon-miller/Egon/miller' );
			 setTimeout( done, 100 );
		});

		it( 'fails to delete egon fisher', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.record.getRecord( 'only-delete-egon-miller/Egon/fisher' ).delete();
			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 100 );
		});

		it( 'successfully deletes egon miller', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.record.getRecord( 'only-delete-egon-miller/Egon/miller' ).delete();
			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 0 );
				done();
			}, 100 );
		});

		it( 'fails to delete mike fisher', function( done ){
			expect( clientAErrors.length ).toBe( 0 );
			clientA.record.getRecord( 'only-delete-egon-miller/mike/fisher' ).delete();
			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 100 );
		});
	});


	describe( 'it cross references another record in a permission', function(){
		it( 'creates the cross referenced records', function( done ){
			clientA.record.getRecord( 'item/a' ).set( 'stock', 3 );
			clientA.record.getRecord( 'item/b' ).set( 'stock', 0 );
			setTimeout( done, 50 );
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
			}, 100 );
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
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 100 );
		});

		it( 'sets the amout of items to 0 and immediatly retries the transaction', function( done ){
			clientA.record.getRecord( 'item/a' ).set( 'stock', 0 );
			expect( clientAErrors.length ).toBe( 0 );
			var purchaseA = clientA.record.getRecord( 'only-allows-purchase-of-products-in-stock/pc' );

			purchaseA.set({
				itemId: 'a',
				customer: 'mike'
			});

			setTimeout(function(){
				expect( clientAErrors.length ).toBe( 1 );
				expect( clientAErrors[ 0 ][ 1 ] ).toBe( 'MESSAGE_DENIED' );
				done();
			}, 100 );
		});
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
