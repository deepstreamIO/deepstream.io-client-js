'use strict'

const assert = require('assert');
const sinon = require( 'sinon' );

const DeepstreamClient = require( '../../src/client' );
const C = require( '../../src/constants/constants' );
const Cluster = require( '../tools/cluster' );

const clients = {};
const defaultDelay = process.env.defaultDelay || 10;
const clientExpression = /all clients|(?:subscriber|publisher|clients?) (\S*)/;

function parseData( data ) {
  if( data === 'undefined' ) {
    return undefined;
  } else if( data === 'null' ) {
    return null;
  } else {
    try {
      return JSON.parse( data );
    } catch(e) {
      console.log( 'Illegal data:', data )
      return data;
    }
  }
}


function getClients( expression ) {
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

function getRecordData( expression, recordName ) {
  return getClients( expression ).map( ( client ) => {
    return client.record.records[ recordName ];
  } );
}

function getListData( expression, listName ) {
  return getClients( expression ).map( ( client ) => {
    return client.record.lists[ listName ];
  } );
}

function createClient( clientName, server ) {
  clients[ clientName ] = {
    client: DeepstreamClient( Cluster.getUrl( server - 1 ), {
      maxReconnectInterval: 300,
      maxReconnectAttempts: 20,
    } ),
    login: sinon.spy(),
    error: sinon.spy(),
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
  clients[ clientName ].client.on( 'error', ( a, b, c ) => {
    console.log( 'An Error occured on', clientName , a, b, c );
  });

  clients[ clientName ].client.on( 'error', clients[ clientName ].error );
}

module.exports = function () {
  /********************************************************************************************************************************
   ************************************************ CONNECTIVITY ******************************************************************
   ********************************************************************************************************************************/
  this.Given(/^(?:subscriber|publisher|client) (\S*) connects to server (\d+)$/, (client, server, done) => {
    createClient( client, server );
    done();
  });

  this.Given(/^(?:subscriber|publisher|client) (\S*) connects and logs into server (\d+)$/, (client, server, done) => {
    createClient( client, server );
    clients[ client ].client.login( { username: client, password: 'abcdefgh' }, () => {
      done();
    } );
  });

  this.Given(/^(?:subscriber|publisher|client) (\S*) logs in with username "([^"]*)" and password "([^"]*)"$/, ( client, username, password, done ) => {
    clients[ client ].client.login( {
        username: username,
        password: password
    }, ( success, data ) => {
      clients[ client  ].login( success, data );
      done();
    } );
  });

  this.When(/^(?:subscriber|publisher|client) (\S*) attempts to login with username "([^"]*)" and password "([^"]*)"$/, ( client, username, password ) => {
    clients[ client ].client.login( {
        username: username,
        password: password
    } );
  } );

  this.Then(/^(?:subscriber|publisher|client) (\S*) is notified of too many login attempts$/, ( client ) => {
    const loginSpy = clients[ client ].login;
    sinon.assert.callCount( loginSpy, 2 );
    sinon.assert.calledWith( loginSpy, false, undefined );
    sinon.assert.calledWith( loginSpy, false, 'too many authentication attempts' );
    loginSpy.reset();
  });

  this.Then(/^(?:subscriber|publisher|client) (\S*) receives (no|an (un)?authenticated) login response(?: with data (\{.*\}))?$/, ( client, no, unauth, data ) => {
    const loginSpy = clients[ client ].login;
    if ( no.match(/^no$/) ) {
      sinon.assert.notCalled( loginSpy )
    } else if ( !unauth ) {
      sinon.assert.calledOnce( loginSpy );
      if ( data ) {
        sinon.assert.calledWith( loginSpy, true, JSON.parse( data ) );
      }
      else {
        sinon.assert.calledWith( loginSpy, true, null );
      }
    }
    else {
      sinon.assert.calledOnce( loginSpy );
      sinon.assert.calledWith( loginSpy, false );
    }
    loginSpy.reset();
  });

  this.Then(/^(?:subscriber|publisher|client) (\S*)'s connection times out$/, ( client, done ) => {
    setTimeout( () => {
      const errorSpy = clients[ client ].error;
      sinon.assert.calledOnce( errorSpy );
      //sinon.assert.calledWith( errorSpy, 'A', 1 );
      sinon.assert.calledWithMatch( errorSpy, sinon.match.any, 'CONNECTION_AUTHENTICATION_TIMEOUT', 'C' );
      errorSpy.reset();
      done();
    }, 1000 );
  });

  this.Then(/^(?:all clients|(?:subscriber|publisher|client) (\S*)) receives? at least one "([^"]*)" error "([^"]*)"$/, ( client, topicName, eventName ) => {
    const topic = C.TOPIC[ topicName.toUpperCase() ];
    const event = C.EVENT[ eventName.toUpperCase() ];

    const iterClients = client ? [ client ] : Object.keys( clients );
    for ( const client of iterClients ){
      const callback = clients[ client ].error;
      sinon.assert.called( callback );
      sinon.assert.calledWith( callback, sinon.match.any, event, topic );
      callback.reset();
    }
  });

  this.Then(/^(?:all clients|(?:subscriber|publisher|client) (\S*)) receives? "([^"]*)" error "([^"]*)"$/, ( client, topicName, eventName ) => {
    const topic = C.TOPIC[ topicName.toUpperCase() ];
    const event = C.EVENT[ eventName.toUpperCase() ];

    const iterClients = client ? [ client ] : Object.keys( clients );
    for ( const client of iterClients ){
      const callback = clients[ client ].error;
      sinon.assert.calledOnce( callback );
      sinon.assert.calledWith( callback, sinon.match.any, event, topic);
      callback.reset();
    }
  });

  this.Then(/^(?:all clients|(?:subscriber|publisher|client) (\S*)) received? no errors$/, ( client ) => {
    const iterClients = client ? [ client ] : Object.keys( clients );
    for ( const client of iterClients ){
      const callback = clients[ client ].error;
      sinon.assert.notCalled( callback );
    }
  });

  /********************************************************************************************************************************
   ************************************************************ EVENTS ************************************************************
   ********************************************************************************************************************************/

  this.When(/^(?:subscriber|publisher|client) (\S*) publishes an event "([^"]*)"(?: with data ("[^"]*"|\d+|\{.*\}))?$/, (client, subscriptionName, data, done) => {
    clients[ client ].client.event.emit( subscriptionName, parseData( data ) );
    setTimeout( done, defaultDelay );
  });

  this.Then(/^(.+) receives? (the|no) event "([^"]*)"(?: with data (.+))?$/, (clientExpression, theNo, subscriptionName, data) => {
    const doesReceive = !theNo.match(/^no$/);

    getClients( clientExpression ).forEach( ( client ) => {
      let eventSpy = client.event.callbacks[ subscriptionName ];
      if ( doesReceive ){
        sinon.assert.calledOnce( eventSpy );
        sinon.assert.calledWith( eventSpy, parseData( data ) );
        eventSpy.reset();
      } else {
        sinon.assert.notCalled( eventSpy );
      }
    } );
  });

  this.Given(/^(.+) subscribes? to an event "([^"]*)"$/, ( clientExpression, subscriptionName, done ) => {
    getClients( clientExpression ).forEach( ( client ) => {
      client.event.callbacks[ subscriptionName ] = sinon.spy();
      client.client.event.subscribe( subscriptionName, client.event.callbacks[ subscriptionName ] );
    } );
    setTimeout( done, defaultDelay );
  });

  this.When(/^(.+) unsubscribes from an event "([^"]*)"$/, (clientExpression, subscriptionName, done) => {
    getClients( clientExpression ).forEach( ( client ) => {
      client.client.event.unsubscribe( subscriptionName, client.event.callbacks[ subscriptionName ] );
      client.event.callbacks[ subscriptionName ].isSubscribed = false;
    } );
    setTimeout( done, defaultDelay );
  });

  /********************************************************************************************************************************
   *********************************************************** Lists ************************************************************
   ********************************************************************************************************************************/
  this.When(/(.+) gets? the list "([^"]*)"$/, function ( clientExpression, listName, done ) {
    getClients( clientExpression ).forEach( ( client ) => {
        let listData = {
          list: client.client.record.getList( listName ),
          discardCallback: sinon.spy(),
          deleteCallback: sinon.spy(),
          callbackError: sinon.spy(),
          subscribeCallback: sinon.spy(),
          addedCallback: sinon.spy(),
          removedCallback: sinon.spy(),
          movedCallback: sinon.spy()
        }
        listData.list.on( 'discard', listData.discardCallback );
        listData.list.on( 'delete', listData.deleteCallback );
        listData.list.on( 'entry-added', listData.addedCallback );
        listData.list.on( 'entry-removed', listData.removedCallback );
        listData.list.on( 'entry-moved', listData.movedCallback );
        listData.list.subscribe( listData.subscribeCallback );
        client.record.lists[ listName ] = listData;
    } );
    setTimeout( done, defaultDelay );
  } );

  this.Given(/^(.+) sets the entries on the list "([^"]*)" to '([^']*)'$/, function (clientExpression, listName, data, done) {
    data = parseData( data );
    getListData( clientExpression, listName ).forEach( ( listData ) => {
      listData.list.setEntries( data );
    });
    setTimeout( done, defaultDelay );
  });

  this.Given(/^(.+) (adds|removes) an entry "([^"]*)" (?:to|from) "([^""]*)"$/, function (clientExpression, action, entryName, listName, done) {
    getListData( clientExpression, listName ).forEach( ( listData ) => {
      if( action === 'adds' ) {
        listData.list.addEntry( entryName );
      } else {
        listData.list.removeEntry( entryName );
      }
    });
    setTimeout( done, defaultDelay );
  });


  this.Then(/^(.+) have a list "([^"]*)" with entries '([^']*)'$/, function (clientExpression, listName, data) {
    data = parseData( data );
    getListData( clientExpression, listName ).forEach( ( listData ) => {
      assert.deepEqual( listData.list.getEntries(), data );
    });
  });

  this.Then(/^(.+) gets notified of "([^"]*)" being (added|removed|moved) (?:to|in|from) "([^""]*)"$/, function (clientExpression, entryName, action, listName) {
    getListData( clientExpression, listName ).forEach( ( listData ) => {
      if( action === 'added' ) {
        sinon.assert.calledWith( listData.addedCallback, entryName );
      } else if( action === 'removed' ) {
        sinon.assert.calledWith( listData.removedCallback, entryName );
      } else {
        sinon.assert.calledWith( listData.movedCallback, entryName );
      }
    });
  });

  this.Then(/^(.+) gets? notified of list "([^"]*)" entries changing to '([^']*)'$/, function (clientExpression, listName, data) {
    data = parseData( data );
    getListData( clientExpression, listName ).forEach( ( listData ) => {
      //sinon.assert.calledOnce( listData.subscribeCallback );
      sinon.assert.calledWith( listData.subscribeCallback, data );
    });
  });

  /********************************************************************************************************************************
   *********************************************************** ANONYMOUS RECORDS ************************************************************
   ********************************************************************************************************************************/
  this.When(/(.+) gets? a anonymous record$/, function ( clientExpression ) {
    getClients( clientExpression ).forEach( ( client ) => {
        client.record.anonymousRecord = client.client.record.getAnonymousRecord();
    } );
  });

  this.When(/(.+) sets? the underlying record to "([^"]*)" on the anonymous record$/, function ( clientExpression, recordName, done ) {
    getClients( clientExpression ).forEach( ( client ) => {
      console.log( recordName )
        client.record.anonymousRecord.setName( recordName );
    } );
    setTimeout( done, defaultDelay );
  });

  this.When(/(.+) anoynmous record value is '([^']*)'$/, function ( clientExpression, data ) {
    data = parseData( data );
    getClients( clientExpression ).forEach( ( client ) => {
        assert.deepEqual( client.record.anonymousRecord.get(), data);
    } );
  });

  /********************************************************************************************************************************
   *********************************************************** RECORDS ************************************************************
   ********************************************************************************************************************************/
  this.When(/(.+) gets? the record "([^"]*)"$/, function ( clientExpression, recordName, done) {
    getClients( clientExpression ).forEach( ( client ) => {
      let recordData = {
          record: client.client.record.getRecord( recordName ),
          discardCallback: sinon.spy(),
          deleteCallback: sinon.spy(),
          callbackError: sinon.spy(),
          subscribeCallback: sinon.spy(),
          subscribePathCallbacks: {}
        }
        recordData.record.on( 'discard', recordData.discardCallback );
        recordData.record.on( 'delete', recordData.deleteCallback );
        client.record.records[ recordName ] = recordData;
    } );
    setTimeout( done, defaultDelay );
  });

  this.Then(/^(.+) gets notified of record "([^"]*)" getting (discarded|deleted)$/, function (clientExpression, recordName, action) {
    getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      if( action === 'discarded' ) {
        sinon.assert.calledOnce( recordData.discardCallback );
        recordData.discardCallback.reset();
      } else {
        sinon.assert.calledOnce( recordData.deleteCallback );
        recordData.deleteCallback.reset();
      }
    });
  });

  this.Then(/^(.+) recieves? an update for record "([^"]*)" with data '([^']+)'$/, function (clientExpression, recordName, data) {
    data = parseData( data );
    getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      sinon.assert.calledOnce( recordData.subscribeCallback );
      sinon.assert.calledWith( recordData.subscribeCallback, data );
      recordData.subscribeCallback.reset();
    });
  });

  this.Then(/^(.+) recieves? an update for record "([^"]*)" and path "([^"]*)" with data '([^']+)'$/, function (clientExpression, recordName, path, data) {
    data = parseData( data );
    getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      sinon.assert.calledOnce( recordData.subscribePathCallbacks[ path ] );
      sinon.assert.calledWith( recordData.subscribePathCallbacks[ path ], data );
      recordData.subscribePathCallbacks[ path ].reset();
    });
  });

  this.Then(/^(.+) (?:don't|doesn't|does not) recieve an update for record "([^"]*)"$/, function (clientExpression, recordName) {
    getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      sinon.assert.notCalled( recordData.subscribeCallback );
    });
  });

  this.Then(/^(.+) don't recieve an update for record "([^"]*)" and path "([^"]*)"$/, function (clientExpression, recordName, path) {
    getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      sinon.assert.notCalled( recordData.subscribePathCallbacks[ path ] );
    });
  });

  this.Given(/^(.+) (un)?subscribes? to record "([^"]*)"( with immediate flag)?$/, ( clientExpression, not, recordName, immedate ) => {
     getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      if( !!not ) {
        recordData.record.unsubscribe( recordData.subscribeCallback );
      } else {
        recordData.record.subscribe( recordData.subscribeCallback, !!immedate );
      }
    });
  });

  this.Given(/^(.+) (un)?subscribes? to record "([^"]*)" with path "([^"]*)"( with immediate flag)?$/, ( clientExpression, not, recordName, path, immedate ) => {
    getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      if( !!not ) {
        recordData.record.unsubscribe( path, recordData.subscribePathCallbacks[ path ] );
      } else {
        recordData.subscribePathCallbacks[ path ] = sinon.spy();
        recordData.record.subscribe( path, recordData.subscribePathCallbacks[ path ], !!immedate );
      }
    });
  });

  this.Then(/^(.+) record "([^"]*)" value is '([^']+)'$/, function ( clientExpression, recordName, data ) {
    data = parseData( data );
    getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      assert.deepEqual( data, recordData.record.get() );
    } );
  });

  this.Then(/^(.+) record "([^"]*)" path "([^"]*)" value is '([^']+)'$/, function ( clientExpression, recordName, path, data ) {
    data = parseData( data );
    getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      assert.deepEqual( data, recordData.record.get( path ) );
    } );
  });

  this.Given(/^(.+) (discards?|deletes?) record "([^"]*)"$/, function (clientExpression, action, recordName, done) {
    getRecordData( clientExpression, recordName ).forEach( ( recordData ) => {
      if( action.indexOf( 'di') > -1 ) {
        recordData.record.discard();
      } else {
        recordData.record.delete();
      }
    } );
    setTimeout( done, defaultDelay );
  });

  this.When(/^(?:subscriber|publisher|client) (\S*) sets the record "([^"]*)" with data '([^']+)'$/, function ( client, recordName, data, done) {
    clients[ client ].record.records[ recordName ].record.set( parseData( data ) );
    setTimeout( done, defaultDelay );
  });

  this.When(/^(?:subscriber|publisher|client) (\S*) sets the record "([^"]*)" path "([^"]*)" with data '([^']+)'$/, function ( client, recordName, path, data, done) {
    clients[ client ].record.records[ recordName ].record.set( path, parseData( data ) );
    setTimeout( done, defaultDelay );
  });

 this.Given(/^(?:subscriber|client) (\S*) requests a snapshot of record "([^"]*)"$/, function ( client, recordName, done) {
    clients[ client ].client.record.snapshot( recordName,  clients[ client ].record.snapshotCallback );
    setTimeout( done, defaultDelay );
  });

  this.Then(/^(?:subscriber|client) (\S*) gets a snapshot response for "([^"]*)" with (data|error) '([^']+)'$/, function ( client, recordName, type, data ) {
    sinon.assert.calledOnce(clients[ client ].record.snapshotCallback);
    if( type === 'data' ) {
      sinon.assert.calledWith(clients[ client ].record.snapshotCallback, null, parseData( data ));
    } else {
      sinon.assert.calledWith(clients[ client ].record.snapshotCallback, data.replace( /"/g, '' ) );
    }

    clients[ client ].record.snapshotCallback.reset();
  });

  this.Given(/^(?:subscriber|client) (\S*) asks if record "([^"]*)" exists$/, function (client, recordName, done) {
    clients[ client ].client.record.has( recordName, clients[ client ].record.hasCallback );
    setTimeout( done, defaultDelay );
  });

  this.Then(/^(?:subscriber|client) (\S*) gets told record "([^"]*)" (.*)exists?$/, function ( client, recordName, adjective ) {
    sinon.assert.calledOnce(clients[ client ].record.hasCallback);
    sinon.assert.calledWith(clients[ client ].record.hasCallback, null, adjective.indexOf('not') === -1 );
    clients[ client ].record.hasCallback.reset();
  });

  /********************************************************************************************************************************
   *************************************************** LISTENING ******************************************************************
   ********************************************************************************************************************************/

  this.When(/^publisher (\S*) (accepts|rejects) (?:a|an) (event|record) match "([^"]*)" for pattern "([^"]*)"$/, (client, action, type, subscriptionName, pattern) => {
    clients[ client ][ type ].callbacksListenersSpies[ pattern ].withArgs( subscriptionName, true );
    clients[ client ][ type ].callbacksListenersSpies[ pattern ].withArgs( subscriptionName, false );
    clients[ client ][ type ].callbacksListenersResponse[ pattern ] = ( action === 'accepts' );
  });

  this.When(/^publisher (\S*) listens to (?:a|an) (event|record) with pattern "([^"]*)"$/, (client, type, pattern, done) => {
    if( !clients[ client ][ type ].callbacksListenersSpies[ pattern ] ) {
      clients[ client ][ type ].callbacksListenersSpies[ pattern ] = sinon.spy();
    }

    clients[ client ][ type ].callbacksListeners[ pattern ] = ( subscriptionName, isSubscribed, response) => {
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

  this.When(/^publisher (\S*) unlistens to the (event|record) pattern "([^"]*)"$/, (client, type, pattern, done) => {
    clients[ client ].client[ type ].unlisten( pattern );
    clients[ client ][ type ].callbacksListeners[ pattern ].isListening = false;
    setTimeout( done, defaultDelay );
  });

  this.Then(/^publisher (\S*) does not receive (?:a|an) (event|record) match "([^"]*)" for pattern "([^"]*)"$/, (client, type, match, pattern) => {
    const listenCallbackSpy = clients[ client ][ type ].callbacksListenersSpies[ pattern ];
    sinon.assert.neverCalledWith(listenCallbackSpy, match);
  });

  this.Then(/^publisher (\S*) receives (\d+) (event|record) (?:match|matches) "([^"]*)" for pattern "([^"]*)"$/, (client, count, type, subscriptionName, pattern) => {
    const listenCallbackSpy = clients[ client ][ type ].callbacksListenersSpies[ pattern ];
    sinon.assert.callCount( listenCallbackSpy.withArgs( subscriptionName, true ), Number( count ) )
  });

  this.Then(/^publisher (\S*) removes (\d+) (event|record) (?:match|matches) "([^"]*)" for pattern "([^"]*)"$/, (client, count, type, subscriptionName, pattern) => {
    const listenCallbackSpy = clients[ client ][ type ].callbacksListenersSpies[ pattern ];
    sinon.assert.callCount( listenCallbackSpy.withArgs( subscriptionName, false ), Number( count ) )
  });

  /********************************************************************************************************************************
   ******************************************************** RPCs ******************************************************************
   ********************************************************************************************************************************/


  this.Given(/^(?:all clients|(?:subscriber|publisher|client) (\S*)) ((?:un)?provides?) the RPC "([^"]*)"$/, (provider, unprovides, rpc, done) => {
    const rpcs = {
      addTwo: ( client, data, response ) => {
        clients[ client ].rpc.provides.addTwo();
        //console.log("addTwo called with data", data, "client", client);
        response.send( data.numA + data.numB );
      },
      double: ( client, data, response ) => {
        clients[ client ].rpc.provides.double();
        response.send( data * 2 );
      },
      "a-provide-b-request": ( client, data, response ) => {
        clients[ client ].rpc.provides[ 'a-provide-b-request' ]();
        response.send( data * 3 );
      },
      "only-full-user-data": ( client, data, response ) => {
        clients[ client ].rpc.provides[ 'only-full-user-data' ]();
        response.send( 'ok' );
      },
      alwaysReject: ( client, data, response ) => {
        clients[ client ].rpc.provides.alwaysReject();
        response.reject();
      },
      clientBRejects: ( client, data, response ) => {
        clients[ client ].rpc.provides.clientBRejects();
        if( client === 'B' ){
          response.reject();
        } else {
          response.send( data.root * data.root );
        }
      }
    }

    const providers = provider ? [ provider ] : Object.keys( clients );

    if( unprovides.match( /unprovide/ ) ) {
      for( const provider of providers ) {
        clients[ provider ].client.rpc.unprovide( rpc );
      }
    } else {
      for( const provider of providers ){
        clients[ provider ].rpc.provides[ rpc ] = sinon.spy();
        clients[ provider ].client.rpc.provide( rpc, rpcs[ rpc ].bind(null, provider) );
      }
    }
    setTimeout( done, defaultDelay );
  });

  this.When(/^(?:subscriber|publisher|client) (\S*) calls the RPC "([^"]*)" with arguments? ("[^"]*"|\d+|\{.*\})$/, (client, rpc, args, done) => {
    const callback = clients[ client ].rpc.callbacks[ rpc ] = sinon.spy();
    clients[ client ].client.rpc.make( rpc, JSON.parse(args), ( a, b ) => {
      callback( a, b && b.toString() );
    } );
    setTimeout( done, defaultDelay );
  });


  this.Then(/^client (\S*) receives a response for RPC "([^"]*)" with data ("[^"]*"|\d+|\{.*\})$/, (client, rpc, data) => {
    sinon.assert.calledOnce(clients[ client ].rpc.callbacks[ rpc ]);
    sinon.assert.calledWith(clients[ client ].rpc.callbacks[ rpc ], null, JSON.parse(data).toString() );
    clients[ client ].rpc.callbacks[ rpc ].reset();
  });

  this.Then(/^client (\S*) receives a response for RPC "([^"]*)" with error "([^"]*)"$/, (client, rpc, error) => {
    sinon.assert.calledOnce(clients[ client ].rpc.callbacks[ rpc ]);
    sinon.assert.calledWith(clients[ client ].rpc.callbacks[ rpc ], error);
    clients[ client ].rpc.callbacks[ rpc ].reset();
  });

  this.Then(/^client (\S*)'s RPC "([^"]*)" is (never called|called (once|(\d+) times?))$/, (provider, rpc, never, once, timesCalled) => {
    if ( never[0] === 'n'){
      timesCalled = 0;
    } else if ( once[0] === 'o' ){
      timesCalled = 1;
    } else {
      timesCalled = parseInt( timesCalled, 10 );
    }
    sinon.assert.callCount( clients[ provider ].rpc.provides[ rpc ], timesCalled );
    clients[ provider ].rpc.provides[ rpc ].reset();
  });

  /********************************************************************************************************************************
   *************************************************** Boiler Plate ***************************************************************
   ********************************************************************************************************************************/

  this.Before(( /*scenario*/ ) => {
    // client are connecting via "Background" explictly
  });

  this.After((scenario, done) => {
    for( const client in clients ) {

        sinon.assert.notCalled( clients[ client ].error );

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
      }.bind( null, client ), 1 )

      setTimeout( function ( client ) {
        clients[ client ].client.close();
        delete clients[client];
      }.bind( null, client ), 50 )
    }

    setTimeout( done, 100 );
  });

};
