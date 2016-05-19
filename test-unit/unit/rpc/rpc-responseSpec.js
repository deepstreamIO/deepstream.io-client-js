/* global describe, expect, it, jasmine */
var RpcResponse = require( '../../../src/rpc/rpc-response' ),
	connectionMock = new (require( '../../mocks/message/connection-mock' ))(),
	msg = require( '../../test-helper/test-helper' ).msg;

describe( 'sends the correct response messages - happy path', function(){
	var response;

	it( 'creates the response object', function(){
		response = new RpcResponse( connectionMock, 'addTwo', '123' );
		expect( response.send ).toBeDefined();
	});

	it( 'sends an ack message automatically', function( done ){
		setTimeout(function(){
			expect( connectionMock.lastSendMessage ).toBe( msg( 'P|A|addTwo|123+' ) );
			done();
		}, 10 );
	});

	it( 'sends the response', function(){
		response.send( 14 );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|RES|addTwo|123|N14+' ) );
	});
});

describe( 'sends the correct response messages - ack behaviour', function(){
	var response;

	it( 'creates the response object', function(){
		response = new RpcResponse( connectionMock, 'addTwo', '123' );
		response.autoAck = false;
		expect( response.send ).toBeDefined();
	});

	it( 'doesn\'t send ack if autoAck == false', function( done ) {
		connectionMock.lastSendMessage = null;

		setTimeout(function(){
			expect( connectionMock.lastSendMessage ).toBe( null );
			done();
		}, 10 );
	});

	it( 'sends ack message', function() {
		response.ack();
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|A|addTwo|123+' ) );
	});

	it( 'doesn\'t send multiple ack messages', function() {
		connectionMock.lastSendMessage = null;
		response.ack();
		expect( connectionMock.lastSendMessage ).toBe( null );
	});

});

describe( 'sends the correct response messages - reject behaviour', function(){
	var response;

	it( 'creates the response object', function(){
		response = new RpcResponse( connectionMock, 'addTwo', '123' );
		expect( response.send ).toBeDefined();
	});

	it( 'rejects messages', function() {
		response.reject();
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|REJ|addTwo|123+' ) );
	});

	it( 'throws an error when trying to send a completed response', function() {
		expect(function(){ response.send( 'bla' ); }).toThrow();
	});
});

describe( 'sends the correct response messages - error behaviour', function(){
	var response;

	it( 'creates the response object', function(){
		response = new RpcResponse( connectionMock, 'addTwo', '123' );
		expect( response.send ).toBeDefined();
	});

	it( 'errors messages', function() {
		response.error( 'Error Message');
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|E|Error Message|addTwo|123+' ) );
	});

	it( 'throws an error when trying to send a completed response', function() {
		expect(function(){ response.send( 'bla' ); }).toThrow();
	});
});