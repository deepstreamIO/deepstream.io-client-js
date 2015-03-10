/* global describe, it, expect, jasmine */
var DeepstreamServer = require( 'deepstream.io' ),
    MessageConnector = require( 'deepstream.io-msg-direct' ),
    deepstreamClient = require( '../../src/client' ),
    TestLogger = require( '../tools/test-logger' );
    
describe( 'event', function() {
    var deepstreamServerOne,
        deepstreamServerTwo,
        logger = new TestLogger(),
        clientA,
        clientB,
        recordA,
        recordB,
        anonymousRecord,
        currentPet;
    
    /**************** SETUP ****************/
    it( 'starts both servers', function( done ){
        var checkReady = function() {
            if( deepstreamServerOne.isRunning && deepstreamServerTwo.isRunning ) {
                done();
            }
        };

        // Start Server One
        deepstreamServerOne = new DeepstreamServer();
        deepstreamServerOne.on( 'started', checkReady );
        deepstreamServerOne.set( 'tcpPort', 6001 );
        deepstreamServerOne.set( 'port', 6011 );
        deepstreamServerOne.set( 'messageConnector', new MessageConnector({
            localport: 3001, 
            localhost: 'localhost', 
            remoteUrls: [ 'localhost:3002' ],
            reconnectInterval: 100,
            maxReconnectAttepts: 10,
            securityToken: 'bla'
        }));
        deepstreamServerOne.set( 'logger', logger );
        deepstreamServerOne.set( 'showLogo', false );
        deepstreamServerOne.start();

        // Start Server Two
        deepstreamServerTwo = new DeepstreamServer();
        deepstreamServerTwo.on( 'started', checkReady );
        deepstreamServerTwo.set( 'tcpPort', 6002 );
        deepstreamServerTwo.set( 'port', 6022 );
        deepstreamServerTwo.set( 'messageConnector', new MessageConnector({
            localport: 3002, 
            localhost: 'localhost', 
            remoteUrls: [ 'localhost:3001' ],
            reconnectInterval: 100,
            maxReconnectAttepts: 10,
            securityToken: 'bla'
        }));
        deepstreamServerTwo.set( 'logger', logger );
        deepstreamServerTwo.set( 'showLogo', false );
        deepstreamServerTwo.start();
    });

    it( 'creates clientA', function( done ) {
        clientA = deepstreamClient( 'localhost:6001' );
        clientA.login( null, function(){ done(); });
    });
    
    it( 'creates clientB', function( done ) {
        clientB = deepstreamClient( 'localhost:6002' );
        clientB.login( null, function(){ done(); });
    });
    
     /**************** TEST ****************/
    it( 'subscribes and emits an event', function( done ){
        clientA.event.subscribe( 'event1', function( data ){
            expect( data ).toBe( 'someData' );
            done();
        });
        
        clientB.event.emit( 'event1', 'someData' );
    });
    
    it( 'receives its own events', function( done ){
        var clientAReceivedEvent = false,
            clientBReceivedEvent = false,
            checkDone = function() {
                if( clientAReceivedEvent && clientBReceivedEvent ) {
                    done();
                }  
            };
            
        clientA.event.subscribe( 'event2', function( data ){
            clientAReceivedEvent = true;
            expect( data ).toBe( 44 );
            checkDone();
        });
        
        clientB.event.subscribe( 'event2', function( data ){
            clientBReceivedEvent = true;
            expect( data ).toBe( 44 );
            checkDone();
        });
        
        clientB.event.emit( 'event2', 44 );
    });
    
    it( 'subscribes and unsubscribes', function(done){
        var calls = 0,
            callback = function( data ){
                expect( data ).toEqual( { an: 'object' } );
                calls++;
                expect( calls ).toBe( 1 );
                clientA.event.unsubscribe( 'event3', callback );
                setTimeout(function(){
                    expect( calls ).toBe( 1 );
                    done();
                }, 30 );
            };
        
        clientA.event.subscribe( 'event3', callback );
        clientB.event.emit( 'event3', { an: 'object' } );
    });
    
     /**************** TEAR DOWN ****************/
    it( 'closes the clients', function() {
        clientA.close();
        clientB.close();
    });
    
    it( 'stops server one', function(done) {
      deepstreamServerOne.on( 'stopped', done );
      deepstreamServerOne.stop();
    });

    it( 'stops server two', function(done) {
      deepstreamServerTwo.on( 'stopped', done );
      deepstreamServerTwo.stop();
    });
});