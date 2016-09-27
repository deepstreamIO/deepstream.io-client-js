'use strict'

const sinon = require( 'sinon' );

const C = require( '../../src/constants/constants' );

const clientHandler = require('./client-handler');

const clients = clientHandler.clients;

module.exports = function () {

  this.Then(/^(?:all clients|(?:subscriber|publisher|client) (\S*)) receives? at least one "([^"]*)" error "([^"]*)"$/, ( client, topicName, eventName ) => {
    const topic = C.TOPIC[ topicName.toUpperCase() ];
    const event = C.EVENT[ eventName.toUpperCase() ];

    const iterClients = client ? [ client ] : Object.keys( clients );
    for ( const client of iterClients ){
      const errorSpy = clients[ client ].error[ topic ][ event ];
      sinon.assert.called( errorSpy );
      errorSpy.reset();
    }
  });

  this.Then(/^(?:all clients|(?:subscriber|publisher|client) (\S*)) receives? "([^"]*)" error "([^"]*)"$/, ( client, topicName, eventName ) => {
    const topic = C.TOPIC[ topicName.toUpperCase() ];
    const event = C.EVENT[ eventName.toUpperCase() ];

    const iterClients = client ? [ client ] : Object.keys( clients );
    for ( const client of iterClients ){
      const errorSpy = clients[ client ].error[ topic ][ event ];
      sinon.assert.calledOnce( errorSpy );
      errorSpy.reset();
    }
  });

  this.Then(/^(?:all clients|(?:subscriber|publisher|client) (\S*)) received? no errors$/, ( client ) => {
    const iterClients = client ? [ client ] : Object.keys( clients );
    for ( const client of iterClients ){
      clientHandler.assertNoErrors( client );
    }
  });

  /********************************************************************************************************************************
   *************************************************** Boiler Plate ***************************************************************
   ********************************************************************************************************************************/

  this.Before(( /*scenario*/ ) => {
    // client are connecting via "Background" explictly
  });

  this.After((scenario, done) => {
    for( const client in clients ) {

      clientHandler.assertNoErrors( client );

      for( const event in clients[ client ].event.callbacks ) {
        if( clients[ client ].event.callbacks[ event ].isSubscribed !== false ) {
          clients[ client ].client.event.unsubscribe( event, clients[ client ].event.callbacks[ event ] );
        }
      }

      setTimeout( function ( client ) {
        for( const pattern in clients[ client ].event.callbacksListeners ) {
          if( clients[ client ].event.callbacksListeners[ pattern ].isListening !== false ) {
            clients[ client ].client.event.unlisten( pattern, clients[ client ].event.callbacksListeners[ pattern ] );
          }
        }
      }.bind( null, client ), 1 );

      setTimeout( function ( client ) {
        clients[ client ].client.close();
        delete clients[client];
      }.bind( null, client ), 50 )
    }

    setTimeout( done, 100 );
  });

};
