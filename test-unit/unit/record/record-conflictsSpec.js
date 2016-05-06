var Record = require( '../../../src/record/record.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	ClientMock = require( '../../mocks/client-mock' ),
	MERGE_STRATEGIES = require( '../../../src/constants/merge-strategies.js' ),
	options = { recordReadAckTimeout: 100, recordReadTimeout: 200, mergeStrategy: MERGE_STRATEGIES.REMOTE_WINS };

describe( 'getting a merge conflict from the server', function(){
	var record, errorCallback, connection;

	beforeAll( function() {
		errorCallback = jasmine.createSpy( 'errorCallback' );
		subscribeCallback = jasmine.createSpy( 'subscribeCallback' );
		connection = new MockConnection();
		record = new Record( 'recordConflict', {}, connection, options, new ClientMock() );

		record.on( 'error', errorCallback );
		record.subscribe( subscribeCallback );

		record._$onMessage( { topic: 'R', action: 'R', data: [ 'testRecord', 0, '{}' ] } );
	} );

	describe( 'when it recieves an update that isn\'t in sync', function() {

		describe( 'that is ahead of local and different', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'U', data: [ 'testRecord', 5, '{ "reason": "skippedVersion" }' ] } );
			} );

			it( 'does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).toHaveBeenCalledWith( { "reason": "skippedVersion" } );
			} );

			it( 'is one version ahead of remote', function() {
				expect( record.version ).toBe( 6 );
			} );

		} );

		describe( 'that is behind local and different', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'U', data: [ 'testRecord', 2, '{ "otherReason": "behindVersion" }' ] } );
			} );

			it( 'does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).toHaveBeenCalledWith( { "otherReason": "behindVersion" } );
			} );

			it( 'is one version ahead of remote', function() {
				expect( record.version ).toBe( 3 );
			} );

		} );

		describe( 'that is ahead of local and identical', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'U', data: [ 'testRecord', 5, '{ "otherReason": "behindVersion" }' ] } );
			} );

			it( 'it does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).not.toHaveBeenCalled();
			} );

			it( 'is the same version as remote', function() {
				expect( record.version ).toBe( 5 );
			} );

		} );

		describe( 'that is behind local and identical', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'U', data: [ 'testRecord', 2, '{ "otherReason": "behindVersion" }' ] } );
			} );

			it( 'it does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).not.toHaveBeenCalled();
			} );

			it( 'is the same version as remote', function() {
				expect( record.version ).toBe( 2 );
			} );

		} );

		describe( 'that fails the merge', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				record.setMergeStrategy( function( record, remoteValue, remoteVersion, callback ) {
					callback( 'error occured merging' );
				} );
				record._$onMessage( { topic: 'R', action: 'U', data: [ 'testRecord', 2, '{ "otherReason": "behindVersion" }' ] } );
			} );

			afterAll( function() {
				record.setMergeStrategy( MERGE_STRATEGIES.REMOTE_WINS );
			} );

			it( 'it throws an error', function() {
				expect( errorCallback.calls.count() ).toBe( 1 );
				expect( errorCallback.calls.mostRecent().args ).toEqual( [ 'VERSION_EXISTS', 'received update for 2 but version is 2' ] );
			} );

		} );

	} );

	describe( 'when it recieves an patch that isn\'t in sync', function() {

		beforeAll( function() {
			record._$onMessage( { topic: 'R', action: 'U', data: [ 'testRecord', 8, '{ "a": "a", "b": { "b1" : "b1" }, "c": "c" }' ] } );
		} );

		describe( 'that is ahead of local and different', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'P', data: [ 'testRecord', 5, "b.b1", "SanotherValue" ] } );
			} );

			it( 'does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).toHaveBeenCalledWith( { "a": "a", "b": { "b1" : "anotherValue" }, "c": "c" } );
			} );

			it( 'is one version ahead of remote', function() {
				expect( record.version ).toBe( 6 );
			} );

		} );

		describe( 'that is behind local and different', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'P', data: [ 'testRecord', 2, "b.b1", 'SWhoAmI' ] } );
			} );

			it( 'does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).toHaveBeenCalledWith( { "a": "a", "b": { "b1" : "WhoAmI" }, "c": "c" } );
			} );

			it( 'is one version ahead of remote', function() {
				expect( record.version ).toBe( 3 );
			} );

		} );

		describe( 'that is ahead of local and identical', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'P', data: [ 'testRecord', 5, "b.b1", 'SWhoAmI' ] } );
			} );

			it( 'it does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).not.toHaveBeenCalled();
			} );

			it( 'is the same version as remote', function() {
				expect( record.version ).toBe( 5 );
			} );

		} );

		describe( 'that is behind local and identical', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'P', data: [ 'testRecord', 2, "b.b1", 'SWhoAmI' ] } );
			} );

			it( 'it does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).not.toHaveBeenCalled();
			} );

			it( 'is the same version as remote', function() {
				expect( record.version ).toBe( 2 );
			} );

		} );

		describe( 'that fails the merge', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				record.setMergeStrategy( function( record, remoteValue, remoteVersion, callback ) {
					callback( 'error occured merging' );
				} );
				record._$onMessage( { topic: 'R', action: 'U', data: [ 'testRecord', 2, '{ "otherReason": "behindVersion" }' ] } );
			} );

			afterAll( function() {
				record.setMergeStrategy( MERGE_STRATEGIES.REMOTE_WINS );
			} );

			it( 'it throws an error', function() {
				expect( errorCallback.calls.count() ).toBe( 1 );
				expect( errorCallback.calls.mostRecent().args ).toEqual( [ 'VERSION_EXISTS', 'received update for 2 but version is 2' ] );
			} );

		} );

	} );

	describe( 'when it recieves a VERSION_EXISTS error', function() {

		describe( 'that is ahead of local version and different', function() {

				beforeAll( function() {
					errorCallback.calls.reset();
					subscribeCallback.calls.reset();
					record._$onMessage( { topic: 'R', action: 'E', data: [ 'VERSION_EXISTS', 'testRecord', 5, '{ "reason": "aheadVersion" }' ] } );
				} );

				it( 'does not throw an error', function() {
					expect( errorCallback.calls.count() ).toBe( 0 );
				} );

				it( 'sets the record', function() {
					expect( subscribeCallback ).toHaveBeenCalledWith( { "reason": "aheadVersion" } );
				} );

				it( 'is one version ahead of remote', function() {
					expect( record.version ).toBe( 6 );
				} );

		} );

		describe( 'that is behind local version and different', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'E', data: [ 'VERSION_EXISTS', 'testRecord', 2, '{ "otherReason": "behindVersion" }' ] } );
			} );

			it( 'does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).toHaveBeenCalledWith( { "otherReason": "behindVersion" } );
			} );

			it( 'is one version ahead of remote', function() {
				expect( record.version ).toBe( 3 );
			} );

		} );

		describe( 'that is ahead of local and identical', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'E', data: [ 'VERSION_EXISTS', 'testRecord', 5, '{ "otherReason": "behindVersion" }' ] } );
			} );

			it( 'it does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).not.toHaveBeenCalled();
			} );

			it( 'is the same version as remote', function() {
				expect( record.version ).toBe( 5 );
			} );

		} );

		describe( 'that is behind local and identical', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				subscribeCallback.calls.reset();
				record._$onMessage( { topic: 'R', action: 'E', data: [ 'VERSION_EXISTS', 'testRecord', 2, '{ "otherReason": "behindVersion" }' ] } );
			} );

			it( 'it does not throw an error', function() {
				expect( errorCallback.calls.count() ).toBe( 0 );
			} );

			it( 'sets the record', function() {
				expect( subscribeCallback ).not.toHaveBeenCalled();
			} );

			it( 'is the same version as remote', function() {
				expect( record.version ).toBe( 2 );
			} );
		} );
		
		describe( 'that fails the merge', function() {

			beforeAll( function() {
				errorCallback.calls.reset();
				record.setMergeStrategy( function( record, remoteValue, remoteVersion, callback ) {
					callback( 'error occured merging' );
				} );
				record._$onMessage( { topic: 'R', action: 'E', data: [ 'VERSION_EXISTS', 'testRecord', 2, '{ "otherReason": "behindVersion" }' ] } );
			} );

			afterAll( function() {
				record.setMergeStrategy( MERGE_STRATEGIES.REMOTE_WINS );
			} );

			it( 'it throws an error', function() {
				expect( errorCallback.calls.count() ).toBe( 1 );
				expect( errorCallback.calls.mostRecent().args ).toEqual( [ 'VERSION_EXISTS', 'received update for 2 but version is 2' ] );
			} );

		} );

	} );

} );