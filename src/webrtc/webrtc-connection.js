var Emitter = require( 'component-emitter' );
var C = require( '../constants/constants' );
var noop = function(){};

/**
 * This class wraps around the native RTCPeerConnection
 * object (https://developer.mozilla.org/en/docs/Web/API/RTCPeerConnection)
 * and provides a thin layer of deepstream integration
 *
 * @constructor
 * 
 * @event error {Error}
 * @event stream {MediaStream}
 * 
 * @param {Connection} connection deepstream connection
 * @param {Object} options deepstream options
 * @param {String} localId    either a random id for outgoing calls or a callee name for incoming calls
 * @param {String} remoteId   either a random id for incoming calls or a callee name for outgoing calls
 */
var WebRtcConnection = function( connection, options, localId, remoteId ) {
	this._connection = connection;
	this._remoteId = remoteId;
	this._localId = localId;

	this._peerConnection = new RTCPeerConnection( options.rtcPeerConnectionConfig );
	this._peerConnection.onaddstream = this._onStream.bind( this );
	this._peerConnection.onicecandidate = this._onIceCandidate.bind( this );
	this._peerConnection.oniceconnectionstatechange = this._onIceConnectionStateChange.bind( this );
	this._constraints = { mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: true } };
};

Emitter( WebRtcConnection.prototype );

/**
 * Initiates a connection if this is an outgoing call
 *
 * @param   {MediaStream} stream   the local media stream
 * @param   {Mixed} metaData metaData will be attached to the offer
 *
 * @public
 * @returns {void}
 */
WebRtcConnection.prototype.initiate = function( stream, metaData ) {
	this._peerConnection.addStream( stream );
	this._peerConnection.createOffer( this._onOfferCreated.bind( this, metaData ), this._onError.bind( this ) );
};

/**
 * Closes the connection
 *
 * @public
 * @returns {void}
 */
WebRtcConnection.prototype.close = function() {
	this._peerConnection.close();
};

/**
 * Add a Media Stream to the connection
 *
 * @param   {MediaStream} stream   the local media stream
 *
 * @public
 * @returns {void}
 */
WebRtcConnection.prototype.addStream = function( stream ) {
	this._peerConnection.addStream( stream );
};

/**
 * Adds a remote description SDP
 *
 * @param {RTCSessionDescription} remoteDescription A session description SDP (https://developer.mozilla.org/en/docs/Web/API/RTCSessionDescription)
 * 
 * @public
 * @returns {void}
 */
WebRtcConnection.prototype.setRemoteDescription = function( remoteDescription ) {
	this._peerConnection.setRemoteDescription( remoteDescription, noop, this._onError.bind( this ) );
};

/**
 * Create an answer SDP
 *
 * @public
 * @returns {void}
 */
WebRtcConnection.prototype.createAnswer = function() {
	this._peerConnection.createAnswer( this._onAnswerCreated.bind( this ), this._onError.bind( this ), this._constraints );
};

/**
 * Adds an RTCIceCandidate to the peerConnection
 *
 * @param {RTCIceCandidate} iceCandidate
 *
 * @public
 * @returns {void}
 */
WebRtcConnection.prototype.addIceCandidate = function( iceCandidate ) {
	this._peerConnection.addIceCandidate( iceCandidate, noop, this._onError.bind( this ) );
};

/**
 * Callback for incoming stream
 *
 * @param   {MediaStreamEvent} event (https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamEvent)
 *
 * @private
 * @returns {void}
 */
WebRtcConnection.prototype._onStream = function( event ) {
	this.emit( 'stream', event.stream );
};

/**
 * Callback once the offer was created (why does this happen asynchronously?)
 *
 * @param   {Mixed} metaData
 * @param   {RTCSessionDescription} offer
 *
 * @private
 * @returns {void}
 */
WebRtcConnection.prototype._onOfferCreated = function( metaData, offer ) {
	this._sendMsg( C.ACTIONS.WEBRTC_OFFER, JSON.stringify({
		sdp: offer.sdp,
		type: offer.type,
		meta: metaData
	}));
	this._peerConnection.setLocalDescription( offer, noop, this._onError.bind( this ) );
};

/**
 * Callback once the answer was created (why does this happen asynchronously?)
 *
 * @param   {Mixed} metaData
 * @param   {RTCSessionDescription} answer
 *
 * @private
 * @returns {void}
 */
WebRtcConnection.prototype._onAnswerCreated = function( answer ) {
	this._sendMsg( C.ACTIONS.WEBRTC_ANSWER, answer.toJSON() );
	this._peerConnection.setLocalDescription( answer, noop, this._onError.bind( this ) );
};	

/**
 * Sends a message via deepstream
 *
 * @param   {String} action one of C.ACTIONS
 * @param   {String} data
 *
 * @private
 * @returns {void}
 */
WebRtcConnection.prototype._sendMsg = function( action, data ) {
	this._connection.sendMsg( 
		C.TOPIC.WEBRTC,
		action,
		[ this._localId, this._remoteId, data ]
	);
};

/**
 * Callback for incoming ICECandidates
 *
 * @param   {RTCPeerConnectionIceEvent} event https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnectionIceEvent
 *
 * @private
 * @returns {void}
 */
WebRtcConnection.prototype._onIceCandidate = function( event ) {
	if( event.candidate ) {
		this._sendMsg( C.ACTIONS.WEBRTC_ICE_CANDIDATE, event.candidate.toJSON() );
	}
};

/**
 *  Callback for changes to the ICE connection state
 *  
 *  Available states are
 *  
 * "new": the ICE agent is gathering addresses or waiting for remote candidates (or both).
 * "checking": the ICE agent has remote candidates, on at least one component, and is check them, though it has not found a connection yet. At the same time, it may still be gathering candidates.
 * "connected": the ICE agent has found a usable connection for each component, but is still testing more remote candidates for a better connection. At the same time, it may still be gathering candidates.
 * "completed": the ICE agent has found a usable connection for each component, and is no more testing remote candidates.
 * "failed": the ICE agent has checked all the remote candidates and didn't find a match for at least one component. Connections may have been found for some components.
 * "disconnected": liveness check has failed for at least one component. This may be a transient state, e. g. on a flaky network, that can recover by itself.
 * "closed": the ICE agent has shutdown and is not answering to requests.
 *
 * @private
 * @returns {void}
 */
WebRtcConnection.prototype._onIceConnectionStateChange = function() {
	if( this._peerConnection.iceConnectionState === 'disconnected' ) {
		this._connection.sendMsg( 
			C.TOPIC.WEBRTC,
			C.ACTIONS.WEBRTC_IS_ALIVE,
			[ this._remoteId ]
		);
	}
};

/**
 * Error callback
 *
 * @param   {Error} error
 *
 * @private
 * @returns {void}
 */
WebRtcConnection.prototype._onError = function( error ) {
	this.emit( 'error', error );
};

module.exports = WebRtcConnection;
