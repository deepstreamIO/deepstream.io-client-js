/* global describe, it, expect, jasmine */

var proxyquire = require( 'proxyquire' ).noCallThru(),
	C = require( '../../../src/constants/constants' ),
	TcpConnectionMock = require( '../../mocks/tcp/tcp-connection-mock' ),
	Connection = proxyquire( '../../../src/message/connection', { '../tcp/tcp-connection': TcpConnectionMock } ),
	clientMock = new (require( '../../mocks/client-mock' ))(),
	msg = require( '../../test-helper/test-helper' ).msg,
	url = 'somehost:4444',
	options = {
		maxMessagesPerPacket: 100,
		timeBetweenSendingQueuedPackages: 10
	},
	clientConnectionStateChangeCount;

clientMock.on( 'connectionStateChanged', function(){
	clientConnectionStateChangeCount++;
});

/*****************************************
* CONNECTIVITY
*****************************************/
describe('connects - happy path', function(){

	var connection,
		authCallback = jasmine.createSpy( 'authCallback' );

	it( 'creates the connection', function(){
		clientConnectionStateChangeCount = 0;

		connection = new Connection( clientMock, url, options );
		expect( connection.getState() ).toBe( 'CLOSED' );
	});

	it( 'awaits connection ack when opened', function(){
		expect( clientConnectionStateChangeCount ).toBe( 0 );
		connection._endpoint.simulateOpen();
		expect( clientConnectionStateChangeCount ).toBe( 1 );
	});

	it( 'when it recieves connection ack switches to awaiting authentication', function(){
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
		expect( clientConnectionStateChangeCount ).toBe( 2 );
	});

	it( 'sends auth parameters', function(){
		expect( connection._endpoint.lastSendMessage ).toBe( null );
		connection.authenticate({ user: 'Wolfram' }, authCallback );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"Wolfram"}+' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
		expect( clientConnectionStateChangeCount ).toBe( 3 );
		expect( authCallback ).not.toHaveBeenCalled();
	});

	it( 'processes the authentication response', function(){
		connection._endpoint.emit( 'message', msg( 'A|A+' ) );
		expect( connection.getState() ).toBe( 'OPEN' );
		expect( authCallback ).toHaveBeenCalledWith( true, null );
		expect( clientConnectionStateChangeCount ).toBe( 4 );
	});

	it( 'sends individual messages', function( done ){
		connection.sendMsg( 'R', 'S', [ 'test1' ] );
		setTimeout(function(){
			expect( connection._endpoint.lastSendMessage ).toBe( msg( 'R|S|test1+' ) );
			done();
		}, 10 );
	});

	it( 'closes the connection', function(){
		expect( connection._endpoint.isOpen ).toBe( true );
		connection.close();
		expect( connection._endpoint.isOpen ).toBe( false );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( clientConnectionStateChangeCount ).toBe( 5 );
	});
});

/*****************************************
* REDIRECT
*****************************************/
describe('connects - redirect', function(){

	var connection,
		authCallback = jasmine.createSpy( 'authCallback' ),
		options = {reconnectIntervalIncrement: 10, maxReconnectAttempts: 5 };

	it( 'creates the connection', function(){
		clientConnectionStateChangeCount = 0;

		connection = new Connection( clientMock, url, options );
		expect( connection.getState() ).toBe( 'CLOSED' );

		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
		expect( clientConnectionStateChangeCount ).toBe( 1 );
	});

	it( 'recieves a connection challenge and responds with url', function() {
		connection._endpoint.emit( 'message', msg( 'C|CH+' ) );
		expect( connection.getState() ).toBe( 'CHALLENGING' );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'C|CHR|somehost:4444+' ) );
		expect( clientConnectionStateChangeCount ).toBe( 2 );
	});

	it( 'gets a redirect when it responds with a valid url', function(){
		connection._endpoint.emit( 'message', msg( 'C|RED|someotherhost:5050+' ) );
		connection._endpoint.simulateOpen();

		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
		expect( clientConnectionStateChangeCount ).toBe( 3 );
	});

	it( 'creates connection to new url', function(){
		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
		expect( clientConnectionStateChangeCount ).toBe( 4 );
	});

	it( 'recieves a connection ack from new url', function(){
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
		expect( clientConnectionStateChangeCount ).toBe( 5 );
		expect( connection._endpoint.url ).toBe( 'someotherhost:5050' );
	});

	it( 'connects to the original url after it loses the connection', function(){
		connection._endpoint.close();

		expect( connection.getState() ).toBe( 'RECONNECTING' );
		connection._endpoint.simulateOpen();
		expect( connection._endpoint.url ).toBe( 'somehost:4444' );
	});
});

describe('connects - redirect rejection', function(){

	var connection,
		authCallback = jasmine.createSpy( 'authCallback' ),
		options = {reconnectIntervalIncrement: 10, maxReconnectAttempts: 5 };

	it( 'creates the connection', function(){
		clientConnectionStateChangeCount = 0;

		connection = new Connection( clientMock, url, options );
		expect( connection.getState() ).toBe( 'CLOSED' );

		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
		expect( clientConnectionStateChangeCount ).toBe( 1 );
	});

	it( 'recieves a connection challenge and responds with invalid url', function() {
		connection._endpoint.emit( 'message', msg( 'C|CH+' ) );
		expect( connection.getState() ).toBe( 'CHALLENGING' );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'C|CHR|somehost:4444+' ) );
		expect( clientConnectionStateChangeCount ).toBe( 2 );
	});

	it( 'gets a reject and closes connection', function() {
		connection._endpoint.emit( 'message', msg( 'C|CH+' ) );
		expect( connection.getState() ).toBe( 'CHALLENGING' );
		expect( clientConnectionStateChangeCount ).toBe( 3 );

		connection._endpoint.emit( 'message', msg( 'C|REJ+' ) );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( clientConnectionStateChangeCount ).toBe( 4 );
	});

	it( 'can longer attempt to authenticate user', function(){
		connection.authenticate( {} );
		expect( clientMock.lastError ).toEqual( [ 'X', 'IS_CLOSED', 'this client\'s connection was closed' ] );
	});
});

/*****************************************
* BUFFERING
*****************************************/
describe( 'buffers messages whilst connection is closed', function(){
		var connection;

		it( 'creates the connection', function(){
		connection = new Connection( clientMock, url, options );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
	});

	it( 'tries to send messages whilst connection is closed', function( done ){
		expect( connection._endpoint.lastSendMessage ).toBe( null );
		connection.sendMsg( 'R', 'S', ['rec1'] );
		setTimeout(function() {
			expect( connection._endpoint.lastSendMessage ).toBe( null );
			done();
		}, 10);
	});

	it( 'tries to send messages whilst awaiting connection ack', function( done ) {
		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
		connection.sendMsg( 'R', 'S', ['rec2'] );
		setTimeout(function() {
			expect( connection._endpoint.lastSendMessage ).toBe( null );
			done();
		}, 10);
	});

	it( 'tries to send messages whilst awaiting authentication', function( done ) {
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
		connection.sendMsg( 'R', 'S', ['rec3'] );
		setTimeout(function() {
			expect( connection._endpoint.lastSendMessage ).toBe( null );
			done();
		}, 10);
	});

	it( 'tries to send messages whilst authenticating', function( done ) {
		connection.authenticate({ user: 'Wolfram' }, function(){} );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"Wolfram"}+' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
		connection.sendMsg( 'R', 'S', ['rec4'] );
		setTimeout(function() {
			expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"Wolfram"}+' ) );
			done();
		}, 10);
	});

	it( 'tries to send messages whilst authenticating', function( done ) {
		connection._endpoint.emit( 'message', msg( 'A|A' ) );
		expect( connection.getState() ).toBe( 'OPEN' );

		setTimeout(function() {
			var expected = msg( 'R|S|rec1', 'R|S|rec2', 'R|S|rec3', 'R|S|rec4+' );
			expect( connection._endpoint.lastSendMessage ).toBe( expected );
			done();
		}, 10);
	});
});

/*****************************************
* AUTHENTICATION
*****************************************/
describe( 'connection handles auth rejections', function(){
	var connection,
		authCallback = jasmine.createSpy( 'invalid auth callback' );

		it( 'creates the connection', function(){
		connection = new Connection( clientMock, url, options );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
	});

	it( 'opens the connection', function(){
		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
	});

	it( 'sends auth parameters on connection ack', function(){
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
		connection.authenticate({ user: 'Wolfram' }, authCallback );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"Wolfram"}+' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
		expect( authCallback ).not.toHaveBeenCalled();
	});

	it( 'receives auth rejection message', function(){
		connection._endpoint.emit( 'message', msg( 'A|E|INVALID_AUTH_DATA|Sunknown user+' ) );
		expect( authCallback ).toHaveBeenCalledWith( false, 'unknown user' );
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
	});

	it( 'sends different auth parameters', function(){
		connection.authenticate({ user: 'Egon' }, authCallback );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"Egon"}+' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
	});

	it( 'receives auth ack message', function(){
		connection._endpoint.emit( 'message', msg( 'A|A+' ) );
		expect( authCallback ).toHaveBeenCalledWith( true, null );
		expect( connection.getState() ).toBe( 'OPEN' );
	});

	it( 'closes the connection, and then tries to authenticate again sends new credentials', function( done){
		clientMock.once( 'connectionStateChanged', function( connectionState ) {
			if( connectionState !== 'CLOSED' ) return;
			connection.authenticate({ user: 'John' }, authCallback );

			connection._endpoint.simulateOpen();
			connection._endpoint.emit( 'message', msg( 'C|A+' ) );

			expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"John"}+' ) );
			expect( connection.getState() ).toBe( 'AUTHENTICATING' );
			done();
		} );
		connection.close();
	});

});

/*****************************************
* Login With Return Data
*****************************************/
describe( 'connection handles data associated with login', function(){
	var connection,
		authCallback = jasmine.createSpy( 'login with return data' );

		it( 'creates the connection', function(){
		connection = new Connection( clientMock, url, options );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
	});

	it( 'opens the connection', function(){
		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
	});

	it( 'sends auth parameters', function(){
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
		connection.authenticate({ user: 'Wolfram' }, authCallback );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"Wolfram"}+' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
		expect( authCallback ).not.toHaveBeenCalled();
	});

	it( 'receives auth ack message', function(){
		connection._endpoint.emit( 'message', msg( 'A|A|O{"id":12345}+' ) );
		expect( authCallback ).toHaveBeenCalledWith( true, { id: 12345 } );
		expect( connection.getState() ).toBe( 'OPEN' );
	});
});

/*****************************************
* RECONNECTING
*****************************************/
describe( 'reach the max reconnect attempts and consider the maxReconnectInterval', function(){
	var connection,
		authCallback = jasmine.createSpy( 'invalid auth callback' ),
		options = {reconnectIntervalIncrement: 40, maxReconnectAttempts: 3, maxReconnectInterval: 40 };

		it( 'creates the connection', function(){
		connection = new Connection( clientMock, url, options );
		expect( connection._endpoint.url ).toBe( 'somehost:4444' );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
	});

	it( 'opens the connection', function(){
		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
	});

	it( 'recieves connection ack', function(){
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
	});

	it( 'loses the connection', function( done ){
		expect( connection._endpoint.callsToOpen ).toBe( 0 );
		connection._endpoint.close();
		expect( connection.getState() ).toBe( 'RECONNECTING' );
		expect( connection._endpoint.callsToOpen ).toBe( 0 );

		clientMock.on( C.MAX_RECONNECTION_ATTEMPTS_REACHED, done )

		function checkForXinTime(amount, timeout) {
			const B = 3 // inaccuracy buffer
			setTimeout(function(){
				connection._endpoint.close();
				expect( connection._endpoint.callsToOpen ).toBe( amount );
			}, timeout + B * amount);

		}

		checkForXinTime(1, 40)
		checkForXinTime(1, 70)
		checkForXinTime(2, 40 + 40)
		checkForXinTime(3, 40 + 40 + 40)

	});
});

describe( 'tries to reconnect if the connection drops unexpectedly', function(){
	var connection,
		authCallback = jasmine.createSpy( 'invalid auth callback' ),
		options = {reconnectIntervalIncrement: 10, maxReconnectAttempts: 5 };

		it( 'creates the connection', function(){
		connection = new Connection( clientMock, url, options );
		expect( connection._endpoint.url ).toBe( 'somehost:4444' );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
	});

	it( 'opens the connection', function(){
		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
	});

	it( 'recieves connection ack', function(){
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
	});

	it( 'loses the connection', function( done ){
		expect( connection._endpoint.callsToOpen ).toBe( 0 );
		connection._endpoint.close();
		expect( connection.getState() ).toBe( 'RECONNECTING' );
		expect( connection._endpoint.callsToOpen ).toBe( 0 );

		setTimeout(function(){
			expect( connection._endpoint.callsToOpen ).toBe( 1 );
		}, 1 );

		setTimeout(function(){
			connection._endpoint.close();
			expect( connection._endpoint.callsToOpen ).toBe( 1 );
		}, 50 );

		setTimeout(function(){
			expect( connection._endpoint.callsToOpen ).toBe( 2 );
			done();
		}, 100 );
	});

	it( 're-establishes the connection', function( done ){
		expect( connection.getState() ).toBe( 'RECONNECTING' );
		expect( connection._endpoint.callsToOpen ).toBe( 2 );
		expect( connection._endpoint.url ).toBe( 'somehost:4444' );
		connection._endpoint.simulateOpen();
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
			setTimeout(function(){
			expect( connection._endpoint.callsToOpen ).toBe( 2 );
			done();
		}, 40 );
	});

	it( 'sends auth parameters', function(){
		expect( connection._endpoint.lastSendMessage ).toBe( null );
		connection.authenticate({ user: 'Wolfram' }, authCallback );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"Wolfram"}+' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
	});

	it( 'receives auth ack message', function(){
		connection._endpoint.emit( 'message', msg( 'A|A+' ) );
		expect( connection.getState() ).toBe( 'OPEN' );
	});

	it( 'loses an authenticated connection', function( done ){
		connection._endpoint.lastSendMessage = null;
		connection._endpoint.close();
		expect( connection.getState() ).toBe( 'RECONNECTING' );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
		setTimeout( done, 10 );
	});

	it( 'reconnects', function( done ){
		expect( connection.getState() ).toBe( 'RECONNECTING' );
		connection._endpoint.simulateOpen();
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		setTimeout( done, 10 );
	});

	it( 'sends auth message again', function(){
		expect( connection._endpoint.lastSendMessage ).toBe(  msg( 'A|REQ|{"user":"Wolfram"}+' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
	});

	it( 'receives auth ack message', function(){
		connection._endpoint.emit( 'message', msg( 'A|A+' ) );
		expect( connection.getState() ).toBe( 'OPEN' );
	});
});

/*****************************************
* SPLITTING PACKETS
*****************************************/
describe( 'splits messages into smaller packets', function(){
	var connection,
		options = {
			maxMessagesPerPacket: 5,
			timeBetweenSendingQueuedPackages: 10
		},
		sendMessages = function( connection, from, to ) {
			for( from; from < to; from++ ) {
			connection.sendMsg( 'E', 'EVT', [ 'w', from ] );
			}
		};

		it( 'creates the connection', function(){
		connection = new Connection( clientMock, url, options );
		expect( connection.getState() ).toBe( 'CLOSED' );
		expect( connection._endpoint.lastSendMessage ).toBe( null );
	});

	it( 'opens the connection', function(){
		connection._endpoint.simulateOpen();
		expect( connection.getState() ).toBe( 'AWAITING_CONNECTION' );
	});

	it( 'recieves connection ack', function(){
		connection._endpoint.emit( 'message', msg( 'C|A+' ) );
		expect( connection.getState() ).toBe( 'AWAITING_AUTHENTICATION' );
	});

	it( 'sends auth parameters', function(){
		expect( connection._endpoint.lastSendMessage ).toBe( null );
		connection.authenticate({ user: 'Wolfram' }, function(){} );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"Wolfram"}+' ) );
		expect( connection.getState() ).toBe( 'AUTHENTICATING' );
	});

	it( 'receives auth ack message', function(){
		connection._endpoint.emit( 'message', msg( 'A|A+' ) );
		expect( connection.getState() ).toBe( 'OPEN' );
	});

	it( 'sends individual messages straight away', function(){
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'A|REQ|{"user":"Wolfram"}+' ) );
		sendMessages( connection, 0, 1 );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'E|EVT|w|0+' ) );
	});

	it( 'sends messages less than maxMessagesPerPacket straight away', function(){
		sendMessages( connection, 1, 3 );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'E|EVT|w|2+' ) );
	});

	it( 'buffers messages greater than maxMessagesPerPacket', function(){
		sendMessages( connection, 4, 8 );
		expect( connection._endpoint.lastSendMessage ).toBe( msg( 'E|EVT|w|4+' ) );
	});

	it( 'sends messages that are buffered when currentPacketMessageCount exceeds maxMessagesPerPacket', function(done){
		var expectedMessage = msg( 'E|EVT|w|5+E|EVT|w|6+E|EVT|w|7+' );

		setTimeout(function() {
			expect( connection._endpoint.lastSendMessage ).toBe( expectedMessage );
			done();
		}, 100 );
	});

	it( 'sends buffered messages that are buffered when messageQueue exceeds maxMessagesPerPacket', function(done){

		sendMessages( connection, 9, 17 );

		var expectedMessages = [
			msg( 'E|EVT|w|12+' ),
			msg( 'E|EVT|w|13+E|EVT|w|14+E|EVT|w|15+E|EVT|w|16+' )
		],
		currentlyExpectedMessage = 0;

		setInterval( function(){
			if( connection._endpoint.lastSendMessage === expectedMessages[ currentlyExpectedMessage ] ) {
				currentlyExpectedMessage++;
			}
			if( currentlyExpectedMessage === expectedMessages.length ) {
				done();
			}
		}, 1);
	});
});
