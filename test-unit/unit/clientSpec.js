/* global it, describe, expect, jasmine */
var proxyquire = require( 'proxyquire' ),
	ConnectionMock = require( '../mocks/message/connection-mock' ),
	deepstream = proxyquire( '../../src/client', { './message/connection': ConnectionMock } );
	
describe( 'connects', function(){
	var client,
		stateChangeCallback = jasmine.createSpy( 'stateChangeCallback' );
	
	it( 'creates the client', function() {
		client = deepstream( 'someUrl', {} );
		expect( client.getConnectionState() ).toBe( 'CLOSED' );
		expect( client._connection.lastSendMessage ).toBe( null );
	});

	it( 'receives a different uid for every call', function(){
		expect( client.getUid() ).not.toBe( client.getUid() );
	});

	it( 'merges options correctly', function(){
		client = deepstream( 'someUrl', {
			recordPersistDefault: false
		} );
		expect( client._options.recordPersistDefault ).toBe( false );
	});
});
