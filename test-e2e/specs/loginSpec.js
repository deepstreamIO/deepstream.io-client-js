/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
    deepstreamClient = require( '../../src/client' ),
    TestLogger = require( '../tools/test-logger' );
    
describe( 'record', function() {
    var deepstreamServer,
        logger = new TestLogger(),
        clientA,
        clientB,
        permissionHandler = {
        	isValidUser: function( handshakeData, authData, callback ) {
        		if( authData.username === 'validUserA' || authData.username === 'validUserB' ) {
        			callback( null, authData.username );
        		} else {
        			callback( 'Invalid user' );
        		}
        	},
        
        	canPerformAction: function( username, message, callback ) {
        		callback( null, true );
        	}
        };
    
    /**************** SETUP ****************/
    it( 'starts the server', function( done ){
        deepstreamServer = new DeepstreamServer();
        deepstreamServer.on( 'started', done );
        deepstreamServer.set( 'logger', logger );
        deepstreamServer.set( 'showLogo', false );
        deepstreamServer.set( 'maxAuthAttempts', 2 );
        deepstreamServer.set( 'permissionHandler', permissionHandler );
        deepstreamServer.start();
    });
    
    /**************** TESTS ****************/
    it( 'tries to log in with an invalid user', function( done ) {
        clientA = deepstreamClient( 'localhost:6021' );
        clientA.login({ username: 'Egon'}, function( success, event, error ){
            expect( success ).toBe( false );
            expect( event ).toBe( 'INVALID_AUTH_DATA' );
            expect( error ).toBe( 'Invalid user' );
            done();
        });
    });
    
    it( 'tries to log in a second time and exceeds maxAuthAttempts', function(done) {
        var firstcall = true;
        
        clientA.login({ username: 'Egon'}, function( success, event, error ){
            if( firstcall ) {
                expect( success ).toBe( false );
                expect( event ).toBe( 'INVALID_AUTH_DATA' );
                expect( error ).toBe( 'Invalid user' );
                firstcall = false;
            } else {
                expect( success ).toBe( false );
                expect( event ).toBe( 'TOO_MANY_AUTH_ATTEMPTS' );
                expect( error ).toBe( 'too many authentication attempts' );
                done();
            }
        });
    });
    
     /**************** TEAR DOWN ****************/
    it( 'closes the clients', function() {
        clientA.close();
        //clientB.close();
    });
    
    it( 'shuts clients and server down', function(done) {
      deepstreamServer.on( 'stopped', done );
      deepstreamServer.stop();
    });
});