/* global describe, it, expect, jasmine */
var	MERGE_STRATEGIES = require( '../../../src/constants/merge-strategies' );

describe( 'merge strategies', function() {

	describe( 'remote wins', function() {

		beforeEach( function() {
			this.mergeCallback = jasmine.createSpy( 'mergeSpy' );
			this.record = { get: function() { return { type: 'local' } } };
			MERGE_STRATEGIES.REMOTE_WINS( {}, { type: 'remote' }, 5, this.mergeCallback );
		} );

		it( 'returns the remote data', function() {
			expect( this.mergeCallback.calls.count() ).toBe( 1 );
			expect( this.mergeCallback.calls.mostRecent().args ).toEqual( [ null, { type: 'remote' } ] );
		} );

	} );

	describe( 'local wins', function() {

		beforeEach( function() {
			this.mergeCallback = jasmine.createSpy( 'mergeSpy' );
			this.record = { get: function() { return { type: 'local'} } };
			MERGE_STRATEGIES.LOCAL_WINS( this.record, { type: 'remote' }, 5, this.mergeCallback );
		} );

		it( 'returns the remote data', function() {
			expect( this.mergeCallback.calls.count() ).toBe( 1 );
			expect( this.mergeCallback.calls.mostRecent().args ).toEqual( [ null, { type: 'local' } ] );
		} );

	} );

	describe( 'merge if not conflict', function() {

		beforeEach( function() {
			this.mergeCallback = jasmine.createSpy( 'mergeSpy' );
		} );

		it( 'merges two objects with no conflicts', function() {
				var record = { get: function() { return { type: 'local', aLocalProperty: 'localValue' } } };
				MERGE_STRATEGIES.MERGE_IF_NO_CONFLICT( record, { type: 'remote', aRemoteProperty: 'remoteValue' }, 5, this.mergeCallback );
				expect( this.mergeCallback.calls.count() ).toBe( 1 );
				expect( this.mergeCallback.calls.mostRecent().args ).toEqual( [ null, { type: 'remote', aLocalProperty: 'localValue', aRemoteProperty: 'remoteValue' } ] );
		} );

	} );


} );
