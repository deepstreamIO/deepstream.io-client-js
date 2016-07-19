/* global expect, it, describe, jasmine */
var RecordHandler = require( '../../../src/record/record-handler' ),
	ClientMock = require( '../../mocks/client-mock' ),
	ConnectionMock = require( '../../mocks/message/connection-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	options = {};

describe( 'record handler returns the right records', function(){

	var recordHandler,
		recordA,
		onDiscard = jasmine.createSpy( 'onDiscard' ),
		connection = new ConnectionMock(),
		client = new ClientMock();

	it( 'creates the RecordHandler', function(){
		recordHandler = new RecordHandler( options, connection, client );
		expect( typeof recordHandler.getRecord ).toBe( 'function' );
	});

	it( 'retrieves recordA', function(){
		expect( connection.lastSendMessage ).toBe( null );
		recordA = recordHandler.getRecord( 'recordA' );
		recordA.on( 'discard', onDiscard );
		expect( connection.lastSendMessage ).toBe( msg( 'R|CR|recordA+' ) );
	});

	it( 'initialises recordA', function(){
		expect( recordA.isReady ).toBe( false );
		recordHandler._$handle({
			topic: 'R',
			action: 'R',
			data: [ 'recordA', 0, '{}' ]
		});
		expect( recordA.isReady ).toBe( true );
	});

	it( 'discards recordA', function(){
		recordA.discard();
		expect( onDiscard ).not.toHaveBeenCalled();
		expect( recordA.isDestroyed ).toBe( false );
		expect( connection.lastSendMessage ).toBe( msg( 'R|US|recordA+' ) );
	});

	it( 'returns a new recordA and resubscribes', function(){
		expect( recordHandler.getRecord( 'recordA' ) ).not.toBe( recordA );
		expect( recordA.isDestroyed ).toBe( false );
		expect( connection.lastSendMessage ).toBe( msg( 'R|CR|recordA+' ) );
	});

	it( 'has destroyed record A when discard ack is received', function(){
		recordHandler._$handle({
			topic: 'R',
			action: 'A',
			data: [ 'US', 'recordA' ]
		});
		expect( onDiscard ).toHaveBeenCalled();
		expect( recordA.isDestroyed ).toBe( true );
	});
});


describe( 'removes deleted records', function(){

	var recordHandler,
		recordA,
		onDelete = jasmine.createSpy( 'onDelete' ),
		connection = new ConnectionMock(),
		client = new ClientMock();

	it( 'creates the RecordHandler', function(){
		recordHandler = new RecordHandler( options, connection, client );
		expect( typeof recordHandler.getRecord ).toBe( 'function' );
	});

	it( 'retrieves recordA', function(){
		expect( connection.lastSendMessage ).toBe( null );
		recordA = recordHandler.getRecord( 'recordA' );
		recordA.on( 'delete', onDelete );
		expect( connection.lastSendMessage ).toBe( msg( 'R|CR|recordA+' ) );
	});

	it( 'initialises recordA', function(){
		expect( recordA.isReady ).toBe( false );
		recordHandler._$handle({
			topic: 'R',
			action: 'R',
			data: [ 'recordA', 0, '{}' ]
		});
		expect( recordA.isReady ).toBe( true );
	});

	it( 'receives a delete message', function(){
		expect( onDelete ).not.toHaveBeenCalled();
		expect( recordA.isDestroyed ).toBe( false );
		recordHandler._$handle({
			topic: 'R',
			action: 'A',
			data: [ 'D', 'recordA' ]
		});
		expect( onDelete ).toHaveBeenCalled();
		expect( recordA.isDestroyed ).toBe( true );
	});

	it( 'returns a new recordA and resubscribes', function(){
		var newRecordA = recordHandler.getRecord( 'recordA' );
		expect( newRecordA ).not.toBe( recordA );
		expect( newRecordA.isDestroyed ).toBe( false );
		expect( connection.lastSendMessage ).toBe( msg( 'R|CR|recordA+' ) );
	});
});