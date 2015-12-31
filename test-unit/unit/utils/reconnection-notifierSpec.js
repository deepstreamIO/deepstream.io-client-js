var C = require( '../../../src/constants/constants' ),
	ReconnectionNotifier = require( '../../../src/utils/reconnection-notifier' ),
	ClientMock = require( '../../mocks/client-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg;


describe( 'reconnection notifier', function(){
	var registry,
		reconnectionNotifier,
		mockClient = new ClientMock(),
		reconnectCallback = jasmine.createSpy( 'reconnect callback' );

	it( 'creates connection notifier', function() {
		reconnectionNotifier = new ReconnectionNotifier( mockClient, reconnectCallback );
	});

	it( 'calls reconnect when it loses the connection', function() {
		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.RECONNECTING );

		expect( reconnectCallback.callCount ).toEqual( 1 );
	});

	it( 'does not call reconnect again if connection hasn\'t been recreated', function() {
		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.RECONNECTING );

		expect( reconnectCallback.callCount ).toEqual( 1 );
	});

	it( 'calls reconnect if it loses the connection again', function() {
		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.OPEN );
		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.RECONNECTING );

		expect( reconnectCallback.callCount ).toEqual( 2 );
	});

	it( 'no longer listens to connectionState after being destroyed', function() {
		reconnectionNotifier.destroy();

		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.OPEN );
		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.RECONNECTING );
		
		expect( reconnectCallback.callCount ).toEqual( 2 );
	});
});