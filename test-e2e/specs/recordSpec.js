/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
    deepstreamClient = require( '../../src/client' ),
    TestLogger = require( '../tools/test-logger' );
    
describe( 'record', function() {
    var deepstreamServer,
        logger = new TestLogger(),
        clientA,
        clientB;
    
    /**************** SETUP ****************/
    it( 'starts the server', function( done ){
        deepstreamServer = new DeepstreamServer();
        deepstreamServer.on( 'started', done );
        //deepstreamServer.set( 'logger', logger );
        deepstreamServer.set( 'showLogo', false );
        deepstreamServer.start();
    });
    
    it( 'creates clientA', function( done ) {
        clientA = deepstreamClient( 'localhost:6021' );
        clientA.login( null, function(){ done(); });
    });
    
    it( 'creates clientB', function( done ) {
        clientB = deepstreamClient( 'localhost:6021' );
        clientB.login( null, function(){ done(); });
    });
    
     /**************** TEST ****************/
    it( 'subscribes and sets a record', function(done) {
        clientA.record.getRecord( 'record1' ).subscribe( 'user.firstname', function( firstname ){
            expect( firstname ).toBe( 'Wolfram' );
            done();
        });
        
        clientB.record.getRecord( 'record1' ).set({
            user: {
                firstname: 'Wolfram',
                lastname: 'Hempel'
            }
        });
    });
    
    it( 'maintains a local copy of the record', function() {
        expect( clientA.record.getRecord( 'record1' ).get( 'user.lastname' ) ).toBe( 'Hempel' );
    });
    
    it( 'sets a path', function( done ) {
        clientB.record.getRecord( 'record1' ).set( 'city', 'London' );
        expect( clientB.record.getRecord( 'record1' ).get( 'city' ) ).toBe( 'London' );
        expect( clientA.record.getRecord( 'record1' ).get( 'city' ) ).toBe( undefined );
        
        setTimeout(function(){
            expect( clientA.record.getRecord( 'record1' ).get( 'city' ) ).toBe( 'London' );
            done();
        }, 20 );
    });
    
    it( 'subscribes and unsubscribes', function( done ) {
        var city;
        
        // Trigger immediatly
        clientA.record.getRecord( 'record1' ).subscribe( 'city', function( _city ){ city = _city; }, true );
        expect( city ).toBe( 'London' );
        
        clientB.record.getRecord( 'record1' ).set( 'city', 'Berlin' );
        expect( city ).toBe( 'London' );
        
        setTimeout(function(){
            expect( city ).toBe( 'Berlin' );
            clientA.record.getRecord( 'record1' ).discard();
            clientB.record.getRecord( 'record1' ).set( 'city', 'Dresden' );
            setTimeout(function() {
                expect( city ).toBe( 'Berlin' );
                done();
            }, 20 );
        }, 20 );
    });
    
     /**************** TEAR DOWN ****************/
    it( 'closes the clients', function() {
        clientA.close();
        clientB.close();
    });
    
    it( 'shuts clients and server down', function(done) {
      deepstreamServer.on( 'stopped', done );
      deepstreamServer.stop();
    });
});