/* global describe, expect, it, jasmine */
var PresenceHandler = require( '../../../src/presence/presence-handler' ),
	connectionMock = new (require( '../../mocks/message/connection-mock' ))(),
	mockClient = new (require( '../../mocks/client-mock' ))(),
	msg = require( '../../test-helper/test-helper' ).msg,
	C = require( '../../../src/constants/constants' ),
	options = { subscriptionTimeout: 5 };
	
describe( 'presence handler', function(){
	var presenceHandler,
		callback = jasmine.createSpy( 'presenceCallback' );

	it( 'creates the presenceHandler', function(){
		presenceHandler = new PresenceHandler( options, connectionMock, mockClient );
	});

	it( 'subscribes to presence events', function() {
		presenceHandler.subscribe( callback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'U|S|U+' ) );
	});

	it( 'receives ack for subscribing to presence events', function() {
		presenceHandler._$handle({
			topic: 'U',
			action: 'A',
			data: [ 'S', 'U' ]
		});
		expect( connectionMock.lastSendMessage ).toBe( msg( 'U|S|U+' ) );
	});
	
	xit( 'emits an error if no ack message is received for client login subscription', function( done ){
		expect( mockClient.lastError ).toBe( null );
		setTimeout(function(){
			var errorParams = [ 'U', 'ACK_TIMEOUT', 'No ACK message received in time for PNJ' ];
			expect( mockClient.lastError ).toEqual( errorParams );
			mockClient.lastError = null;
			done();
		}, 20 );
	});
	
	it( 'notified when client logs in', function() {
		expect( callback ).not.toHaveBeenCalled();
		presenceHandler._$handle({
			topic: 'U',
			action: 'PNJ',
			data: [ 'Homer' ]
		});
	    expect( callback ).toHaveBeenCalledWith( 'PNJ', 'Homer' );
	});

	it( 'notified when client logs out', function() {
		presenceHandler._$handle({
			topic: 'U',
			action: 'PNL',
			data: [ 'Marge' ]
		});
	    expect( callback ).toHaveBeenCalledWith( 'PNL', 'Marge' );
	});

	it( 'queries for clients', function() {
	    presenceHandler.getCurrentClients( callback );
	    expect( connectionMock.lastSendMessage ).toBe( msg( 'U|Q|Q+' ) );
	});

	it( 'receives data for query', function() {
	    presenceHandler._$handle({
			topic: 'U',
			action: 'Q',
			data: [ 'Marge', 'Homer', 'Bart' ]
		});
	    expect( callback ).toHaveBeenCalledWith( [ 'Marge', 'Homer', 'Bart' ] );
	});	

	it( 'unsubscribes to presence events', function() {
		presenceHandler.unsubscribe( callback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'U|US|U+' ) );
	});

	it( 'does not receive a presence event when a client logs in', function() {
		presenceHandler.unsubscribe( callback );
		presenceHandler._$handle({
			topic: 'U',
			action: 'PNJ',
			data: [ 'Lisa' ]
		});
		expect( callback ).not.toHaveBeenCalledWith( 'PNJ', 'Lisa' );
	});
});