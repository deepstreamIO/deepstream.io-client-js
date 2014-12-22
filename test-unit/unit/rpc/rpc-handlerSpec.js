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
	var addTwoCallback = jasmine.createSpy( 'addTwoCallback' ),
		rpcHandler;

	it( 'creates the RPC handler', function(){
		rpcHandler = new RpcHandler( options, connectionMock, clientMock );
		expect( rpcHandler.provide ).toBeDefined();
	});

	it( 'registers as a provider for an addTwo rpc', function(){
		expect( connectionMock.lastSendMessage ).toBe( null );
		rpcHandler.provide( 'addTwo', addTwoCallback );
		expect( connectionMock.lastSendMessage ).toBe( msg( 'RPC|S|addTwo+' ) );
		expect( addTwoCallback ).not.toHaveBeenCalled();
	});

	it( 'receives ack message ', function(){
		rpcHandler._$handle({
			topic: 'RPC',
			action: 'A',
			data: [ 'S', 'addTwo' ]
		});
		
	});
});