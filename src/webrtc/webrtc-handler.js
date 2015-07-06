var C = require( '../constants/constants' ),
	WebRtcConnection = require( './webrtc-connection' ),
	WebRtcResponse = require( './webrtc-response' );
/**
 * The main class for web rtc operations
 * 
 * Provides an interface to register callees, make calls and listen 
 * for callee registrations
 * 
 * @param {Object} options deepstream configuration options
 * @param {Connection} connection
 * @param {Client} client
 * 
 * @constructor
 * @public
 */
var WebRtcHandler = function( options, connection, client ) {
	this._options = options;
	this._connection = connection;
	this._client = client;
	this._callees = {};
	this._webRtcConnections = {};
};

/**
 * Register a "callee" (an endpoint that can receive video, audio or data streams)
 *
 * @param   {String} 	name     A name that can be used in makeCall to establish a connection to a callee
 * @param   {Map} 	 	options  Defines the kind of streams this client can receive
 *                            	 in the format { video: <Bool>, audio: <Bool>, data: <Bool> }
 * @param   {Function} 	onCallFn Callback for incoming calls. Will be invoked with call data and a WebRtc Response object
 *
 * @public
 * @returns {void}
 */
WebRtcHandler.prototype.registerCallee = function( name, options, onCallFn ) {
	if( typeof name !== 'string' ) {
		throw new Error( 'Invalid callee name ' + name );
	}

	if( this._callees[ name ] ) {
		throw new Error( 'Callee ' + name + ' is already registered' );
	}

	if( arguments.length === 2 ) {
		onCallFn = arguments[ 1 ];
		options = {};
	}

	options.audio = options.audio === false ? false : true;
	options.video = options.video === false ? false : true;
	options.data = options.data === false ? false : true;

	this._callees[ name ] = {
		callback: onCallFn,
		options: options
	};

	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_REGISTER_CALLEE, [ name, options ] );
};

/**
 * [makeCall description]
 *
 * @param   {String} calleeName  The name of a previously registered callee
 * @param 	{Object} metaData	Additional information that should be passed to the receiver's onCall function
 * @param   {[MediaStream]} localStream A local media stream. Can be ommited if the call is used purely for data.
 * @param   {[type]} onResponse  Will be called with an error (or null), a remote stream (or null) and a Webrtc Call object
 *
 * @returns {[type]}
 */
WebRtcHandler.prototype.makeCall = function( calleeName, metaData, localStream, onResponse ) {
	if( this._webRtcConnections[ calleeName ] ) {
		throw new Error( 'Call with ' + calleeName + ' is already in progress' );
	}

	var localId = this._client.getUid();
	this._webRtcConnections[ localId ] = new WebRtcConnection( this._connection, localId, calleeName );
	this._webRtcConnections[ localId ].initiate( localStream );
};
 
WebRtcHandler.prototype.listenForCallees = function() {

};

WebRtcHandler.prototype.unlistenForCallees = function() {

};

WebRtcHandler.prototype._establishCall = function( calleeName, onResponse, remoteStream ) {
	onResponse( null, remoteStream, {} );
};


WebRtcHandler.prototype._getWebRtcConnection = function( message ) {
	if( this._webRtcConnections[ message.data[ 0 ] ] ) {
		return this._webRtcConnections[ message.data[ 0 ] ];
	} 
	else if( this._webRtcConnections[ message.data[ 1 ] ] ) {
		return this._webRtcConnections[ message.data[ 1 ] ];
	}
	else {
		this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.EVENT.UNSOLICITED_MESSAGE, message.raw );
		return null;
	}
};

WebRtcHandler.prototype._handleIncomingCall = function( message ) {
	var remoteId = message.data[ 0 ],
		localId = message.data[ 1 ],
		offer = JSON.parse( message.data[ 2 ] ),
		response = new WebRtcResponse();

	response.on( 'accepted', function( localStream, callback ){
		this._webRtcConnections[ remoteId ] = new WebRtcConnection( this._connection, localId, remoteId );
		this._webRtcConnections[ remoteId ].setRemoteDescription( new RTCSessionDescription( offer ) );
		this._webRtcConnections[ remoteId ].createAnswer();
		this._webRtcConnections[ remoteId ].on( 'stream', this._incomingCallReady.bind( this ) );
	}.bind( this ));

	response.on( 'declined', function( reason ){
		this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.CALL_DECLINED, [ localId, remoteId ] );
	}.bind( this ) );

	this._callees[ localId ].callback( response, {} );
};

WebRtcHandler.prototype._incomingCallReady = function( localId, remoteId, remoteStream ) {
	
	
};

WebRtcHandler.prototype._handleAnswer = function( message ) {
	var webRtcConnection = this._getWebRtcConnection( message );
	
	if( webRtcConnection ) {
		webRtcConnection.setRemoteDescription( new RTCSessionDescription( JSON.parse( message.data[ 2 ] ) ) );
	}
};

WebRtcHandler.prototype._addIceCandidate = function( message ) {
	var webRtcConnection = this._getWebRtcConnection( message );
	
	if( webRtcConnection ) {
		webRtcConnection.addIceCandidate( new RTCIceCandidate( JSON.parse( message.data[ 2 ] ) ) );
	}
};

WebRtcHandler.prototype._ackCalleeRegistration = function( message ) {

};

WebRtcHandler.prototype._$handle = function( message ) {
	if( message.action === C.ACTIONS.ERROR ) {
		this._client._$onError( C.TOPIC.WEBRTC, message.data[ 0 ], message.data[ 1 ] );
		return;
	}

	if( message.action === C.ACTIONS.ACK ) {
		this._ackCalleeRegistration( message );
		return;
	}

	var isValidMessage = message.data.length === 3 &&
						typeof message.data[ 0 ] === 'string' &&
						typeof message.data[ 1 ] === 'string' &&
						typeof message.data[ 2 ] === 'string';

	if( !isValidMessage ) {
		this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.MESSAGE_PARSE_ERROR, message );
		return;
	}

	if( message.action === C.ACTIONS.WEBRTC_OFFER ) {
		this._handleIncomingCall( message );
	}
	else if ( message.action === C.ACTIONS.WEBRTC_ANSWER ) {
		this._handleAnswer( message );
	}
	else if( message.action === C.ACTIONS.WEBRTC_ICE_CANDIDATE ) {
		this._addIceCandidate( message );
	}
	else {
		this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.EVENT.MESSAGE_PARSE_ERROR, 'unsupported action ' + message.action );
	}
};

module.exports = WebRtcHandler;