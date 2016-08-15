const sinon = require( 'sinon' );
const DeepstreamClient = require( '../../src/client' );
const Cluster = require( '../cluster' );
const config = require( '../config' );
const clients = {};
const defaultDelay = config.defaultDelay

module.exports = function() {
 this.Given(/^(?:subscriber|publisher) (\S)* connects to server (\d+)$/, function (client, server) {
	 clients[ client ] = {
		client: DeepstreamClient( Cluster.getUrl( server ) ),
		eventCallbacks: {},
		eventCallbacksListeners: {},
		eventCallbacksListenersSpies: {},
		eventCallbacksListenersResponse: {},
		recordCallbacks: {}
	 }
 });

 this.Given(/^(?:subscriber|publisher) (\S)* logs in with username "([^"]*)" and password "([^"]*)"$/, function (client, username, password, callback) {
	 clients[ client ].client.login( {
			username: username,
			password: password
	 }, function() {
			callback();
	 } );
});

 this.Given(/^(?:subscriber|publisher) (\S)* subscribes to an event named "([^"]*)"$/, function ( client, eventName, done ) {
	 clients[ client ].eventCallbacks[ eventName ] = sinon.spy();
	 clients[ client ].client.event.subscribe( eventName, clients[ client ].eventCallbacks[ eventName ] );
	 setTimeout( done, defaultDelay );
 });

this.When(/^(?:subscriber|publisher) (\S)* publishes an event named "([^"]*)" with data "([^"]*)"$/, function (client, eventName, data, done) {
	 clients[ client ].client.event.emit( eventName, data );
	 setTimeout( done, defaultDelay );
 });

 this.Then(/^(?:subscriber|publisher) (\S)* received the event "([^"]*)" with data "([^"]*)"$/, function (client, eventName, data) {
	sinon.assert.calledOnce(clients[ client ].eventCallbacks[ eventName ])
	sinon.assert.calledWith(clients[ client ].eventCallbacks[ eventName ], data);
	clients[ client ].eventCallbacks[ eventName ].reset();
 });

	this.When(/^(?:subscriber|publisher) (\S)* unsubscribes from an event named "([^"]*)"$/, function (client, eventName) {
		clients[ client ].client.event.unsubscribe( eventName, clients[ client ].eventCallbacks[ eventName ] );
	});

	this.Then(/^(?:subscriber|publisher) (\S)* recieved no event named "([^"]*)"$/, function (client, eventName) {
		sinon.assert.notCalled(clients[ client ].eventCallbacks[ eventName ]);
	});

	this.When(/^(?:publisher) (\S)* (accepts|rejects) a match "([^"]*)" for pattern "([^"]*)"$/, function (client, action, subscriptionName, eventPattern) {
		clients[ client ].eventCallbacksListenersResponse[ eventPattern ] = ( action === "accepts" ? true : false);
	});

	this.When(/^(?:publisher) (\S)* listens to an event with pattern "([^"]*)"$/, function (client, eventPattern, done) {
		clients[ client ].eventCallbacksListenersSpies[ eventPattern ] = sinon.spy();
		clients[ client ].eventCallbacks[ eventPattern ] = function( subscribtionName, isSubscribed, response) {
			if( isSubscribed ) {
				if( clients[ client ].eventCallbacksListenersResponse[ eventPattern ].accepts ) {
					response.accept();
				} else {
					response.reject();
				}
			}
			clients[ client ].eventCallbacksListenersSpies[ eventPattern ]( subscribtionName, isSubscribed );
		};
		clients[ client ].client.event.listen( eventPattern, clients[ client ].eventCallbacks[ eventPattern ] );
		setTimeout( done, defaultDelay );
	});

	this.When(/^(?:subscriber|publisher) (\S)* unlistens to the pattern "([^"]*)"$/, function (client, eventPattern, done) {
		clients[ client ].client.event.unlisten( eventPattern );
		setTimeout( done, defaultDelay );
	});

	this.Then(/^(?:publisher) (\S)* receives a match "([^"]*)" for pattern "([^"]*)"$/, function (client, match, eventPattern) {
		// TODO
	});

	this.Then(/^(?:publisher) (\S)* does not receive a match "([^"]*)" for pattern "([^"]*)"$/, function (client, match, eventPattern) {
		var listenCallbackSpy = clients[ client ].eventCallbacksListenersSpies[ eventPattern ];
		sinon.assert.neverCalledWith(listenCallbackSpy, match);
	});


	this.Before(function (scenario) {
		// client are connecting via "Background" explictly
	});

	this.After(function (scenario) {
		for( var client in clients ) {
			clients[ client ].client.close();
		}
	});

};
