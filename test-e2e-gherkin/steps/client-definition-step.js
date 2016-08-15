const sinon = require( 'sinon' );
const DeepstreamClient = require( '../../src/client' );
const Cluster = require( '../cluster' );
const config = require( '../config' );
const clients = {};
const defaultDelay = config.defaultDelay

module.exports = function() {
 this.Given(/^client (\d+) connects to server (\d+)$/, function (client, server) {
	 clients[ client ] = {
		client: DeepstreamClient( Cluster.getUrl( server ) ),
		eventCallbacks: {},
		eventCallbacksListeners: {},
		eventCallbacksListenersSpies: {},
		eventCallbacksListenersResponse: {},
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

 this.Given(/^client (\d+) subscribes to an event named "([^"]*)"$/, function ( client, eventName, done ) {
	 clients[ client ].eventCallbacks[ eventName ] = sinon.spy();
	 clients[ client ].client.event.subscribe( eventName, clients[ client ].eventCallbacks[ eventName ] );
	 setTimeout( done, defaultDelay );
 });

this.When(/^client (\d+) publishes an event named "([^"]*)" with data "([^"]*)"$/, function (client, eventName, data, done) {
	 clients[ client ].client.event.emit( eventName, data );
	 setTimeout( done, defaultDelay );
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

    this.When(/^client (\d+) (accepts|rejects) a match "([^"]*)" for pattern "([^"]*)"$/, function (client, action, subscriptionName, eventPattern) {
    	clients[ client ].eventCallbacksListenersResponse[ eventPattern ] = ( action === "accepts" ? true : false);
    });

	this.Given(/^client (\d+) listens to an event with pattern "([^"]*)"$/, function (client, eventPattern, done) {
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

	this.Then(/^client (\d+) receives a match "([^"]*)" for pattern "([^"]*)"$/, function (client, match, eventPattern) {
		var listenCallbackSpy = clients[ client ].eventCallbacksListenersSpies[ eventPattern ];
		//sinon.assert.calledOnce(clients[ client ].eventCallbacksListenersSpies[ eventPattern ])
		sinon.assert.calledWith(clients[ client ].eventCallbacksListenersSpies[ eventPattern ], match, true );
	});

	this.Then(/^client (\d+) does not receive a match "([^"]*)" for pattern "([^"]*)"$/, function (client, match, eventPattern) {
		var listenCallbackSpy = clients[ client ].eventCallbacksListenersSpies[ eventPattern ];
		sinon.assert.neverCalledWith(listenCallbackSpy, match);
	});

	this.Then(/^the clients are stopped$/, function () {

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
