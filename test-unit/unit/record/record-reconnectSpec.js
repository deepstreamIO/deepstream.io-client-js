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
		client._connection._endpoint.emit( 'message', msg( 'C|A+' ) );
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
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'R|CR|recordA+R|CR|recordB+R|CR|recordC+'));
	    expect( recordA.isReady ).toBe( false );
	    expect( recordB.isReady ).toBe( false );
	    expect( recordC.isReady ).toBe( false );
	});
	
	it( 'receives read messages', function() {
	    client._connection._endpoint.emit( 'message', msg( 'R|R|recordA|1|{}' ) );
	    client._connection._endpoint.emit( 'message', msg( 'R|R|recordB|1|{}' ) );
	    client._connection._endpoint.emit( 'message', msg( 'R|R|recordC|1|{}' ) );
	    expect( recordA.isReady ).toBe( true );
	    expect( recordB.isReady ).toBe( true );
	    expect( recordC.isReady ).toBe( true );
	});
	
	it( 'sends message on open connection', function() {
	    recordB.set( 'firstname', 'Wolfram' );
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'R|P|recordB|2|firstname|SWolfram+' ) );
	});
	
	it( 'loses the connection', function() {
	    client._connection._endpoint.close();
	    expect( client.getConnectionState() ).toBe( 'RECONNECTING' );
	    recordA.set( 'firstname', 'Egon' );
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'R|P|recordB|2|firstname|SWolfram+' ) );
	});
	
	it( 're-establishes the connection', function() {
	    client._connection._endpoint.simulateOpen();
	    client._connection._endpoint.emit( 'message', msg( 'C|A+' ) );
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"username":"Wolfram"}+' ) );
	    expect( client.getConnectionState() ).toBe( 'AUTHENTICATING' );
	});
	
	it( 'resubscribes on open', function() {
		client._connection._endpoint.emit( 'message', msg( 'A|A+' ) );
	    expect( client.getConnectionState() ).toBe( 'OPEN' );

	    /**
	    * The first message is concatendated since the path message was queued when connection was lost
	    * and the request of recordA flushed the queue
	    */
		var sentMessages = client._connection._endpoint.messages;
	    expect( sentMessages.slice( sentMessages.length - 3 ) ).toEqual( [
	    	msg( 'R|P|recordA|2|firstname|SEgon+R|CR|recordA+' ),
	    	msg( 'R|CR|recordB+' ),
	    	msg( 'R|CR|recordC+' ),
	    ] );
	});
	
	it( 'applies an update on resubscription read event and does not call onReady', function() {
		var onReadySpy = jasmine.createSpy( 'onReady' );
		var onErrorSpy = jasmine.createSpy( 'onError' );		
		recordA.setMergeStrategy( function( record, remoteVersion, remoteData, callback ) {
			callback( 'Error merging' );
		} );
		recordA.on( 'ready', onReadySpy );
		client.on( 'error', onErrorSpy);

		client._connection._endpoint.emit( 'message', msg( 'R|R|recordA|5|{}' ) );

		expect( onReadySpy ).not.toHaveBeenCalled();
		
		expect( onErrorSpy ).toHaveBeenCalled();
		expect( onErrorSpy ).toHaveBeenCalledWith( 'recordA', 'VERSION_EXISTS', 'R' );
	});

	it( 'deletes a record', function() {
		var deletionCallback = jasmine.createSpy( 'deletionCallback' );
		recordC.on( 'delete', deletionCallback );
		
	    recordC.delete();
	    
	    expect( deletionCallback ).not.toHaveBeenCalled();
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'R|D|recordC+' ) );
	    
	    client._connection._endpoint.emit( 'message', msg( 'R|A|D|recordC' ) );
	    expect( deletionCallback ).toHaveBeenCalled();
	});
	
	it( 'loses the connection', function() {
	    client._connection._endpoint.close();
	    expect( client.getConnectionState() ).toBe( 'RECONNECTING' );
	});
	
	it( 're-establishes the connection', function() {
	    client._connection._endpoint.simulateOpen();
	    client._connection._endpoint.emit( 'message', msg( 'C|A+' ) );
	    expect( client._connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"username":"Wolfram"}+' ) );
	    expect( client.getConnectionState() ).toBe( 'AUTHENTICATING' );
	});
	
	it( 'resubscribes on open', function() {
		client._connection._endpoint.emit( 'message', msg( 'A|A+' ) );
	    expect( client.getConnectionState() ).toBe( 'OPEN' );

	    var sentMessages = client._connection._endpoint.messages;
	    expect( sentMessages.slice( sentMessages.length - 2 ) ).toEqual( [
	    	msg( 'R|CR|recordA+' ),
	    	msg( 'R|CR|recordB+' ),
	    ] );
	});
});
