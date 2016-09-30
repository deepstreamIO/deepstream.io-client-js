'use strict'

const sinon = require( 'sinon' );

const clients = {};

const utils = require('./utils');

const DeepstreamClient = require( '../../../src/client' );

function createClient( clientName, server ) {
  clients[ clientName ] = {
    name: clientName,
    client: DeepstreamClient( global.cluster.getUrl( server - 1 ), {
      maxReconnectInterval: 300,
      maxReconnectAttempts: 20,
    } ),
    login: sinon.spy(),
    error: {},
    event: {
      callbacks: {},
      callbacksListeners: {},
      callbacksListenersSpies: {},
      callbacksListenersResponse: {},
    },
    record: {
      records: {
        // Creates a similar structure when record is requests
        xxx: {
          record: null,
          discardCallback: null,
          deleteCallback: null,
          callbackError: null,
          subscribeCallback: null,
          subscribePathCallbacks: {}
        }
      },
      lists: {
        xxx: {
          list: null,
          discardCallback: null,
          deleteCallback: null,
          callbackError: null,
          subscribeCallback: null,
          addedCallback: null,
          removedCallback: null,
          movedCallback: null
        }
      },
      anonymousRecord: null,
      snapshotCallback: sinon.spy(),
      hasCallback: sinon.spy(),
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

  clients[ clientName ].client.on( 'error', ( message, event, topic ) => {
    console.log( 'An Error occured on', clientName , message, event, topic );

    const clientErrors = clients[ clientName ].error;
    clientErrors[ topic ]          = clientErrors[ topic ]          || {};
    clientErrors[ topic ][ event ] = clientErrors[ topic ][ event ] || sinon.spy();
    clients[ clientName ].error[ topic ][ event ]( message );
  });
}

function getClients( expression ) {
  const clientExpression = /all clients|(?:subscriber|publisher|clients?) ([^\s']*)(?:'s)?/;
  const result = clientExpression.exec( expression );
  if( result[ 0 ] === 'all clients' ) {
    return Object.keys( clients ).map( ( client ) => {
      return clients[ client ];
    });
  }
  else if( result.length === 2 ) {
    return [ clients[ result[ 1 ] ] ];
  } else {
    throw `Invalid expression: ${expression}`;
  }
}

function assertNoErrors( client ){
  const clientErrors = clients[ client ].error;
  for ( const topic in clientErrors ){
    for ( const event in clientErrors[ topic ] ){
      sinon.assert.notCalled( clientErrors[ topic ][ event ] );
    }
  }
}

module.exports = {
  clients,
  createClient,
  getClients,
  assertNoErrors
}
