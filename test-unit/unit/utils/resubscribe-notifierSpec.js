var C = require( '../../../src/constants/constants' ),
	ResubscribeNotifier = require( '../../../src/utils/resubscribe-notifier' ),
	ClientMock = require( '../../mocks/client-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg;


describe( 'resubscribe notifier', function(){
	var registry,
		resubscribeNotifier,
		mockClient = new ClientMock(),
		resubscribeCallback = jasmine.createSpy( 'resubscribeCallback' );

	it( 'creates connection notifier', function() {
		resubscribeNotifier = new ResubscribeNotifier( mockClient, resubscribeCallback );
	});

	it( 'doesn\'t call resubscribe when it loses the connection', function() {
		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.RECONNECTING );
		expect( resubscribeCallback.calls.count() ).toEqual( 0 );
	});

	it( 'calls resubscribe once connection is back open ( which is also authenticated )', function() {
		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.OPEN );
		expect( resubscribeCallback.calls.count() ).toEqual( 1 );
	});

	it( 'no longer listens to connectionState after being destroyed', function() {
		resubscribeNotifier.destroy();

		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.RECONNECTING );
		mockClient.emit( 'connectionStateChanged', C.CONNECTION_STATE.OPEN );
		
		expect( resubscribeCallback.calls.count() ).toEqual( 1 );
	});
});