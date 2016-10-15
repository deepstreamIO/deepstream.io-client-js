var sinon = require( 'sinon' );
var config = require( '../config' );
var check = require( '../helper' ).check;
var lastEventName;
var lastEventData;
var listenCallback = sinon.spy();

module.exports = function() {
	this.When( /^the client publishes an event named "(\w*)" with data "(\w*)"$/, function( eventName, eventData, callback ){
		global.dsClient.event.emit( eventName, eventData );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.Then( /^the client received the event "(\w*)" with data "(\w*)"$/, function(eventName, eventData, callback ){
		check( 'last event name', eventName, lastEventName, callback, true );
		check( 'last event data', eventData, lastEventData, callback );
	});

	/**
	* Subscribes
	*/
	this.When( /^the client subscribes to an event named "(\w*)"$/, function( eventName, callback ){
		global.dsClient.event.subscribe( eventName, function( data ){
			lastEventName = eventName;
			lastEventData = data;
		});
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When( /^the client unsubscribes from an event named "(\w*)"$/, function( eventName, callback ){
		global.dsClient.event.unsubscribe( eventName );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	/**
	* Listen
	*/
	this.When(/^the client listens to events matching "([^"]*)"$/, function (pattern, callback) {
		global.dsClient.event.listen( pattern, listenCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.Then(/^the client will be notified of new event match "([^"]*)"$/, function ( eventName) {
		sinon.assert.calledWith( listenCallback, eventName, true );
	});

	this.Then(/^the client will be notified of event match removal "([^"]*)"$/, function (eventName) {
	  sinon.assert.calledWith( listenCallback, eventName, false );
	});

	this.When(/^the client unlistens to events matching "([^"]*)"$/, function (pattern, callback) {
	  	global.dsClient.event.unlisten( pattern, listenCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});
};