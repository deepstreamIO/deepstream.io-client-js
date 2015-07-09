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
	this._localCallees = {};
	this._remoteCallees = [];
	this._remoteCalleesCallback = null;
	this._calls = {};
};

/**
 * Register a "callee" (an endpoint that can receive video, audio or data streams)
 *
 * @param   {String} 	name     A name that can be used in makeCall to establish a connection to a callee
 * @param   {Function} 	onCallFn Callback for incoming calls. Will be invoked with call data and a WebRtc Response object
 *
 * @public
 * @returns {void}
 */
WebRtcHandler.prototype.registerCallee = function( name, onCallFn ) {
	if( typeof name !== 'string' ) {
		throw new Error( 'Invalid callee name ' + name );
	}

	if( typeof onCallFn !== 'function' ) {
		throw new Error( 'Callback is not a function' );
	}

	if( this._localCallees[ name ] ) {
		throw new Error( 'Callee ' + name + ' is already registered' );
	}

	this._localCallees[ name ] = onCallFn;
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_REGISTER_CALLEE, [ name ] );
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
		offer: null,
		metaData: metaData
	});
};
 
WebRtcHandler.prototype.listenForCallees = function( callback ) {
	if( this._remoteCalleesCallback !== null ) {
		throw new Error( 'Already listening for callees' );
	}
	this._remoteCalleesCallback = callback;
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_LISTEN_FOR_CALLEES );
};

WebRtcHandler.prototype.unlistenForCallees = function() {
	this._remoteCalleesCallback = null;
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_UNLISTEN_FOR_CALLEES );
};

WebRtcHandler.prototype._handleIncomingCall = function( message ) {
	var remoteId = message.data[ 0 ],
		localId = message.data[ 1 ],
		offer = JSON.parse( message.data[ 2 ] ),
		call = this._createCall( remoteId, {
			isOutgoing: false,
			connection: this._connection, 
			localId: localId, 
			remoteId: remoteId, 
			localStream: null,
			metaData: offer.meta,
			offer: offer
		});

	this._localCallees[ localId ]( call, offer.meta );
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

WebRtcHandler.prototype._isCalleeUpdate = function( message ) {
	return 	message.action === C.ACTIONS.WEBRTC_ALL_CALLEES ||
			message.action === C.ACTIONS.WEBRTC_CALLEE_ADDED ||
			message.action === C.ACTIONS.WEBRTC_CALLEE_REMOVED;
};

WebRtcHandler.prototype._processCalleeUpdate = function( message ) {
	if( this._remoteCalleesCallback === null ) {
		this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.UNSOLICITED_MESSAGE, message.raw );
		return;
	}

	if( message.action === C.ACTIONS.WEBRTC_ALL_CALLEES ) {
		this._remoteCallees = message.data;
	}

	var index = this._remoteCallees.indexOf( message.data[ 0 ] );
	
	if( message.action === C.ACTIONS.WEBRTC_CALLEE_ADDED ) {
		if( index !== -1 ) {
			return;
		}
		this._remoteCallees.push( message.data[ 0 ] );
	}
	else if ( message.action === C.ACTIONS.WEBRTC_CALLEE_REMOVED ) {
		if( index === -1 ) {
			return;
		}
		this._remoteCallees.splice( index, 1 );
	}

	this._remoteCalleesCallback( this._remoteCallees );
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

	if( this._isCalleeUpdate( message ) ) {
		this._processCalleeUpdate( message );
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