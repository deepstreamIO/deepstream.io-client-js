/* global describe, expect, it, jasmine */
var RpcHandler = require( '../../../src/rpc/rpc-handler' ),
	connectionMock = new (require( '../../mocks/message/connection-mock' ))(),
	clientMock = new (require( '../../mocks/client-mock' ))(),
	msg = require( '../../test-helper/test-helper' ).msg,
	options = {
		rpcAckTimeout: 10,
		rpcResponseTimeout: 10,
		subscriptionTimeout: 10
	};

describe( 'handles rpc providers', function() {
	var addTwoCallback = function( data, response ) {
			rpcCalls++;
			if( data.sync ) {
				response.send( data.numA + data.numB );
			} else {
				setTimeout(function(){
					response.send( data.numA + data.numB );
				}, 20 );
			}
		},
		rpcCalls = 0,
		rpcHandler;

	it( 'creates the RPC handler', function(){
		rpcHandler = new RpcHandler( options, connectionMock, clientMock );
		expect( rpcHandler.provide ).toBeDefined();
	});

	it( 'registers as a provider for an addTwo rpc', function(){
		expect( connectionMock.lastSendMessage ).toBe( null );
		rpcHandler.provide( 'addTwo', addTwoCallback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|S|addTwo+' ) );
		expect( rpcCalls ).toBe( 0 );
	});

	it( 'emits an error if no ack message is received for the provide', function( done ){
		expect( clientMock.lastError ).toBe( null );
		setTimeout(function(){
			var errorParams = [ 'P', 'ACK_TIMEOUT', 'No ACK message received in time for addTwo' ];
			expect( clientMock.lastError ).toEqual( errorParams );
			clientMock.lastError = null;
			done();
		}, 100 );
	});
	
	it( 'replies to sync rpc request', function(){
		rpcHandler._$handle({
			topic: 'RPC',
			action: 'REQ',
			data: [ 'addTwo', '678', 'O{"numA":2,"numB":3, "sync": true}' ]
		});
		
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|RES|addTwo|678|N5+' ) );
	});
	
	it( 'replies to async rpc request', function( done ){
		rpcHandler._$handle({
			topic: 'RPC',
			action: 'REQ',
			data: [ 'addTwo', '123', 'O{"numA":7,"numB":3}' ]
		});
		
		setTimeout(function(){
				expect( connectionMock.lastSendMessage ).toBe( msg( 'P|A|addTwo|123+' ) );
		}, 3 );
	
		setTimeout(function(){
			expect( connectionMock.lastSendMessage ).toBe( msg( 'P|RES|addTwo|123|N10+' ) );
			done();
		}, 30 );
	});
	
	it( 'sends rejection if no provider exists', function() {
	    rpcHandler._$handle({
			topic: 'RPC',
			action: 'REQ',
			data: [ 'doesNotExist', '432', 'O{"numA":7,"numB":3}' ]
		});
		
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|REJ|doesNotExist|432+' ) );
	});
	
	it( 'deregisters providers', function() {
	    rpcHandler.unprovide( 'addTwo' );
	    expect( connectionMock.lastSendMessage ).toBe( msg( 'P|US|addTwo+' ) );
	});

	it( 'emits an error if no ack message is received for the provide', function( done ){
		expect( clientMock.lastError ).toBe( null );
		setTimeout(function(){
			var errorParams = [ 'P', 'ACK_TIMEOUT', 'No ACK message received in time for addTwo' ];
			expect( clientMock.lastError ).toEqual( errorParams );
			clientMock.lastError = null;
			done();
		}, 200 );
	});

	it( 'doesn\'t call deregistered provider', function() {
	    rpcHandler._$handle({
			topic: 'RPC',
			action: 'REQ',
			data: [ 'addTwo', '434', 'O{"numA":2,"numB":7, "sync": true}' ]
		});
		
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|REJ|addTwo|434+' ) );
	});
});

describe( 'makes rpcs', function() {
    var rpcHandler,
    	callback = jasmine.createSpy( 'rpc callback' );
    
    it( 'creates the RPC handler', function(){
		rpcHandler = new RpcHandler( options, connectionMock, clientMock );
		expect( rpcHandler.provide ).toBeDefined();
	});
	
	it( 'makes a successful rpc for addTwo', function() {
		rpcHandler.make( 'addTwo', { numA: 3, numB: 8 }, callback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|REQ|addTwo|1|O{"numA":3,"numB":8}+' ) );
		expect( callback ).not.toHaveBeenCalled();
		
		rpcHandler._$handle({
			topic: 'RPC',
			action: 'RES',
			data: [ 'addTwo', '1', 'N11' ]
		});
		
		expect( callback ).toHaveBeenCalledWith( null, 11 );
	});
	
	it( 'makes rpc for addTwo, but receives an error', function() {
		rpcHandler.make( 'addTwo', { numA: 3, numB: 8 }, callback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|REQ|addTwo|1|O{"numA":3,"numB":8}+' ) );
		
		rpcHandler._$handle({
			topic: 'RPC',
			action: 'E',
			data: [ 'NO_PROVIDER', 'addTwo', '1' ]
		});
		
		expect( callback ).toHaveBeenCalledWith( 'NO_PROVIDER' );
	});
	
	it( 'makes rpc for addTwo, but doesn\'t receive ack in time', function( done ) {
		rpcHandler.make( 'addTwo', { numA: 3, numB: 8 }, callback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'P|REQ|addTwo|1|O{"numA":3,"numB":8}+' ) );
		
		setTimeout(function() {
			expect( callback ).toHaveBeenCalledWith( 'ACK_TIMEOUT' );
			done();
		}, 30 );
	});
});