var WebRtcCall = require( '../../../src/webrtc/webrtc-call.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	ClientMock = require( '../../mocks/client-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	webrtcMock = require( '../../mocks/webrtc/webrtc-mock' ),
	options = { calleeAckTimeout: 5, rtcPeerConnectionConfig: {} };

var declinedListener;
var establishedListener;
var stateChangeListener;
var endedListener;

function createCall( outgoing, mockConnection ) {
	declinedListener = jasmine.createSpy();
	stateChangeListener = jasmine.createSpy();
	establishedListener = jasmine.createSpy();
	endedListener = jasmine.createSpy();
	var webrtcCall =  new WebRtcCall({
			isOutgoing: outgoing,
			connection: mockConnection, 
			localId: 'localId', 
			remoteId: 'remoteId', 
			localStream: {},
			offer: null,
			metaData: { some: 'meta-data' }
	}, options );
	webrtcCall.on( 'declined', declinedListener );
	webrtcCall.on( 'stateChange', stateChangeListener );
	webrtcCall.on( 'ended', endedListener );
	webrtcCall.on( 'established', establishedListener );

	expect( webrtcCall.isDeclined ).toBe( false );
	expect( webrtcCall.isAccepted ).toBe( false );

	return webrtcCall;
}

describe( 'WEBRTC call spec', function() {

	//Before all in latest jasmine spec
	it( 'creates global objects', function(){
		webrtcMock.on();	
	});

	describe( 'incoming call gets declined', function(){
		var webrtcCall,
			mockConnection = new MockConnection();

		it( 'incoming calls start in initial', function(){
			webrtcCall = createCall( false, mockConnection );
			expect( webrtcCall.state ).toBe( 'INITIAL' );
		});

		it( 'declining an incoming call changes its state to declined', function(){
			webrtcCall.decline( 'some reason' );
			
			expect( webrtcCall.isDeclined ).toBe( true );
			expect( webrtcCall.isAccepted ).toBe( false );
			expect( mockConnection.lastSendMessage ).toBe( msg( 'W|CD|localId|remoteId|some reason+' ) );
			expect( webrtcCall.state ).toBe( 'DECLINED' );
			expect( declinedListener ).toHaveBeenCalledWith( 'some reason' );
			expect( stateChangeListener ).toHaveBeenCalledWith( 'DECLINED' );
		});

		it( 'can\'t accept declined calls', function(){
			expect(function(){
				webrtcCall.decline();
			}).toThrow();
		});

		it( 'can\'t decline declined calls multiple times', function(){
			expect(function(){
				webrtcCall.decline();
			}).toThrow();
		});
	});

	describe( 'incoming call gets accepted without a stream', function(){
		var webrtcCall,
			mockConnection = new MockConnection();

		it( 'incoming calls start in initial', function(){
			webrtcCall = createCall( false, mockConnection );
			expect( webrtcCall.state ).toBe( 'INITIAL' );
		});

		it( 'accepting an incoming call creates a peer connection and changes its state to accepted', function(){
			expect( webrtcCall._$webRtcConnection ).toBe( null );
			
			webrtcCall.accept();
			
			expect( webrtcCall.isDeclined ).toBe( false );
			expect( webrtcCall.isAccepted ).toBe( true );
			expect( webrtcCall._$webRtcConnection._peerConnection.addStream.calls.count() ).toBe( 0 );
			expect( webrtcCall.state ).toBe( 'ACCEPTED' );
			expect( stateChangeListener ).toHaveBeenCalledWith( 'ACCEPTED' );
		});

		it( 'can\'t accept accepted calls multiple times', function(){
			expect(function(){
				webrtcCall.accept();
			}).toThrow();
		});

		it( 'can\'t decline accepted calls', function(){
			expect(function(){
				webrtcCall.decline();
			}).toThrow();
		});

		it( 'receiving a remote stream changes the state to established', function(){
			webrtcCall._$webRtcConnection._peerConnection.onaddstream({});
			
			expect( webrtcCall.state ).toBe( 'ESTABLISHED' );
			expect( stateChangeListener ).toHaveBeenCalledWith( 'ESTABLISHED' );
			expect( establishedListener ).toHaveBeenCalled();
		});

		it( 'receiving a end message closes the peer connection and sets the state to ended', function(){
			expect( webrtcCall._$webRtcConnection._peerConnection.close ).not.toHaveBeenCalled();
			
			webrtcCall._$close();
			
			expect( webrtcCall.state ).toBe( 'ENDED' );
			expect( webrtcCall._$webRtcConnection._peerConnection.close ).toHaveBeenCalled();
			expect( stateChangeListener ).toHaveBeenCalledWith( 'ENDED' );
			expect( endedListener ).toHaveBeenCalled();
		});
	});

	describe( 'outgoing call gets declined', function(){
		var webrtcCall,
			mockConnection = new MockConnection();

		it( 'outgoing call starts in connecting', function(){
			webrtcCall = createCall( true, mockConnection );
			expect( webrtcCall.state ).toBe( 'CONNECTING' );
		});

		it( 'receives a decline message', function(){
			webrtcCall._$declineReceived( 'a reason' );
			
			expect( webrtcCall.state ).toBe( 'DECLINED' );
			expect( stateChangeListener ).toHaveBeenCalledWith( 'DECLINED' );
			expect( declinedListener ).toHaveBeenCalled();
			expect( webrtcCall.isDeclined ).toBe( true );
			expect( webrtcCall.isAccepted ).toBe( false );
		});
	});

	describe( 'outgoing call gets accepted', function(){
		var webrtcCall,
			mockConnection = new MockConnection();

		it( 'outgoing call starts in connecting', function(){
			webrtcCall = createCall( true, mockConnection );
			expect( webrtcCall.state ).toBe( 'CONNECTING' );
		});

		it( 'receives a stream', function(){
			webrtcCall._$webRtcConnection._peerConnection.onaddstream({});
			
			expect( webrtcCall.state ).toBe( 'ESTABLISHED' );
			expect( stateChangeListener ).toHaveBeenCalledWith( 'ESTABLISHED' );
			
			expect( webrtcCall.isDeclined ).toBe( false );
			expect( webrtcCall.isAccepted ).toBe( true );
		});

		it( 'ends the call', function(){
			expect( webrtcCall._$webRtcConnection._peerConnection.close ).not.toHaveBeenCalled();
			
			webrtcCall.end();
			
			expect( mockConnection.lastSendMessage ).toBe( msg( 'W|CE|localId|remoteId|null+' ) );
			expect( webrtcCall._$webRtcConnection._peerConnection.close ).toHaveBeenCalled();
			expect( webrtcCall.state ).toBe( 'ENDED' );
			expect( stateChangeListener ).toHaveBeenCalledWith( 'ENDED' );
		});
	});

	//After all in latest jasmine spec
	it( 'after all global objects', function(){
		webrtcMock.off();
	});
});