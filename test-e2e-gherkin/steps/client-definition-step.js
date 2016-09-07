const sinon = require( 'sinon' );
const DeepstreamClient = require( '../../src/client' );
const Cluster = require( '../cluster' );
const config = require( '../config' );
const clients = {};
const defaultDelay = config.defaultDelay

function createClient( clientName, server ) {
	clients[ clientName ] = {
		client: DeepstreamClient( Cluster.getUrl( server - 1 ), {
			maxReconnectInterval: 200,
			maxReconnectAttempts: 5,
			lockTimeout: 5000,
			lockRequestTimeout: 5000
		} ),
		event: {
			callbacks: {},
			callbacksListeners: {},
			callbacksListenersSpies: {},
			callbacksListenersResponse: {},
		},
		record: {
			callbacks: {},
			callbacksListeners: {},
			callbacksListenersSpies: {},
			callbacksListenersResponse: {},
		},
		presence: {
			callbacks: {}
		}
	}
	clients[ clientName ].client.on( 'error', ( a, b, c) => {
 			console.log( 'An Error occured on ', clientName, a, b, c );
 	});
}

module.exports = function() {
	/********************************************************************************************************************************
	 ************************************************ CONNECTIVITY ******************************************************************
	 ********************************************************************************************************************************/
	this.Given(/^(?:subscriber|publisher|client) (\S)* connects to server (\d+)$/, function (client, server) {
 		createClient( client, server );
	});

	this.Given(/^(?:subscriber|publisher|client) (\S)* connects and logs into server (\d+)$/, function (client, server, callback) {
 		createClient( client, server );
 		clients[ client ].client.login( { username: client }, function() {
 			setTimeout( callback, defaultDelay );
 		} );
	});

	this.Given(/^(?:subscriber|publisher|client) (\S)* logs in with username "([^"]*)" and password "([^"]*)"$/, function (client, username, password, callback) {
	 	clients[ client ].client.login( {
				username: username,
				password: password
	 	}, function() {
				setTimeout( callback, defaultDelay );
	 	} );
	});

	this.When(/^(?:subscriber|publisher|client) (\S)* logs out$/, function (client, done) {
		clients[ client ].client.close();
		delete clients[ client ];
		setTimeout( done, defaultDelay );
	});

	/********************************************************************************************************************************
	 ************************************************ EVENTS ******************************************************************
	 ********************************************************************************************************************************/

	this.When(/^(?:subscriber|publisher) (\S)* publishes an event named "([^"]*)" with data "([^"]*)"$/, function (client, subscriptionName, data, done) {
		clients[ client ].client.event.emit( subscriptionName, data );
		setTimeout( done, defaultDelay );
	});

	this.Then(/^(?:subscriber|publisher) (\S)* received the event "([^"]*)" with data "([^"]*)"$/, function (client, subscriptionName, data) {
		sinon.assert.calledOnce(clients[ client ].event.callbacks[ subscriptionName ])
		sinon.assert.calledWith(clients[ client ].event.callbacks[ subscriptionName ], data);
		clients[ client ].event.callbacks[ subscriptionName ].reset();
	});


	this.Given(/^(?:subscriber|publisher) (\S)* subscribes to (?:a|an) (event|record) named "([^"]*)"$/, function ( client, type, subscriptionName, done ) {
		clients[ client ][ type ].callbacks[ subscriptionName ] = sinon.spy();
		clients[ client ].client[ type ].subscribe( subscriptionName, clients[ client ][ type ].callbacks[ subscriptionName ] );
		setTimeout( done, defaultDelay );
	});

	this.When(/^(?:subscriber|publisher) (\S)* unsubscribes from (?:a|an) (event|record) named "([^"]*)"$/, function (client, type, subscriptionName, done) {
		clients[ client ].client.event.unsubscribe( subscriptionName, clients[ client ].event.callbacks[ subscriptionName ] );
		clients[ client ].event.callbacks[ subscriptionName ].isSubscribed = false;
		setTimeout( done, defaultDelay );
	});

	this.Then(/^(?:subscriber|publisher) (\S)* received no event named "([^"]*)"$/, function (client, subscriptionName) {
		sinon.assert.notCalled(clients[ client ].event.callbacks[ subscriptionName ]);
	});

	/********************************************************************************************************************************
	 *************************************************** LISTENING ******************************************************************
	 ********************************************************************************************************************************/

	this.When(/^publisher (\S)* (accepts|rejects) (?:a|an) (event|record) match "([^"]*)" for pattern "([^"]*)"$/, function (client, action, type, subscriptionName, pattern) {
		clients[ client ][ type ].callbacksListenersSpies[ pattern ].withArgs( subscriptionName, true );
		clients[ client ][ type ].callbacksListenersSpies[ pattern ].withArgs( subscriptionName, false );
		clients[ client ][ type ].callbacksListenersResponse[ pattern ] = ( action === "accepts" ? true : false);
	});

	this.When(/^publisher (\S)* listens to (?:a|an) (event|record) with pattern "([^"]*)"$/, function (client, type, pattern, done) {
		if( !clients[ client ][ type ].callbacksListenersSpies[ pattern ] ) {
			clients[ client ][ type ].callbacksListenersSpies[ pattern ] = sinon.spy();
		}

		clients[ client ][ type ].callbacksListeners[ pattern ] = function( subscriptionName, isSubscribed, response) {
			if( isSubscribed ) {
				if( clients[ client ][ type ].callbacksListenersResponse[ pattern ] ) {
					response.accept();
				} else {
					response.reject();
				}
			}
			clients[ client ][ type ].callbacksListenersSpies[ pattern ]( subscriptionName, isSubscribed );
		};
		clients[ client ].client[ type ].listen( pattern, clients[ client ][ type ].callbacksListeners[ pattern ] );
		setTimeout( done, defaultDelay );
	});

	this.When(/^publisher (\S)* unlistens to the (event|record) pattern "([^"]*)"$/, function (client, type, pattern, done) {
		clients[ client ].client[ type ].unlisten( pattern );
		clients[ client ][ type ].callbacksListeners[ pattern ].isListening = false;
		setTimeout( done, defaultDelay );
	});

	this.Then(/^publisher (\S)* does not receive (?:a|an) (event|record) match "([^"]*)" for pattern "([^"]*)"$/, function (client, type, match, pattern) {
		var listenCallbackSpy = clients[ client ][ type ].callbacksListenersSpies[ pattern ];
		sinon.assert.neverCalledWith(listenCallbackSpy, match);
	});

	this.Then(/^publisher (\S)* receives (\d+) (event|record) (?:match|matches) "([^"]*)" for pattern "([^"]*)"$/, function (client, count, type, subscriptionName, pattern) {
		var listenCallbackSpy = clients[ client ][ type ].callbacksListenersSpies[ pattern ];
		sinon.assert.callCount( listenCallbackSpy.withArgs( subscriptionName, true ), Number( count ) )
	});

	this.Then(/^publisher (\S)* removed (\d+) (event|record) (?:match|matches) "([^"]*)" for pattern "([^"]*)"$/, function (client, count, type, subscriptionName, pattern) {
		var listenCallbackSpy = clients[ client ][ type ].callbacksListenersSpies[ pattern ];
		sinon.assert.callCount( listenCallbackSpy.withArgs( subscriptionName, false ), Number( count ) )
	});

	/********************************************************************************************************************************
	 *************************************************** PRESENCE *******************************************************************
	 ********************************************************************************************************************************/

	const loginEvent = 'in';
	const logoutEvent = 'out';
	const queryEvent = 'query';

	this.Given(/^(?:subscriber|publisher|client) (\S)* subscribes to client login events$/, function (client, done) {
		clients[ client ].presenceCallbacks[ loginEvent ] = sinon.spy();
		clients[ client ].client.onClientLogin( clients[ client ].presenceCallbacks[ loginEvent ] );
		setTimeout( done, defaultDelay );
	});

	this.Given(/^(?:subscriber|publisher|client) (\S)* subscribes to client logout events$/, function (client, done) {
		clients[ client ].presenceCallbacks[ logoutEvent ] = sinon.spy();
		clients[ client ].client.onClientLogout( clients[ client ].presenceCallbacks[ logoutEvent ] );
		setTimeout( done, defaultDelay );
	});

	this.Then(/^(?:client|clients) (\S)* (?:is|are) notified that (?:clients|client) (\S)* logged ([^"]*)$/, function (client, clientB, event) {
		sinon.assert.calledOnce( clients[ client ].presenceCallbacks[ event ] );
		sinon.assert.calledWith(clients[ client ].presenceCallbacks[ event ], clientB);
		clients[ client ].presenceCallbacks[ event ].reset();
	});

	this.When(/^(?:subscriber|publisher|client) (\S)* queries for connected clients$/, function (client, done) {
		clients[ client ].presenceCallbacks[ queryEvent ] = sinon.spy();
		clients[ client ].client.getCurrentClients( clients[ client ].presenceCallbacks[ queryEvent ] );
		setTimeout( done, defaultDelay );
	});

	this.Then(/^(?:subscriber|publisher|client) (\S)* knows that clients "([^"]*)" are connected$/, function (client, connectedClients) {
		sinon.assert.calledOnce( clients[ client ].presenceCallbacks[ queryEvent ] );
		sinon.assert.calledWith( clients[ client ].presenceCallbacks[ queryEvent ], connectedClients.split(',') );
		clients[ client ].presenceCallbacks[ queryEvent ].reset();
	});

	/********************************************************************************************************************************
	 *************************************************** Boiler Plate ******************************************************************
	 ********************************************************************************************************************************/

	this.Before(function (scenario) {
		// client are connecting via "Background" explictly
	});

	this.After(function (scenario, done) {
		for( var client in clients ) {

			for( var event in clients[ client ].event.callbacks ) {
				if( clients[ client ].event.callbacks[ event ].isSubscribed !== false ) {
					clients[ client ].client.event.unsubscribe( event, clients[ client ].event.callbacks[ event ] );
				}
			}

			setTimeout( function( client ) {
				for( var pattern in clients[ client ].event.callbacksListeners ) {
					if( clients[ client ].event.callbacksListeners[ pattern ].isListening !== false ) {
						clients[ client ].client.event.unlisten( pattern, clients[ client ].event.callbacksListeners[ pattern ] );
					}
				}
			}.bind( null, client ), 1 )

			setTimeout( function( client ) {
				clients[ client ].client.close();
				delete clients[client];
			}.bind( null, client ), 50 )
		}

		setTimeout( done, 100 );
	});

};