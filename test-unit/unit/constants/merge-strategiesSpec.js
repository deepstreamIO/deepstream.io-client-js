/* global describe, it, expect, jasmine */
var	MERGE_STRATEGIES = require( '../../../src/constants/merge-strategies' );

describe( 'merge strategies', function() {

	describe( 'remote wins', function() {

		beforeEach( function() {
			this.mergeCallback = jasmine.createSpy( 'mergeSpy' );
			this.record = { 
				get: function() { 
					return { type: 'remote' };
				}
			};
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
			this.record = { 
				get: function() { 
					return { type: 'local' };
				}
			};
			MERGE_STRATEGIES.LOCAL_WINS( this.record, { type: 'remote' }, 5, this.mergeCallback );
		} );

		it( 'returns the remote data', function() {
			expect( this.mergeCallback.calls.count() ).toBe( 1 );
			expect( this.mergeCallback.calls.mostRecent().args ).toEqual( [ null, { type: 'local' } ] );
		} );

	} );

} );
