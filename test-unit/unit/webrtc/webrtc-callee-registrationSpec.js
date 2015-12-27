var WebRtcHandler = require( '../../../src/webrtc/webrtc-handler.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	ClientMock = require( '../../mocks/client-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	options = { calleeAckTimeout: 5, rtcPeerConnectionConfig: {} };


describe( 'webrtc callee registration', function(){
	var webrtcHandler,
		incomingCallCbA = jasmine.createSpy( 'incoming call callbackA' ),
		mockConnection = new MockConnection(),
		mockClient = new ClientMock();

	it( 'initialises the handler', function(){
		webrtcHandler = new WebRtcHandler( options, mockConnection, mockClient );
		expect( typeof webrtcHandler.registerCallee ).toBe( 'function' );
	});

	it( 'throws an error if WebRTC objects are not present', function(){
		expect(function(){
			webrtcHandler.registerCallee( 'calleeB', incomingCallCbA );
		}).toThrow();
	});
	
	it( 'defines RTC globals', function(){
		RTCPeerConnection = function(){};
		RTCSessionDescription = function(){};
		RTCIceCandidate = function(){};
	});	
	
	it( 'throws errors for incorrect callee registration parameters', function(){
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
			'raw': msg( 'W|A|S|calleeA+' ),
			'topic': 'W',
			'action': 'A',
			'data': [ 'S', 'calleeA' ]
		});

		setTimeout(function(){
			expect( mockClient.lastError ).toBe( null );
			done();
		});
	});

	it( 'throws errors for incorrect callee unregister parameters', function(){
		expect(function(){
			webrtcHandler.unregisterCallee( 'is not registered' );
		}).toThrow();
		
		expect(function(){
			webrtcHandler.registerCallee( 'calleeA', function(){} );
		}).toThrow();
	});

	it( 'unregisteres a callee, but gets no response', function(){
		mockClient.lastError = null;
		webrtcHandler.unregisterCallee( 'calleeA' );
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|URC|calleeA+' ) );
		expect( mockClient.lastError ).toBe( null );
	});

	it( 'emits an error if no ack message is received for the callee unregistration', function( done ){
		setTimeout(function(){
			expect( mockClient.lastError ).toEqual([ 'W', 'ACK_TIMEOUT', 'No ACK message received in time for calleeA' ]);
			done();
		}, 20 );
	});

	it( 'can reregister callee', function( done ){
		mockClient.lastError = null;

		expect(function(){
			webrtcHandler.registerCallee( 'calleeA', function(){} );
		}).not.toThrow();

		webrtcHandler._$handle({
				'raw': msg( 'W|A|S|calleeA+' ),
				'topic': 'W',
				'action': 'A',
				'data': [ 'S', 'calleeA' ]
		});

		setTimeout(function(){
			expect( mockClient.lastError ).toBe( null );
			done();
		});
	});
});