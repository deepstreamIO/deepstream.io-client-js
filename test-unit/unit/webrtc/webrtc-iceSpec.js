var WebRtcHandler = require( '../../../src/webrtc/webrtc-handler.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	ClientMock = require( '../../mocks/client-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	webrtcMock = require( '../../mocks/webrtc/webrtc-mock' ),
	options = { calleeAckTimeout: 5, rtcPeerConnectionConfig: {} };

describe( 'webrtc interactive connection establishing works for outgoing calls', function(){
	var webrtcHandler,
		webrtcCall,
		mockConnection = new MockConnection(),
		mockClient = new ClientMock();

	it( 'creates global objects', function(){
		webrtcMock.on();
	});

	it( 'initialises the webrtc handler', function(){
		webrtcHandler = new WebRtcHandler( options, mockConnection, mockClient );
		expect( typeof webrtcHandler.registerCallee ).toBe( 'function' );
	});

	it( 'creates an outgoing call', function(){
		webrtcCall = webrtcHandler.makeCall( 'calleeA', { some: 'metaData' }, {} );
		expect( webrtcCall.state ).toBe( 'CONNECTING' );
	});

	it( 'sends an ice candidate', function( done ){
		expect( mockConnection.lastSendMessage ).toBe( null );
		webrtcCall._$webRtcConnection._peerConnection.simulateOutgoingIceCandidate( 'A' );
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|IC|1|calleeA|{"icecandidate":"A"}+' ) );
		webrtcCall._$webRtcConnection._peerConnection.simulateOutgoingIceCandidate( 'B' );
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|IC|1|calleeA|{"icecandidate":"B"}+' ) );
		setTimeout( done, 30 );
	});

	it( 'has sent the offer', function(){
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|OF|1|calleeA|{"sdp":"offer sdp","type":"offer type","meta":{"some":"metaData"}}+' ) );
	});

	it( 'receives an icecandidate and adds it immediately', function(){
		expect( webrtcCall._$webRtcConnection._peerConnection.addIceCandidate ).not.toHaveBeenCalled();
		webrtcHandler._$handle({
			raw: msg( 'W|IC|calleeA|1|{"icecandidate":"C"}+' ),
			topic: 'W',
			action: 'IC',
			data: [ 'calleeA', '1', '{"icecandidate":"C"}' ]
		});

		//TODO: Check why equals doesn't work
		var actual = webrtcCall._$webRtcConnection._peerConnection.addIceCandidate.calls.argsFor( 0 )[ 0 ];
		var expected = { candidate:{ icecandidate: 'C' } };
		expect( JSON.stringify( actual ) ).toEqual( JSON.stringify( expected ) );
	});

	it( 'removes global objects', function(){
		webrtcMock.off();
	});
});

describe( 'webrtc interactive connection establishing works for incoming calls', function(){
	var webrtcHandler,
		webrtcCall,
		incomingCall,
		mockConnection = new MockConnection(),
		mockClient = new ClientMock(),
		onCall = jasmine.createSpy( 'onCall' );

	it( 'creates global objects', function(){
		webrtcMock.on();
	});

	it( 'initialises the webrtc handler', function(){
		webrtcHandler = new WebRtcHandler( options, mockConnection, mockClient );
		expect( typeof webrtcHandler.registerCallee ).toBe( 'function' );
	});

	it( 'registers a callee', function(){
		webrtcHandler.registerCallee( 'calleeA', onCall );
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|RC|calleeA+' ) );
	});

	it( 'receives an incoming call message', function(){
		expect( onCall ).not.toHaveBeenCalled();

		webrtcHandler._$handle({
			raw: msg( 'W|OF|1|calleeA|{"sdp": "SDP", "type": "TYPE", "meta": { "some": "data" }}+' ),
			topic: 'W',
			action: 'OF',
			data: [ '1', 'calleeA', '{"sdp": "SDP", "type": "TYPE", "meta": { "some": "data" }}' ]
		});

		expect( onCall ).toHaveBeenCalled();
		expect( onCall.calls.argsFor( 0 )[ 1 ] ).toEqual({ some: 'data' });
		incomingCall = onCall.calls.argsFor( 0 )[ 0 ];

		expect( incomingCall.isAccepted ).toBe( false );
		expect( incomingCall.isIncoming ).toBe( true );
		expect( incomingCall._$webRtcConnection ).toBe( null );
		expect( incomingCall._bufferedIceCandidates.length ).toBe( 0 );
	});

	it( 'receives an icecandidate message', function(){
		webrtcHandler._$handle({
			raw: msg( 'W|IC|1|calleeA|{"icecandidate":"G"}+' ),
			topic: 'W',
			action: 'IC',
			data: [ '1', 'calleeA', '{"icecandidate":"G"}' ]
		});

		expect( incomingCall._$webRtcConnection ).toBe( null );
		expect( incomingCall._bufferedIceCandidates.length ).toBe( 1 );
	});

	it( 'receives a second icecandidate message', function(){
		webrtcHandler._$handle({
			raw: msg( 'W|IC|1|calleeA|{"icecandidate":"H"}+' ),
			topic: 'W',
			action: 'IC',
			data: [ '1', 'calleeA', '{"icecandidate":"H"}' ]
		});
		
		expect( incomingCall._$webRtcConnection ).toBe( null );
		expect( incomingCall._bufferedIceCandidates.length ).toBe( 2 );
	});

	it( 'accepts the call and flushes the ice candidate buffer', function( done ){
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|RC|calleeA+' ) );
		incomingCall.accept();
		expect( incomingCall._$webRtcConnection ).not.toBe( null );
		expect( incomingCall.isAccepted ).toBe( true );
		var addIceCandidateCalls = incomingCall._$webRtcConnection._peerConnection.addIceCandidate.calls;
		expect( addIceCandidateCalls.count() ).toBe( 2 );
		expect( addIceCandidateCalls.argsFor( 0 )[ 0 ].candidate.icecandidate ).toBe( 'G' );
		expect( addIceCandidateCalls.argsFor( 1 )[ 0 ].candidate.icecandidate ).toBe( 'H' );
		expect( incomingCall._bufferedIceCandidates.length ).toBe( 0 );
		setTimeout( done, 30 );
	});

	it( 'has sent the answer message', function(){
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|AN|calleeA|1|{"sdp":"answer sdp","type":"answer type"}+' ) );
	});
});