/* global expect, it, describe, jasmine */
var List = require( '../../../src/record/list' ),
	RecordHandler = require( '../../../src/record/record-handler' ),
	ClientMock = require( '../../mocks/client-mock' ),
	ConnectionMock = require( '../../mocks/message/connection-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	options = {};

describe( 'lists change listener', function(){
	var list,
		recordHandler = new RecordHandler( options, new ConnectionMock(), new ClientMock() );

	function prepareTest( eventName ) {
		var callback = jasmine.createSpy( 'callback-for-' + eventName );
		list.setEntries([ 'a', 'b', 'c', 'd', 'e' ]);
		list.once( eventName, callback );
		return callback;
	}
	
	it( 'creates the list', function( done ){
		var callback = jasmine.createSpy( 'empty-subscribe' );

		list = new List( recordHandler, 'someList', {} );

		recordHandler._$handle({
			topic: 'R',
			action: 'R',
			data: [ 'someList', 1, '{}' ]
		});

		expect( list.getEntries() ).toEqual( [] );
		expect( list.isEmpty() ).toBe( true );

		list.whenReady( function() {
			list.subscribe( callback, true );
			expect( callback.calls.argsFor( 0 )[ 0 ] ).toEqual( [] );
			done();
		});
	});

	it( 'works without any listeners', function(){
		var callback = jasmine.createSpy( 'normal-subscribe' );
		list.setEntries([ 'a', 'b', 'c', 'd', 'e' ]);
		list.subscribe( callback );
		list.setEntries([ 'a', 'b', 'c', 'd', 'e', 'f' ]);
		expect( callback ).toHaveBeenCalledWith([ 'a', 'b', 'c', 'd', 'e', 'f' ]);
		expect( callback.calls.count() ).toBe( 1 );
	});

	it( 'notifies the listener when a new item is added to the end of the list', function(){
		var callback = prepareTest( 'entry-added' );
		list.addEntry( 'f' );
		expect( callback ).toHaveBeenCalledWith( 'f', 5 );
		expect( callback.calls.count() ).toBe( 1 );
	});

	it( 'notifies the listener when a new item is added to the end of the list by another client', function(){
		var callback = prepareTest( 'entry-added' );
		recordHandler._$handle({
			topic: 'R',
			action: 'U',
			data: [ 'someList', 7, '["a","b","c","d","e","x"]' ]
		});
		expect( callback ).toHaveBeenCalledWith( 'x', 5 );
		expect( callback.calls.count() ).toBe( 1 );
	});

	it( 'notifies the listener when a new item is added to an index within the list', function(){
		var callback = prepareTest( 'entry-added' );
		list.addEntry( 'f', 3 );
		expect( callback ).toHaveBeenCalledWith( 'f', 3 );
		expect( callback.calls.count() ).toBe( 1 );
	});

	it( 'notifies the listener when an entry is removed from the list', function(){
		var callback = prepareTest( 'entry-removed' );
		list.removeEntry( 'c' );
		expect( callback ).toHaveBeenCalledWith( 'c', 2 );
		expect( callback.calls.count() ).toBe( 1 );
	});

	it( 'notifies the listener when an entry is moved within the list', function(){
		var callback = jasmine.createSpy( 'callback-for-move' );
		list.setEntries([ 'a', 'b', 'c', 'd', 'e' ]);
		list.on( 'entry-moved', callback );
		list.setEntries([ 'a', 'b', 'e', 'd', 'c' ]);
		expect( callback ).toHaveBeenCalledWith( 'e', 2 );
		expect( callback ).toHaveBeenCalledWith( 'c', 4 );
		expect( callback.calls.count() ).toBe( 2 );
	});

	it( 'notifies the listener when another instance of the same item is added to an index within the list', function(){
		var callback = prepareTest( 'entry-added' );
		list.addEntry( 'a', 3 );
		expect( callback ).toHaveBeenCalledWith( 'a', 3 );
		expect( callback.calls.count() ).toBe( 1 );
	});

	it( 'notifies the listener when another instance of the same item is added to the end of the list', function(){
		var callback = prepareTest( 'entry-added' );
		list.addEntry( 'b' );
		expect( callback ).toHaveBeenCalledWith( 'b', 5 );
		expect( callback.calls.count() ).toBe( 1 );
	});

	it( 'notifies the listener when the second instance of an item is removed from the list', function(){
		var removeCallback = jasmine.createSpy( 'remove-callback' );

		list.setEntries([ 'a', 'b', 'c', 'd', 'c','e' ]);
		list.on( 'entry-removed', removeCallback );
		list.setEntries([ 'a', 'b', 'c', 'd', 'e' ]);
		expect( removeCallback ).toHaveBeenCalledWith( 'c', 4 );
	});

	it( 'notifies the listener for a move / remove combination', function(){
		var moveCallback = jasmine.createSpy( 'move-callback' );
		var removeCallback = jasmine.createSpy( 'remove-callback' );
		
		list.setEntries([ 'a', 'b', 'c', 'd', 'e' ]);
		list.on( 'entry-moved', moveCallback );
		list.on( 'entry-removed', removeCallback );
		list.setEntries([ 'a', 'd', 'b', 'c' ]);
		
		expect( moveCallback ).toHaveBeenCalledWith( 'd', 1 );
		expect( moveCallback ).toHaveBeenCalledWith( 'b', 2 );
		expect( moveCallback ).toHaveBeenCalledWith( 'c', 3 );
		expect( removeCallback ).toHaveBeenCalledWith( 'e', 4 );
	});

	it( 'notifies the listener for an add / move combination', function(){
		var moveCallback = jasmine.createSpy( 'move-callback' );
		var addCallback = jasmine.createSpy( 'add-callback' );
		
		list.setEntries([ 'a', 'b', 'c', 'd', 'e' ]);
		list.on( 'entry-moved', moveCallback );
		list.on( 'entry-added', addCallback );
		list.setEntries([ 'a', 'b', 'c', 'c', 'd', 'e' ]);
		
		expect( addCallback ).toHaveBeenCalledWith( 'c', 3 );
		expect( addCallback.calls.count() ).toBe( 1 );
		expect( moveCallback ).toHaveBeenCalledWith( 'd', 4 );
		expect( moveCallback ).toHaveBeenCalledWith( 'e', 5 );
		expect( moveCallback.calls.count() ).toBe( 2 );
	});

	it( 'notifies the listener for an add / move / remove combination', function(){
		var moveCallback = jasmine.createSpy( 'move-callback' );
		var addCallback = jasmine.createSpy( 'add-callback' );
		var removeCallback = jasmine.createSpy( 'remove-callback' );
		
		list.setEntries([ 'a', 'b', 'c', 'd', 'e' ]);
		list.on( 'entry-moved', moveCallback );
		list.on( 'entry-added', addCallback );
		list.on( 'entry-removed', removeCallback );
		list.setEntries([ 'c', 'b', 'f' ]);
		
		expect( addCallback ).toHaveBeenCalledWith( 'f', 2 );
		expect( addCallback.calls.count() ).toBe( 1 );
		expect( moveCallback ).toHaveBeenCalledWith( 'c', 0 );
		expect( moveCallback.calls.count() ).toBe( 1 );
		expect( removeCallback ).toHaveBeenCalledWith( 'a', 0 );
		expect( removeCallback ).toHaveBeenCalledWith( 'd', 3 );
		expect( removeCallback ).toHaveBeenCalledWith( 'e', 4 );
		expect( removeCallback.calls.count() ).toBe( 3 );
	});
});
