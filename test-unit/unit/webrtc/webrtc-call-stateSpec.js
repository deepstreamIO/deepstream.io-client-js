var WebRtcCall = require( '../../../src/webrtc/webrtc-call.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	ClientMock = require( '../../mocks/client-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	options = { calleeAckTimeout: 5 };

global.RTCPeerConnection = require( '../../mocks/webrtc/peer-connection-mock' );
global.RTCSessionDescription = function(){};

describe( 'incoming call gets declined', function(){
	var webrtcCall,
		localStream = {},
		mockConnection = new MockConnection();

	it( 'incoming calls start in initial', function(){
		webrtcCall = new WebRtcCall({
			isOutgoing: false,
			connection: mockConnection, 
			localId: 'localId', 
			remoteId: 'remoteId', 
			localStream: localStream,
			offer: null,
			metaData: { some: 'meta-data' }
		});

		expect( webrtcCall.state ).toBe( 'INITIAL' );
	});

	it( 'declining an incoming call changes its state to declined', function(){
		expect( webrtcCall.isDeclined ).toBe( false );
		expect( webrtcCall.isAccepted ).toBe( false );
		webrtcCall.decline( 'some reason' );
		expect( webrtcCall.isDeclined ).toBe( true );
		expect( webrtcCall.isAccepted ).toBe( false );
		expect( mockConnection.lastSendMessage ).toBe( msg( 'W|CD|localId|remoteId|some reason+' ) );
		expect( webrtcCall.state ).toBe( 'DECLINED' );
	});
});

describe( 'incoming call gets accepted without a stream', function(){
	var webrtcCall,
		localStream = {},
		mockConnection = new MockConnection();

	it( 'incoming calls start in initial', function(){
		webrtcCall = new WebRtcCall({
			isOutgoing: false,
			connection: mockConnection, 
			localId: 'localId', 
			remoteId: 'remoteId', 
			localStream: localStream,
			offer: null,
			metaData: { some: 'meta-data' }
		});

		expect( webrtcCall.state ).toBe( 'INITIAL' );
	});

	it( 'accepting an incoming call creates a peer connection and changes its state to accepted', function(){
		expect( webrtcCall._$webRtcConnection ).toBe( null );
		expect( webrtcCall.isDeclined ).toBe( false );
		expect( webrtcCall.isAccepted ).toBe( false );
		webrtcCall.accept();
		expect( webrtcCall.isDeclined ).toBe( false );
		expect( webrtcCall.isAccepted ).toBe( true );
		expect( webrtcCall._$webRtcConnection._peerConnection.addStream.calls.length ).toBe( 0 );
		expect( webrtcCall.state ).toBe( 'ACCEPTED' );
	});

	it( 'receiving a remote stream changes the state to established', function(){
		webrtcCall._$webRtcConnection._peerConnection.onaddstream({});
		expect( webrtcCall.state ).toBe( 'ESTABLISHED' );
	});

	it( 'receiving a end message closes the peer connection and sets the state to ended', function(){
		expect( webrtcCall._$webRtcConnection._peerConnection.close ).not.toHaveBeenCalled();
		webrtcCall._$close();
		expect( webrtcCall.state ).toBe( 'ENDED' );
		expect( webrtcCall._$webRtcConnection._peerConnection.close ).toHaveBeenCalled();
	});
});

describe( 'outgoing call gets declined', function(){
	var webrtcCall,
		localStream = {},
		mockConnection = new MockConnection();

	it( 'outgoing call starts in connecting', function(){
		webrtcCall = new WebRtcCall({
			isOutgoing: true,
			connection: mockConnection, 
			localId: 'localId', 
			remoteId: 'remoteId', 
			localStream: localStream,
			offer: null,
			metaData: { some: 'meta-data' }
		});

		expect( webrtcCall.state ).toBe( 'CONNECTING' );
	});

	it( 'receives a decline message', function(){
		expect( webrtcCall.isDeclined ).toBe( false );
		expect( webrtcCall.isAccepted ).toBe( false );
		webrtcCall._$declineReceived( 'a reason' );
		expect( webrtcCall.state ).toBe( 'DECLINED' );
		expect( webrtcCall.isDeclined ).toBe( true );
		expect( webrtcCall.isAccepted ).toBe( false );
	});
});

describe( 'outgoing call gets accepted', function(){
	var webrtcCall,
		localStream = {},
		mockConnection = new MockConnection();

	it( 'outgoing call starts in connecting', function(){
		webrtcCall = new WebRtcCall({
			isOutgoing: true,
			connection: mockConnection, 
			localId: 'localId', 
			remoteId: 'remoteId', 
			localStream: localStream,
			offer: null,
			metaData: { some: 'meta-data' }
		});

		expect( webrtcCall.state ).toBe( 'CONNECTING' );
	});

	it( 'receives a stream', function(){
		expect( webrtcCall.isDeclined ).toBe( false );
		expect( webrtcCall.isAccepted ).toBe( false );

		webrtcCall._$webRtcConnection._peerConnection.onaddstream({});
		expect( webrtcCall.state ).toBe( 'ESTABLISHED' );

		expect( webrtcCall.isDeclined ).toBe( false );
		expect( webrtcCall.isAccepted ).toBe( true );
	});

	it( 'ends the call', function(){
		expect( webrtcCall._$webRtcConnection._peerConnection.close ).not.toHaveBeenCalled();
		webrtcCall.end();
		expect( webrtcCall._$webRtcConnection._peerConnection.close ).toHaveBeenCalled();
		expect( webrtcCall.state ).toBe( 'ENDED' );
	});
});