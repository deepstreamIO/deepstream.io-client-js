/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
    deepstreamClient = require( '../../src/client' ),
    TestLogger = require( '../tools/test-logger' );

describe( 'it recovers a connection without losing record updates', function() {
    var deepstreamServer,
        logger = new TestLogger(),
        clientA,
        record,
        clientAErrors = [];

    /**************** SETUP ****************/
    it( 'starts the server', function( done ){
        deepstreamServer = new DeepstreamServer();
        deepstreamServer.once( 'started', done );
        deepstreamServer.set( 'logger', logger );
        deepstreamServer.set( 'showLogo', false );
        deepstreamServer.start();
    });

    /**************** TESTS ****************/
    it( 'connects', function( done ) {
        clientA = deepstreamClient( 'localhost:6021' );
        clientA.on( 'error', function(){
            clientAErrors.push( arguments );
            console.log( arguments );
        });
        clientA.login( null, function(){ done(); });
    });

    it( 'requests a record', function( done ){
        record = clientA.record.getRecord( 'recordA1' );
        record.whenReady( done );
    });

    it( 'updates the record whilst connected', function( done ){
        var i = 0,
            interval = setInterval(function(){
                record.set( 'somePath', i );
                i++;
                if( i === 3 ) {
                    clearInterval( interval );
                    done();
                }
            }, 30 );
    });

    it( 'shuts down the server', function(done) {
      deepstreamServer.stop();
      clientA.once( 'error', function(){ done(); });
    });

    it( 'has received an error on the client', function(){
        expect( clientA.getConnectionState() ).toBe( 'RECONNECTING' );
        expect( clientAErrors.length ).toBe( 1 );
        expect( clientAErrors[ 0 ] ).toEqual([
            'Can\'t connect! Deepstream server unreachable on localhost:6021',
            'connectionError',
            null
        ]);
    });

     it( 'updates the record whilst disconnected', function( done ){
        var i = 4,
            interval = setInterval(function(){
                record.set( 'somePath', i );
                i++;
                if( i === 7 ) {
                    clearInterval( interval );
                    done();
                }
            }, 30 );
    });

    it( 'restarts the server', function( done ){
        deepstreamServer.once( 'started', done );
        deepstreamServer.start();
    });

    it( 'waits for the client to reconnect', function( done ){
        clientA.on( 'connectionStateChanged', function(){
            if( clientA.getConnectionState() === 'OPEN' ) {
                done();
            }
        });
    });

    it( 'sets the record', function( done ){
        record.set( 'somePath', 8 );
        setTimeout( done, 500 );
    });

    it( 'has received one VERSION_EXISTS error', function() {
        expect( clientAErrors.length ).toBe( 2 );
    });

     /**************** TEAR DOWN ****************/
    it( 'closes the clients', function() {
        clientA.close();
    });

    it( 'shuts clients and server down', function(done) {
      deepstreamServer.on( 'stopped', done );
      deepstreamServer.stop();
    });
});
