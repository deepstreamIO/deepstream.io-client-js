/* global describe, it, expect, jasmine */

var proxyquire = require( 'proxyquire' ).noCallThru(),
	TcpConnectionMock = require( '../../mocks/tcp/tcp-connection-mock' ),
	Connection = proxyquire( '../../../src/message/connection', { '../tcp/tcp-connection': TcpConnectionMock } ),
	clientMock = new (require( '../../mocks/client-mock' ))(),
	msg = require( '../../test-helper/test-helper' ).msg,
	clientConnectionStateChangeCount;

clientMock.on( 'connectionStateChanged', function(){
	clientConnectionStateChangeCount++;
});

describe('connects - happy path', function(){
	
	var connection,
		authCallback = jasmine.createSpy( 'authCallback' );

	clientConnectionStateChangeCount = 0;

	it( 'creates the connection', function(){
		connection = new Connection( clientMock );
		expect( connection.getState() ).toBe( 'CLOSED' );
	});

	it( 'switches to awaiting authentication when the connection opens', function(){
		expect( clientConnectionStateChangeCount ).toBe( 0 );
		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
		expect( clientConnectionStateChangeCount ).toBe( 1 );
	});

	it( 'sends auth parameters', function(){
		expect( connection._endpoint.lastSendMessage ).toBe( null );
		connection.authenticate({ user: 'Wolfram' }, authCallback );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'AUTH|REQ|{"user":"Wolfram"}' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
		expect( clientConnectionStateChangeCount ).toBe( 2 );
		expect( authCallback ).not.toHaveBeenCalled();
	});

	it( 'processes the authentication response', function(){
		connection._endpoint.emit( 'message', msg( 'AUTH|A' ) );
		expect( connection.getState() ).toBe( 'OPEN' );
		expect( authCallback ).toHaveBeenCalledWith( true );
		expect( clientConnectionStateChangeCount ).toBe( 3 );
	});

	it( 'sends individual messages', function( done ){
		connection.sendMsg( 'RECORD', 'S', [ 'test1' ] );
		setTimeout(function(){
			expect( connection._endpoint.lastSendMessage ).toBe( msg( 'RECORD|S|test1' ) );
			done();
		}, 10 );
	});

	it( 'batches multiple messages', function( done ){
		connection.sendMsg( 'RECORD', 'S', [ 'test2' ] );
		connection.sendMsg( 'RECORD', 'S', [ 'test3' ] );

		setTimeout(function(){
			var expectedResult = msg( 'RECORD|S|test2' ) + String.fromCharCode( 30 ) + msg( 'RECORD|S|test3' );
			expect( connection._endpoint.lastSendMessage ).toBe( expectedResult );
			done();
		}, 10 );
	});

	it( 'closes the connection', function(){
		expect( connection._endpoint.isOpen ).toBe( true );
		connection.close();
		expect( connection._endpoint.isOpen ).toBe( false );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( clientConnectionStateChangeCount ).toBe( 4 );
	});
});

describe( 'buffers messages whilst connection is closed', function(){
    var connection;
    
    it( 'creates the connection', function(){
		connection = new Connection( clientMock );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
	});
	
	it( 'tries to send messages whilst connection is closed', function( done ){
		expect( connection._endpoint.lastSendMessage ).toBe( null );
		connection.sendMsg( 'RECORD', 'S', ['rec1'] );
		setTimeout(function() {
			expect( connection._endpoint.lastSendMessage ).toBe( null );
			done();
		}, 10);
	});
	
	it( 'tries to send messages whilst awaiting authentication', function( done ) {
	    connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
		connection.sendMsg( 'RECORD', 'S', ['rec2'] );
		setTimeout(function() {
			expect( connection._endpoint.lastSendMessage ).toBe( null );
			done();
		}, 10);
	});
	
	it( 'tries to send messages whilst authenticating', function( done ) {
	    connection.authenticate({ user: 'Wolfram' }, function(){} );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'AUTH|REQ|{"user":"Wolfram"}' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
		connection.sendMsg( 'RECORD', 'S', ['rec3'] );
		setTimeout(function() {
			expect( connection._endpoint.lastSendMessage ).toBe( msg( 'AUTH|REQ|{"user":"Wolfram"}' ) );
			done();
		}, 10);
	});
	
	it( 'tries to send messages whilst authenticating', function( done ) {
	    connection._endpoint.emit( 'message', msg( 'AUTH|A' ) );
		expect( connection.getState() ).toBe( 'OPEN' );
		
		setTimeout(function() {
			var expected = msg( 'RECORD|S|rec1', 'RECORD|S|rec2', 'RECORD|S|rec3' );
			

			console.log(
			
			);
			expect( connection._endpoint.lastSendMessage ).toBe( expected );
			done();
		}, 10);
	});
	

});