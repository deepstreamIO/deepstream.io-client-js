const sinon = require( 'sinon' );
const DeepstreamClient = require( '../../src/client' );
const Cluster = require( '../cluster' );
const clients = {};

module.exports = function() {
 this.Given(/^client (\d+) connects to server (\d+)$/, function (client, server) {
	 clients[ client ] = {
	 	client: DeepstreamClient( Cluster.getUrl( server ) ),
	 	eventCallbacks: {},
	 	recordCallbacks: {}
	 }
 });

 this.Given(/^client (\d+) logs in with username "([^"]*)" and password "([^"]*)"$/, function (client, username, password, callback) {
	 clients[ client ].client.login( {
			username: username,
			password: password
	 }, function() {
			callback();
	 } );
 });

 this.Given(/^client (\d+) subscribes to an event named "([^"]*)"$/, function ( client, eventName ) {
 	 clients[ client ].eventCallbacks[ eventName ] = sinon.spy();
	 clients[ client ].client.event.subscribe( eventName, clients[ client ].eventCallbacks[ eventName ] );
 });

this.When(/^client (\d+) publishes an event named "([^"]*)" with data "([^"]*)"$/, function (client, eventName, data, callback) {
	 clients[ client ].client.event.emit( eventName, data );
	 setTimeout( callback, 100 );
 });

 this.Then(/^client (\d+) received the event "([^"]*)" with data "([^"]*)"$/, function (client, eventName, data) {
 	sinon.assert.calledOnce(clients[ client ].eventCallbacks[ eventName ])
 	sinon.assert.calledWith(clients[ client ].eventCallbacks[ eventName ], data);
 	clients[ client ].eventCallbacks[ eventName ].reset();
 });

	this.When(/^client (\d+) unsubscribes from an event named "([^"]*)"$/, function (client, eventName) {
		clients[ client ].client.event.unsubscribe( eventName, clients[ client ].eventCallbacks[ eventName ] );
	});

	this.Then(/^client (\d+) recieved no event named "([^"]*)"$/, function (client, eventName) {
		sinon.assert.notCalled(clients[ client ].eventCallbacks[ eventName ]);
	});
};