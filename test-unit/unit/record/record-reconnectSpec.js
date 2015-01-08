/* global it, describe, expect, jasmine */
var proxyquire = require( 'proxyquire' ),
	EndpointMock = require( '../../mocks/tcp/tcp-connection-mock' ),
	Connection = proxyquire( '../../../src/message/connection', {  '../tcp/tcp-connection': EndpointMock } ),
	deepstream = proxyquire( '../../../src/client', { './message/connection': Connection } ),
	msg = require( '../../test-helper/test-helper' ).msg;
	
describe( 'connection losses are handled gracefully', function(){
	var client,
		recordA,
		recordB,
		recordC;
	
	it( 'creates the client', function() {
		client = deepstream( 'someUrl' );
		recordA = client.record.getRecord( 'recordA' );
		expect( client._connection._endpoint.lastSendMessage ).toBe( null );
		expect( client.getConnectionState() ).toBe( 'CLOSED' );
	});
	
	it( 'connects', function() {
		client._connection._endpoint.simulateOpen();
		recordB = client.record.getRecord( 'recordB' );
		expect( client.getConnectionState() ).toBe( 'AWAITING_AUTHENTICATION' );
	});
	
	it( 'logs in', function() {
	    client.login({ username: 'Wolfram' });
	    recordC = client.record.getRecord( 'recordC' );
		expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"username":"Wolfram"}+' ) );
		expect( client.getConnectionState() ).toBe( 'AUTHENTICATING' );
	});
	
	it( 'opens the connection', function() {
	    client._connection._endpoint.emit( 'message', msg( 'A|A+' ) );
	    expect( client.getConnectionState() ).toBe( 'OPEN' );
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'RECORD|CR|recordA+RECORD|CR|recordB+RECORD|CR|recordC+'));
	    expect( recordA.isReady ).toBe( false );
	    expect( recordB.isReady ).toBe( false );
	    expect( recordC.isReady ).toBe( false );
	});
	
	it( 'receives read messages', function() {
	    client._connection._endpoint.emit( 'message', msg( 'RECORD|R|recordA|1|{}' ) );
	    client._connection._endpoint.emit( 'message', msg( 'RECORD|R|recordB|1|{}' ) );
	    client._connection._endpoint.emit( 'message', msg( 'RECORD|R|recordC|1|{}' ) );
	    expect( recordA.isReady ).toBe( true );
	    expect( recordB.isReady ).toBe( true );
	    expect( recordC.isReady ).toBe( true );
	});
	
	it( 'sends message on open connection', function() {
	    recordB.set( 'firstname', 'Wolfram' );
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'RECORD|P|recordB|2|firstname|SWolfram+' ) );
	});
	
	it( 'looses the connection', function() {
	    client._connection._endpoint.close();
	    expect( client.getConnectionState() ).toBe( 'RECONNECTING' );
	    recordA.set( 'firstname', 'Egon' );
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'RECORD|P|recordB|2|firstname|SWolfram+' ) );
	});
	
	it( 're-establishes the connection', function() {
	    client._connection._endpoint.simulateOpen();
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"username":"Wolfram"}+' ) );
	    expect( client.getConnectionState() ).toBe( 'AUTHENTICATING' );
	});
	
	it( 'resubscribes on open', function() {
		client._connection._endpoint.emit( 'message', msg( 'A|A+' ) );
	    expect( client.getConnectionState() ).toBe( 'OPEN' );
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'RECORD|CR|recordA+RECORD|CR|recordB+RECORD|CR|recordC+RECORD|P|recordA|2|firstname|SEgon+' ));
	});
	
	it( 'deletes a record', function() {
		var deletionCallback = jasmine.createSpy( 'deletionCallback' );
		recordC.on( 'delete', deletionCallback );
		
	    recordC.delete();
	    
	    expect( deletionCallback ).not.toHaveBeenCalled();
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'RECORD|D|recordC+' ) );
	    
	    client._connection._endpoint.emit( 'message', msg( 'RECORD|A|D|recordC' ) );
	    expect( deletionCallback ).toHaveBeenCalled();
	});
	
	it( 'looses the connection', function() {
	    client._connection._endpoint.close();
	    expect( client.getConnectionState() ).toBe( 'RECONNECTING' );
	});
	
	it( 're-establishes the connection', function() {
	    client._connection._endpoint.simulateOpen();
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"username":"Wolfram"}+' ) );
	    expect( client.getConnectionState() ).toBe( 'AUTHENTICATING' );
	});
	
	it( 'resubscribes on open', function() {
		client._connection._endpoint.emit( 'message', msg( 'A|A+' ) );
	    expect( client.getConnectionState() ).toBe( 'OPEN' );
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'RECORD|CR|recordA+RECORD|CR|recordB+' ));
	});
});
