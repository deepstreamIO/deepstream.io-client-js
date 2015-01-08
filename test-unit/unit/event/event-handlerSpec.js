/* global describe, expect, it, jasmine */
var EventHandler = require( '../../../src/event/event-handler' ),
	connectionMock = new (require( '../../mocks/message/connection-mock' ))(),
	msg = require( '../../test-helper/test-helper' ).msg;
	
describe( 'event handler works', function(){
	var eventHandler,
		callback = jasmine.createSpy( 'eventCallback' );
	
	it( 'creates the eventHandler', function(){
		eventHandler = new EventHandler( {}, connectionMock );
		expect( eventHandler.emit ).toBeDefined();
	});
	
	it( 'emits an event it has no listeners for', function(){
		expect( connectionMock.lastSendMessage ).toBe( null );
		eventHandler.emit( 'myEvent', 6 );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'E|EVT|myEvent|N6+' ) );
	});
	
	it( 'subscribes to an event', function() {
	    eventHandler.subscribe( 'myEvent', callback );
	    expect( connectionMock.lastSendMessage ).toBe( msg( 'E|S|myEvent+' ) );
	});
	
	it( 'notifies local listeners for local events', function() {
		expect( callback ).not.toHaveBeenCalled();
	    eventHandler.emit( 'myEvent', 8 );
	    expect( callback ).toHaveBeenCalledWith( 8 );
	});
	
	it( 'notifies local listeners for remote events', function() {
		eventHandler._$handle({
			topic: 'EVENT',
			action: 'EVT',
			data: [ 'myEvent', 'N23' ]
		});
		
	    expect( callback ).toHaveBeenCalledWith( 23 );
	});
	
	it( 'notifies local listeners for remote events without data', function() {
		eventHandler._$handle({
			topic: 'EVENT',
			action: 'EVT',
			data: [ 'myEvent' ]
		});
		
	    expect( callback ).toHaveBeenCalledWith();
	});
	
	it( 'removes local listeners', function() {
		eventHandler.unsubscribe( 'myEvent', callback );
		eventHandler.emit( 'myEvent', 11 );
		expect( callback ).toHaveBeenCalledWith();
	});
	
	it( 'doesn\'t do anything for unsolicited event messages', function() {
		eventHandler._$handle({
			topic: 'EVENT',
			action: 'EVT',
			data: [ 'myEvent' ]
		});
	});
});