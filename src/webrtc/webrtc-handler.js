var C = require( '../constants/constants' ),
	WebRtcConnection = require( './webrtc-connection' ),
	WebRtcCall = require( './webrtc-call' );

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
	this._calls = {};
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
WebRtcHandler.prototype.makeCall = function( calleeName, metaData, localStream ) {
	if( this._calls[ calleeName ] ) {
		throw new Error( 'Call with ' + calleeName + ' is already in progress' );
	}

	var localId = this._client.getUid();

	return this._createCall( localId, {
		isOutgoing: true,
		connection: this._connection, 
		localId: localId, 
		remoteId: calleeName, 
		localStream: localStream,
		offer: null
	});
};
 
WebRtcHandler.prototype.listenForCallees = function() {

};

WebRtcHandler.prototype.unlistenForCallees = function() {

};

WebRtcHandler.prototype._handleIncomingCall = function( message ) {
	var remoteId = message.data[ 0 ],
		localId = message.data[ 1 ],
		call = this._createCall( remoteId, {
			isOutgoing: false,
			connection: this._connection, 
			localId: localId, 
			remoteId: remoteId, 
			localStream: null,
			offer: JSON.parse( message.data[ 2 ] )
		});

	this._callees[ localId ].callback( call );
};

WebRtcHandler.prototype._removeCall = function( id ) {
	delete this._calls[ id ];
};

WebRtcHandler.prototype._createCall = function( id, settings ) {
	this._calls[ id ] = new WebRtcCall( settings );
	this._calls[ id ].on( 'destroy', this._removeCall.bind( this, id ) );
	return this._calls[ id ];
};


WebRtcHandler.prototype._ackCalleeRegistration = function( message ) {

};

WebRtcHandler.prototype._isValidMessage = function( message ) {
	return message.data.length === 3 &&
	typeof message.data[ 0 ] === 'string' &&
	typeof message.data[ 1 ] === 'string' &&
	typeof message.data[ 2 ] === 'string';
};


WebRtcHandler.prototype._$handle = function( message ) {
	var call,
		sessionDescription,
		iceCandidate;

	if( message.action === C.ACTIONS.ERROR ) {
		this._client._$onError( C.TOPIC.WEBRTC, message.data[ 0 ], message.data[ 1 ] );
		return;
	}

	if( message.action === C.ACTIONS.ACK ) {
		this._ackCalleeRegistration( message );
		return;
	}

	if( !this._isValidMessage( message ) ) {
		this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.MESSAGE_PARSE_ERROR, message );
		return;
	}

	if( message.action === C.ACTIONS.WEBRTC_OFFER ) {
		this._handleIncomingCall( message );
		return;
	}

	call = this._calls[ message.data[ 0 ] ] || this._calls[ message.data[ 1 ] ];

	if( !call ) {
		this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.UNSOLICITED_MESSAGE, message.raw );
		return;
	}
	
	if ( message.action === C.ACTIONS.WEBRTC_ANSWER ) {
		sessionDescription = new RTCSessionDescription( JSON.parse( message.data[ 2 ] ) );
		call._$webRtcConnection.setRemoteDescription( sessionDescription );
		return;
	}
	
	if( message.action === C.ACTIONS.WEBRTC_ICE_CANDIDATE ) {
		iceCandidate = new RTCIceCandidate( JSON.parse( message.data[ 2 ] ) );
		call._$addIceCandidate( iceCandidate );
		return;
	}

	if( message.action === C.ACTIONS.WEBRTC_CALL_DECLINED ) {
		call._$declineReceived( message.data[ 2 ] );
		return;
	}
	
	this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.EVENT.MESSAGE_PARSE_ERROR, 'unsupported action ' + message.action );
};

module.exports = WebRtcHandler;