var AckTimeoutRegistry = require( '../../../src/utils/ack-timeout-registry' ),
	ClientMock = require( '../../mocks/client-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg;


describe( 'webrtc sends correct messages', function(){
	var registry,
		mockClient = new ClientMock();

	it( 'creates the registry', function(){
		registry = new AckTimeoutRegistry( mockClient, 'X', 5 );
		expect( typeof registry.add ).toBe( 'function' );
	});

	it( 'adds an entry', function(){
		expect( mockClient.lastError ).toBe( null );
		registry.add( 'testA' );
		expect( mockClient.lastError ).toBe( null );
		expect(function(){
			registry.add( 'testA' );
		}).toThrow();
	});

	it( 'invokes the error callback once the timeout has occured', function( done ){
		setTimeout(function(){
			expect( mockClient.lastError ).toEqual([ 'X', 'ACK_TIMEOUT', 'No ACK message received in time for testA' ]);
			done();
		}, 10 );
	});

	it( 'has removed the timed-out entry', function(){
		expect(function(){
			registry.add( 'testA' );
		}).not.toThrow();
	});

	it( 'receives an ACK message', function( done ){
		mockClient.lastError = null;

		registry.clear({
			topic: 'X',
			action: 'A',
			data: [ 'S', 'testA' ]
		});

		setTimeout(function(){
			expect( mockClient.lastError ).toBe( null );
			done();
		}, 10 );
	});

	it( 'receives an ack message for an unregistered timeout', function(){
		mockClient.lastError = null;

		registry.clear({
			raw: 'raw message placeholder',
			topic: 'X',
			action: 'A',
			data: [ 'S', 'testB' ]
		});

		expect( mockClient.lastError ).toEqual([ 'X', 'UNSOLICITED_MESSAGE', 'raw message placeholder' ]);
	});
});