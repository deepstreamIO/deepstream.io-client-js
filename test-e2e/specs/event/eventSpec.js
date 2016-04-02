/* global describe, it, expect, jasmine */
var singleServer = require( '../../tools/single'),
    deepstreamClient = require( '../../../src/client' );
    
describe( 'event', function() {
    var clientA,
        clientB,
        recordA,
        recordB,
        anonymousRecord,
        currentPet;
    
    /**************** SETUP ****************/
    it( 'starts the server', singleServer.start );
    
    it( 'creates clientA', function( done ) {
        clientA = deepstreamClient( 'localhost:6021' );
        clientA.login( null, function(){ done(); });
    });
    
    it( 'creates clientB', function( done ) {
        clientB = deepstreamClient( 'localhost:6021' );
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
    
    it( 'shuts clients and server down', singleServer.close );
});