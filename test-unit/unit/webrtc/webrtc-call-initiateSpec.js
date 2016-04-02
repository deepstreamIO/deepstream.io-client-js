var WebRtcHandler = require( '../../../src/webrtc/webrtc-handler.js' ),
	MockConnection = require( '../../mocks/message/connection-mock' ),
	ClientMock = require( '../../mocks/client-mock' ),
	msg = require( '../../test-helper/test-helper' ).msg,
	webrtcMock = require( '../../mocks/webrtc/webrtc-mock' ),
	options = { calleeAckTimeout: 5, rtcPeerConnectionConfig: {} };


describe( 'webrtc call initate', function(){
	var webrtcHandler,
		calleeListener = jasmine.createSpy( 'callee listener' ),
		mockConnection = new MockConnection(),
		mockClient = new ClientMock(),
		call;

	it( 'creates global objects', function(){
		webrtcMock.on();
	});

	it( 'initialises the handler', function(){
		webrtcHandler = new WebRtcHandler( options, mockConnection, mockClient );
		expect( typeof webrtcHandler.registerCallee ).toBe( 'function' );
	});

	it( 'throws an error if WebRTC objects are not present', function(){
		webrtcMock.off();

		expect(function(){
			webrtcHandler.makeCall( 'calleeA', {} );
		}).toThrow();

		webrtcMock.on();
	});

	it( 'throws an error if calleeName is not a string', function(){
		expect(function(){
			webrtcHandler.makeCall( {}, {} );
		}).toThrow( new Error( 'Callee must be provided as string' ) );
	});

	it( 'throws an error if metaData is not provided', function(){
		expect(function(){
			webrtcHandler.makeCall( 'calleeA' );
		}).toThrow( new Error( 'metaData must be provided' ) );
	});

	it( 'creates a call', function(){
		call = webrtcHandler.makeCall( 'calleeA', {} );
		expect( call ).not.toBe( null );
	});

	it( 'can\'t call same callee at same time', function(){
		expect(function(){
			webrtcHandler.makeCall( 'calleeA', {} );
		}).toThrow( new Error( 'Call with calleeA is already in progress' ) );
	}); 

	it( 'removes global objects', function(){
		webrtcMock.off();
	});

});