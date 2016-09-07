/* global describe, expect, it, jasmine */
var PresenceHandler = require( '../../../src/presence/presence-handler' ),
	connectionMock = new (require( '../../mocks/message/connection-mock' ))(),
	mockClient = new (require( '../../mocks/client-mock' ))(),
	msg = require( '../../test-helper/test-helper' ).msg,
	options = { subscriptionTimeout: 5 };
	
describe( 'presence handler', function(){
	var presenceHandler,
		callback = jasmine.createSpy( 'presenceCallback' );
	
	it( 'creates the presenceHandler', function(){
		presenceHandler = new PresenceHandler( options, connectionMock, mockClient );
	});

	it( 'subscibes to client logins', function() {
		presenceHandler.subscribeToLogins( callback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'PN|S|PNJ+' ) );
	});

	it( 'subscibes to client logouts', function() {
		presenceHandler.subscribeToLogouts( callback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'PN|S|PNL+' ) );
	});

	it( 'receives ack for subscribe to client logouts', function() {
		presenceHandler._$handle({
			topic: 'PN',
			action: 'A',
			data: [ 'S', 'PNL' ]
		});
		expect( connectionMock.lastSendMessage ).toBe( msg( 'PN|S|PNL+' ) );
	});
	
	it( 'emits an error if no ack message is received for client login subscription', function( done ){
		expect( mockClient.lastError ).toBe( null );
		setTimeout(function(){
			var errorParams = [ 'PN', 'ACK_TIMEOUT', 'No ACK message received in time for PNJ' ];
			expect( mockClient.lastError ).toEqual( errorParams );
			mockClient.lastError = null;
			done();
		}, 20 );
	});
	
	it( 'notified when client logs in', function() {
		expect( callback ).not.toHaveBeenCalled();
		presenceHandler._$handle({
			topic: 'PN',
			action: 'PNJ',
			data: [ 'Homer' ]
		});
	    expect( callback ).toHaveBeenCalledWith( 'Homer' );
	});

	it( 'notified when client logs out', function() {
		presenceHandler._$handle({
			topic: 'PN',
			action: 'PNL',
			data: [ 'Marge' ]
		});
	    expect( callback ).toHaveBeenCalledWith( 'Marge' );
	});

	it( 'queries for clients', function() {
	    presenceHandler.getCurrentClients( callback );
	    expect( connectionMock.lastSendMessage ).toBe( msg( 'PN|Q+' ) );
	});

	it( 'receives data for query', function() {
	    presenceHandler._$handle({
			topic: 'PN',
			action: 'Q',
			data: [ 'Marge', 'Homer', 'Bart' ]
		});
	    expect( callback ).toHaveBeenCalledWith( [ 'Marge', 'Homer', 'Bart' ] );
	});	
});

