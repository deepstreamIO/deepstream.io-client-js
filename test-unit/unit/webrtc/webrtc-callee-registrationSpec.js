var WebRtcHandler = require( '../../../src/webrtc/webrtc-handler.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	ClientMock = require( '../../mocks/client-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	options = { calleeAckTimeout: 5 };


describe( 'webrtc callee registration', function(){
	var webrtcHandler,
		incomingCallCbA = jasmine.createSpy( 'incoming call callbackA' ),
		mockConnection = new MockConnection(),
		mockClient = new ClientMock();

	it( 'initialises the handler', function(){
		webrtcHandler = new WebRtcHandler( {}, mockConnection, mockClient );
		expect( typeof webrtcHandler.registerCallee ).toBe( 'function' );
	});

	it( 'throws an error if WebRTC objects are not present', function(){
		expect(function(){
			webrtcHandler.registerCallee( 'calleeB', incomingCallCbA );
		}).toThrow();

		RTCPeerConnection = function(){};
		RTCSessionDescription = function(){};
		RTCIceCandidate = function(){};

		expect(function(){
			webrtcHandler.registerCallee( 'calleeB', incomingCallCbA );
		}).not.toThrow();
		mockConnection.lastSendMessage = null;
	});
	
	it( 'throws errors for incorrect callee registration parameter', function(){
		expect(function(){
			webrtcHandler.registerCallee( function(){} );
		}).toThrow();

		expect(function(){
			webrtcHandler.registerCallee( 'some callee', null );
		}).toThrow();
	});

	it( 'registers a callee successfully', function(){
		expect( mockConnection.lastSendMessage ).toBe( null );
		webrtcHandler.registerCallee( 'calleeA', incomingCallCbA );
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|RC|calleeA+' ) );
	});

	it( 'throws an error when the same calle is registered more than once', function(){
		expect(function(){
			webrtcHandler.registerCallee( 'calleeA', incomingCallCbA );
		}).toThrow();
	});

	it( 'emits an error if no ack message is received for the callee registration', function( done ){
		expect( mockClient.lastError ).toBe( null );
		setTimeout(function(){
			var errorParams = [ 'W', 'ACK_TIMEOUT', 'No ACK message received in time for calleeA' ];
			expect( mockClient.lastError ).toEqual( errorParams );
			done();
		}, 20 );
	});

	it( 'receives an ACK for a callee registration', function( done ){
		webrtcHandler.registerCallee( 'calleeA', incomingCallCbA );
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|RC|calleeA+' ) );
		mockClient.lastError = null;
		webrtcHandler._$handle({
			'raw': msg( 'W|A|S|Wolfram+' ),
			'topic': 'W',
			'action': 'A',
			'data': [ 'S', 'calleeA' ]
		});

		setTimeout(function(){
			expect( mockClient.lastError ).toBe( null );
			done();
		});
	});

	it( 'unregisteres a callee, but gets no response', function( done ){
		expect(function(){
			webrtcHandler.unregisterCallee( 'is not registered' );
		}).toThrow();
		
		expect(function(){
			webrtcHandler.registerCallee( 'calleeA', function(){} );
		}).toThrow();

		mockClient.lastError = null;
		webrtcHandler.unregisterCallee( 'calleeA' );
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|URC|calleeA+' ) );
		expect( mockClient.lastError ).toBe( null );

		setTimeout(function(){
			expect( mockClient.lastError ).toEqual([ 'W', 'ACK_TIMEOUT', 'No ACK message received in time for calleeA' ]);
			done();
		}, 20 );
	});

	it( 'unregisteres a callee successfully', function( done ){
		mockClient.lastError = null;
		webrtcHandler.registerCallee( 'calleeA', function(){} );
		webrtcHandler._$handle({
			'raw': msg( 'W|A|S|calleeA+' ),
			'topic': 'W',
			'action': 'A',
			'data': [ 'S', 'calleeA' ]
		});

		expect(function(){
			webrtcHandler.registerCallee( 'calleeA', function(){} );
		}).toThrow();

		webrtcHandler.unregisterCallee( 'calleeA' );
		webrtcHandler._$handle({
			'raw': msg( 'W|A|US|calleeA+' ),
			'topic': 'W',
			'action': 'A',
			'data': [ 'US', 'calleeA' ]
		});

		expect(function(){
			webrtcHandler.registerCallee( 'calleeA', function(){} );
			webrtcHandler._$handle({
				'raw': msg( 'W|A|S|calleeA+' ),
				'topic': 'W',
				'action': 'A',
				'data': [ 'S', 'calleeA' ]
			});
		}).not.toThrow();

		setTimeout(function(){
			expect( mockClient.lastError ).toBe( null );
			done();
		});
	});
});