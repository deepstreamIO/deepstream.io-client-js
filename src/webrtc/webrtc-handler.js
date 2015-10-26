var C = require( '../constants/constants' ),
	WebRtcConnection = require( './webrtc-connection' ),
	WebRtcCall = require( './webrtc-call' ),
	AckTimeoutRegistry = require( '../utils/ack-timeout-registry' ),
	CALLEE_UPDATE_EVENT = 'callee-update';

/**
 * The main class for webrtc operations
 * 
 * Provides an interface to register callees, make calls and listen 
 * for callee registrations
 *
 * WebRTC (Web Real Time Communication) is a standard that allows browsers
 * to share video, audio and data-streams via a peer connection. A server is only
 * used to establish and end calls
 *
 * To learn more, please have a look at the WebRTC documentation on MDN
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
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
	this._ackTimeoutRegistry = new AckTimeoutRegistry( client, C.TOPIC.WEBRTC, this._options.calleeAckTimeout );
	this._ackTimeoutRegistry.on( 'timeout', this._removeCallee.bind( this ) );
	this._calls = {};
};

/**
 * Register a "callee" (an endpoint that can receive incoming audio and video streams). Callees are comparable
 * to entries in a phonebook. They have a unique identifier (their name) and an on-call function that will be invoked
 * whenever another client calls makeCall.
 *
 * @param   {String} 	name     A name that can be used in makeCall to establish a connection to this callee
 * @param   {Function} 	onCallFn Callback for incoming calls. Will be invoked with a <webrtc-call> object and meta-data
 *
 * @public
 * @returns {void}
 */
WebRtcHandler.prototype.registerCallee = function( name, onCallFn ) {
	this._checkCompatibility();

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
	this._ackTimeoutRegistry.add( name );
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_REGISTER_CALLEE, [ name ] );
};

/**
 * Removes a callee that was previously registered with WebRtcHandler.registerCallee
 *
 * @param   {String} name calleeName
 *
 * @public
 * @returns {void}
 */
WebRtcHandler.prototype.unregisterCallee = function( name ) {
	if( !this._localCallees[ name ] ) {
		throw new Error( 'Callee is not registered' );
	}
	
	this._removeCallee( name );
	this._ackTimeoutRegistry.add( name );
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_UNREGISTER_CALLEE, [ name ] );
};

/**
 * Creates a call to another registered callee. This call can still be declined or remain unanswered. The call
 * object that this method returns will emit an 'established' event once the other side has accepted it and shares
 * its video/audio stream.
 *
 * @param   {String} calleeName  The name of a previously registered callee
 * @param 	{Object} metaData	Additional information that will be passed to the receiver's onCall function
 * @param   {[MediaStream]} localStream A local media stream. Can be ommited if the call is used purely for data.

 * @public
 * @returns {WebRtcCall}
 */
WebRtcHandler.prototype.makeCall = function( calleeName, metaData, localStream ) {
	this._checkCompatibility();

	if( typeof calleeName !== 'string' ) {
		throw new Error( 'Callee must be provided as string' );
	}

	if( typeof metaData !== 'object' ) {
		throw new Error( 'metaData must be provided' );
	}

	if( this._calls[ calleeName ] ) {
		throw new Error( 'Call with ' + calleeName + ' is already in progress' );
	}

	var localId = this._client.getUid();

	this._ackTimeoutRegistry.add( localId );

	return this._createCall( calleeName, {
		isOutgoing: true,
		connection: this._connection, 
		localId: localId, 
		remoteId: calleeName, 
		localStream: localStream,
		offer: null,
		metaData: metaData
	});
};
 
/**
 * Register a listener that will be invoked with all callees that are currently registered. This is
 * useful to create a "phone-book" display. Only one listener can be registered at a time
 *
 * @param   {Function} callback Will be invoked initially and every time a callee is added or removed
 *
 * @public
 * @returns {void}
 */
WebRtcHandler.prototype.listenForCallees = function( callback ) {
	if( this._remoteCalleesCallback !== null ) {
		throw new Error( 'Already listening for callees' );
	}
	this._remoteCalleesCallback = callback;
	this._ackTimeoutRegistry.add( CALLEE_UPDATE_EVENT );
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_LISTEN_FOR_CALLEES );
};

/**
 * Removes the listener that was previously registered with listenForCallees
 *
 * @public
 * @returns {void}
 */
WebRtcHandler.prototype.unlistenForCallees = function() {
	if( !this._remoteCalleesCallback ) {
		throw new Error( 'Not listening for callees' );
	}
	this._remoteCalleesCallback = null;
	this._ackTimeoutRegistry.add( CALLEE_UPDATE_EVENT );
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_UNLISTEN_FOR_CALLEES );
};

/**
 * This method is invoked whenever an incoming call message is received. It constracts
 * a call object and passes it to the callback function that was registered with registerCallee
 *
 * @param   {Object} message parsed deepstream message
 *
 * @private
 * @returns {void}
 */
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

/**
 * Removes a call from the internal cache. This can be the result of a call ending, being
 * declined or erroring.
 *
 * @param   {String} id The temporary id (receiverName for incoming-, senderName for outgoing calls)
 *
 * @private
 * @returns {void}
 */
WebRtcHandler.prototype._removeCall = function( id ) {
	delete this._calls[ id ];
};

/**
 * Creates a new instance of WebRtcCall
 *
 * @param   {String} id The temporary id (receiverName for incoming-, senderName for outgoing calls)
 * @param   {Object} settings Call settings. Please see WebRtcCall for details
 *
 * @private
 * @returns {void}
 */
WebRtcHandler.prototype._createCall = function( id, settings ) {
	this._calls[ id ] = new WebRtcCall( settings, this._options );
	this._calls[ id ].on( 'ended', this._removeCall.bind( this, id ) );
	return this._calls[ id ];
};

/**
 * All call-related messages (offer, answer, ice candidate, decline, end etc.) share the same data signature.
 *
 * [ senderName, receiverName, arbitrary data string ]
 *
 * This method makes sure the message is in the correct format.
 *
 * @param   {Object}  message A parsed deepstream message
 *
 * @private
 * @returns {Boolean}
 */
WebRtcHandler.prototype._isValidMessage = function( message ) {
	return message.data.length === 3 &&
	typeof message.data[ 0 ] === 'string' &&
	typeof message.data[ 1 ] === 'string' &&
	typeof message.data[ 2 ] === 'string';
};

/**
 * Returns true if the messages is an update to the list of updated callees
 *
 * @param   {Object}  message A parsed deepstream message
 *
 * @private
 * @returns {Boolean}
 */
WebRtcHandler.prototype._isCalleeUpdate = function( message ) {
	return 	message.action === C.ACTIONS.WEBRTC_ALL_CALLEES ||
			message.action === C.ACTIONS.WEBRTC_CALLEE_ADDED ||
			message.action === C.ACTIONS.WEBRTC_CALLEE_REMOVED;
};

/**
 * The WebRTC specification is still very much in flux and implementations are fairly unstandardized. To
 * get WebRTC to work across all supporting browsers it is therefor crucial to use a shim / adapter script
 * to normalize implementation specifities.
 *
 * This adapter script however is not included with the client. This is for three reasons:
 * 
 * - Whilst WebRTC is a great feature of deepstream, it is not a central one. Most usecases will probably
 *   focus on Records, Events and RPCs. We've therefor choosen to rather reduce the client size and leave
 *   it to WebRTC users to include the script themselves
 *
 * - Since the API differences are still subject to frequent change it is likely that updates to the WebRTC
 *   adapter script will be quite frequent. By making it a seperate dependency it can be updated individually
 *   as soon as it is released.
 *
 * - Whilst working well, the code quality of adapter is rather poor. It lives in the global namespace, adds
 *   console logs etc.
 *
 * This method checks if all the WebRTC related objects that it will use further down the line are present
 * and if not recommends usage of the WebRTC adapter script
 *
 * @private
 * @returns {void}
 */
WebRtcHandler.prototype._checkCompatibility = function() {
	if(
		typeof RTCPeerConnection === 'undefined' ||
		typeof RTCSessionDescription === 'undefined' ||
		typeof RTCIceCandidate === 'undefined'
	){
		var msg =  'RTC global objects not detected. \n';
			msg += 'deepstream expects a standardized WebRtc implementation (e.g. no vendor prefixes etc.) \n';
			msg += 'until WebRtc is fully supported, we recommend including the official WebRTC adapter script \n';
			msg += 'which can be found at https://github.com/webrtc/adapter';

		throw new Error( msg );
	}
};

/**
 * Removes a callee from the internal cache as a result of an ACK timeout or the callee being unregistered.
 *
 * @param   {String} calleeName A local callee that was previously registered using registerCallee
 *
 * @private
 * @returns {void}
 */
WebRtcHandler.prototype._removeCallee = function( calleeName ) {
	delete this._localCallees[ calleeName ];
};

/**
 * Processes an update to the list of callees that are registered with deepstream. When listenForCallees
 * is initally called, it receives a full list of all registered callees. From there on it is only
 * send deltas. This method merges the delta updates into the full array of registered callees and
 * invokes the listener callback with the result.
 *
 * @param   {Object} message a parsed deepstream message
 *
 * @private
 * @returns {void}
 */
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

/**
 * The main method for incoming WebRTC messages.
 *
 * @param   {Object} message a parsed deepstream message
 *
 *
 * @private
 * 
 * @returns {void}
 */
WebRtcHandler.prototype._$handle = function( message ) {
	var call,
		sessionDescription,
		iceCandidate;

	if( message.action === C.ACTIONS.ERROR ) {
		this._client._$onError( C.TOPIC.WEBRTC, message.data[ 0 ], message.data[ 1 ] );
		return;
	}

	if( message.action === C.ACTIONS.ACK ) {
		this._ackTimeoutRegistry.clear( message );
		return;
	}

	if( this._isCalleeUpdate( message ) ) {
		this._processCalleeUpdate( message );
		return;	
	}

	if( message.action === C.ACTIONS.WEBRTC_IS_ALIVE ) {
		if( message.data[ 1 ] === 'false' && this._calls[ message.data[ 0 ] ] ) {
			this._calls[ message.data[ 0 ] ]._$close();
		}
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
	
	if( message.action === C.ACTIONS.WEBRTC_CALL_ENDED ) {
		call._$close();
		return;
	}

	this._client._$onError( C.TOPIC.WEBRTC, C.EVENT.EVENT.MESSAGE_PARSE_ERROR, 'unsupported action ' + message.action );
};

module.exports = WebRtcHandler;