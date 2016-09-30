'use strict'

const sinon = require( 'sinon' );

const C = require( '../../../src/constants/constants' );

const clientHandler = require('./client-handler');
const utils = require('./utils');

const clients = clientHandler.clients;

module.exports = function (){

  this.Given(/^(?:subscriber|publisher|client) (\S*) connects to server (\d+)$/, (client, server, done) => {
    clientHandler.createClient( client, server );
    done();
  });

  this.Given(/^(?:subscriber|publisher|client) (\S*) connects and logs into server (\d+)$/, (client, server, done) => {
    clientHandler.createClient( client, server );
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
      const errorSpy = clients[ client ].error[ C.TOPIC.CONNECTION ][ C.EVENT.CONNECTION_AUTHENTICATION_TIMEOUT ];
      sinon.assert.calledOnce( errorSpy );
      errorSpy.reset();
      done();
    }, 1000 );
  });

}
