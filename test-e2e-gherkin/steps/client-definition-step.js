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
    rpc: {
      callbacks: {},
      provides: {},
      callbacksListeners: {},
      callbacksListenersSpies: {},
      callbacksListenersResponse: {},
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
    clients[ client ].client.login( {}, function() {
      callback();
    } );
  });

  this.Given(/^(?:subscriber|publisher|client) (\S)* logs in with username "([^"]*)" and password "([^"]*)"$/, function (client, username, password, callback) {
    clients[ client ].client.login( {
        username: username,
        password: password
    }, function() {
        callback();
    } );
  });

  /********************************************************************************************************************************
   ************************************************ EVENTS ******************************************************************
   ********************************************************************************************************************************/

  this.When(/^(?:subscriber|publisher|client) (\S)* publishes an event named "([^"]*)" with data ("[^"]*"|\d+|\{.*\})$/, function (client, subscriptionName, data, done) {
    clients[ client ].client.event.emit( subscriptionName, JSON.parse(data) );
    setTimeout( done, defaultDelay );
  });

  this.Then(/^(?:subscriber|publisher|client) (\S)* receives the event "([^"]*)" with data ("[^"]*"|\d+|\{.*\})$/, function (client, subscriptionName, data) {
    sinon.assert.calledOnce(clients[ client ].event.callbacks[ subscriptionName ]);
    sinon.assert.calledWith(clients[ client ].event.callbacks[ subscriptionName ], JSON.parse(data));
    clients[ client ].event.callbacks[ subscriptionName ].reset();
  });

  this.Then(/^all (?:subscriber|publisher|client)s receive the event "([^"]*)" with data ("[^"]*"|\d+|\{.*\})$/, function (subscriptionName, data) {
    for ( var client in clients ){
      sinon.assert.calledOnce(clients[client].event.callbacks[ subscriptionName ]);
      sinon.assert.calledWith(clients[client].event.callbacks[ subscriptionName ], JSON.parse(data));
      clients[client].event.callbacks[ subscriptionName ].reset();
    }
  });

  this.Given(/^(?:subscriber|publisher|client) (\S)* subscribes to (?:a|an) (event|record) named "([^"]*)"$/, function ( client, type, subscriptionName, done ) {
    clients[ client ][ type ].callbacks[ subscriptionName ] = sinon.spy();
    clients[ client ].client[ type ].subscribe( subscriptionName, clients[ client ][ type ].callbacks[ subscriptionName ] );
    setTimeout( done, defaultDelay );
  });

  this.Given(/^all (?:subscriber|publisher|client)s subscribe to (?:a|an) (event|record) named "([^"]*)"$/, function ( type, subscriptionName, done ) {
    for (var client in clients) {
      clients[ client ][ type ].callbacks[ subscriptionName ] = sinon.spy();
      clients[ client ].client[ type ].subscribe( subscriptionName, clients[ client ][ type ].callbacks[ subscriptionName ] );
      setTimeout( done, defaultDelay );
    }
  });

  this.When(/^(?:subscriber|publisher|client) (\S)* unsubscribes from (?:a|an) (event|record) named "([^"]*)"$/, function (client, type, subscriptionName, done) {
    clients[ client ].client.event.unsubscribe( subscriptionName, clients[ client ].event.callbacks[ subscriptionName ] );
    clients[ client ].event.callbacks[ subscriptionName ].isSubscribed = false;
    setTimeout( done, defaultDelay );
  });

  this.Then(/^(?:subscriber|publisher|client) (\S)* receives no event named "([^"]*)"$/, function (client, subscriptionName) {
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

  this.Then(/^publisher (\S)* removes (\d+) (event|record) (?:match|matches) "([^"]*)" for pattern "([^"]*)"$/, function (client, count, type, subscriptionName, pattern) {
    var listenCallbackSpy = clients[ client ][ type ].callbacksListenersSpies[ pattern ];
    sinon.assert.callCount( listenCallbackSpy.withArgs( subscriptionName, false ), Number( count ) )
  });

  /********************************************************************************************************************************
   ******************************************************** RPCs ******************************************************************
   ********************************************************************************************************************************/


  this.Given(/^(?:subscriber|publisher|client) (\S)* provides the RPC "([^"]*)"$/, function (provider, rpc, done) {
    const rpcs = {
      addTwo: function( provider, data, response ){
        clients[ provider ].rpc.provides[ 'addTwo' ]();
        //console.log("addTwo called with data", data, "provider", provider);
        response.send( data.numA + data.numB );
      },
      alwaysReject: function( provider, data, response ){
        clients[ provider ].rpc.provides[ 'alwaysReject' ]();
        response.reject();
      },
      clientBRejects: function( provider, data, response ){
        clients[ provider ].rpc.provides[ 'clientBRejects' ]();
        console.log(provider, "clientBRejects")
        if( provider === 'B' ){
          response.reject();
        } else {
          response.send( data.root * data.root );
        }
      }
    }

    clients[ provider ].rpc.provides[ rpc ] = sinon.spy();
    clients[ provider ].client.rpc.provide( rpc, rpcs[ rpc ].bind(null, provider) );
    setTimeout( done, defaultDelay );
  });

  this.When(/^(?:subscriber|publisher|client) (\S)* calls the RPC "([^"]*)" with arguments? (\{.*\})$/, function (client, rpc, args, done) {
    var callback = clients[ client ].rpc.callbacks[ rpc ] = sinon.spy();
    clients[ client ].client.rpc.make( rpc, JSON.parse(args), callback );
    setTimeout( done, defaultDelay );
  });

  this.Then(/^client (\S)* receives a response for RPC "([^"]*)" with data ("[^"]*"|\d+|\{.*\})$/, function (client, rpc, data) {
    sinon.assert.calledOnce(clients[ client ].rpc.callbacks[ rpc ]);
    sinon.assert.calledWith(clients[ client ].rpc.callbacks[ rpc ], null, JSON.parse(data));
    clients[ client ].rpc.callbacks[ rpc ].reset();
  });

  this.Then(/^client (\S)* receives a response for RPC "([^"]*)" with error "([^"]*)"$/, function (client, rpc, error) {
    sinon.assert.calledOnce(clients[ client ].rpc.callbacks[ rpc ]);
    sinon.assert.calledWith(clients[ client ].rpc.callbacks[ rpc ], error);
    clients[ client ].rpc.callbacks[ rpc ].reset();
  });

  this.Then(/^client (\S)*'s RPC "([^"]*)" is (never called|called (once|(\d+) times?))$/, function (provider, rpc, never, once, timesCalled){
    if ( never[0] === 'n'){
      timesCalled = 0;
    } else if ( once[0] === 'o' ){
      timesCalled = 1;
    } else {
      timesCalled = parseInt( timesCalled );
    }
    sinon.assert.callCount( clients[ provider ].rpc.provides[ rpc ], timesCalled );
    clients[ provider ].rpc.provides[ rpc ].reset();
  });

  /********************************************************************************************************************************
   *************************************************** Boiler Plate ***************************************************************
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
