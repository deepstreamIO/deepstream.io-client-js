/* global it, describe, expect, jasmine */
var proxyquire = require( 'proxyquire' ),
	ConnectionMock = require( '../mocks/message/connection-mock' ),
	deepstream = proxyquire( '../../src/client', { './message/connection': ConnectionMock } );
	
describe( 'connects', function(){
	var client,
		stateChangeCallback = jasmine.createSpy( 'stateChangeCallback' );
	
	it( 'creates the client', function() {
		client = deepstream( 'someUrl' );
		expect( client.getConnectionState() ).toBe( 'CLOSED' );
	//	expect( client._connection.lastSendMessage ).toBe( null );
	});
});
