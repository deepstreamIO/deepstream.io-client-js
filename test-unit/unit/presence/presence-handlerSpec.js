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

	beforeEach( function() {
		connectionMock.lastSendMessage = null;
		callback.calls.reset();
	});

	it( 'creates the presenceHandler', function(){
		presenceHandler = new PresenceHandler( options, connectionMock, mockClient );
	});

	it( 'subscribes to presence', function() {
		presenceHandler.subscribe( callback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'U|S|S+' ) );
	});

	it( 'emits an error if no ack message is received for presence subscription', function( done ){
		expect( mockClient.lastError ).toBe( null );
		setTimeout(function(){
			var errorParams = [ 'U', 'ACK_TIMEOUT', 'No ACK message received in time for U' ];
			expect( mockClient.lastError ).toEqual( errorParams );
			mockClient.lastError = null;
			done();
		}, 20 );
	});

	xit( 'receives ack for subscribe', function() {
		presenceHandler._$handle({
			topic: 'U',
			action: 'A',
			data: [ 'S' ]
		});
		expect( connectionMock.lastSendMessage ).toBeNull();
	}).pend( 'Throws unsolicitated error message since timeout has been cleared');

	it( 'notified when client logs in', function() {
		expect( callback ).not.toHaveBeenCalled();
		presenceHandler._$handle({
			topic: 'U',
			action: 'PNJ',
			data: [ 'Homer' ]
		});
	    expect( callback ).toHaveBeenCalledWith( 'Homer', true );
	});

	it( 'notified when client logs out', function() {
		presenceHandler._$handle({
			topic: 'U',
			action: 'PNL',
			data: [ 'Marge' ]
		});
	    expect( callback ).toHaveBeenCalledWith( 'Marge', false );
	});

	it( 'queries for clients', function() {
	    presenceHandler.getAll( callback );
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

	it( 'unsubscribes to client logins', function() {
		presenceHandler.unsubscribe( callback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'U|US|US+' ) );
	});

	it( 'emits an error if no ack message is received for presence unsubscribes', function( done ){
		expect( mockClient.lastError ).toBe( null );
		setTimeout(function(){
			var errorParams = [ 'U', 'ACK_TIMEOUT', 'No ACK message received in time for U' ];
			expect( mockClient.lastError ).toEqual( errorParams );
			mockClient.lastError = null;
			done();
		}, 20 );
	});

	xit( 'receives ack for unsubscribe', function() {
		presenceHandler._$handle({
			topic: 'U',
			action: 'A',
			data: [ 'US' ]
		});
		expect( connectionMock.lastSendMessage ).toBeNull();
	}).pend( 'Throws unsolicitated error message since timeout has been cleared');

	it( 'not notified of future actions', function() {
		expect( callback ).not.toHaveBeenCalled();
		presenceHandler._$handle({
			topic: 'U',
			action: 'PNJ',
			data: [ 'Homer' ]
		});
	    expect( callback ).not.toHaveBeenCalled();

	   	presenceHandler._$handle({
			topic: 'U',
			action: 'PNL',
			data: [ 'Homer' ]
		});
	    expect( callback ).not.toHaveBeenCalled();

	    presenceHandler._$handle({
			topic: 'U',
			action: 'Q',
			data: [ 'Marge', 'Homer', 'Bart' ]
		});
	    expect( callback ).not.toHaveBeenCalled();
	});

});