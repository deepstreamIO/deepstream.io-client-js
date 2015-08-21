var WebRtcConnection = require( './webrtc-connection' ),
	EventEmitter = require( 'component-emitter' ),
	C = require( '../constants/constants' );

/**
 * This class represents a single call between two peers
 * in all its states. It's returned by ds.webrtc.makeCall
 * as well as passed to the callback of 
 * ds.webrtc.registerCallee( name, callback );
 *
 * @constructor
 * @extends {EventEmitter}
 *
 * @event established <remoteStream>
 * @event declined <reason>
 * @event error <error>
 * @event stateChange <state>
 * @event ended
 *
 * @param {Object} settings
 *
 * {
 * 		isOutgoing: <Boolean>, 
 * 		connection: <Deepstream Connection>,
 * 		localId: <String>,
 * 		remoteId: <String>,
 * 		localStream: <MediaStream>,
 * 		offer: <Offer SDP>
 * }
 *
 * @param {Object} options deepstream options
 */
var WebRtcCall = function( settings, options ) {
	this._connection = settings.connection;
	this._localId = settings.localId;
	this._remoteId = settings.remoteId;
	this._localStream = settings.localStream;
	this._offer = settings.offer;
	this._$webRtcConnection = null;
	this._bufferedIceCandidates = [];
	this._options = options;

	this.state = C.CALL_STATE.INITIAL;
	this.metaData = settings.metaData || null;
	this.callee = settings.isOutgoing ? settings.remoteId : settings.localId;
	this.isOutgoing = settings.isOutgoing;
	this.isIncoming = !settings.isOutgoing;
	this.isAccepted = false;
	this.isDeclined = false;
	
	if( this.isOutgoing ) {
		this._initiate();
	}
};

EventEmitter( WebRtcCall.prototype );

/**
 * Accept an incoming call
 *
 * @param   {MediaStream} localStream
 *
 * @public
 * @returns {void}
 */
WebRtcCall.prototype.accept = function( localStream ) {
	if( this.isAccepted ) {
		throw new Error( 'Incoming call is already accepted' );
	}

	if( this.isDeclined ) {
		throw new Error( 'Can\'t accept incoming call. Call was already declined' );
	}

	this.isAccepted = true;

	this._$webRtcConnection = new WebRtcConnection( this._connection, this._options, this._localId, this._remoteId );
	
	if( localStream ) {
		this._$webRtcConnection.addStream( localStream );
	}
	
	this._$webRtcConnection.setRemoteDescription( new RTCSessionDescription( this._offer ) );
	this._$webRtcConnection.createAnswer();
	this._$webRtcConnection.on( 'stream', this._onEstablished.bind( this ) );
	this._$webRtcConnection.on( 'error', this.emit.bind( this, 'error' ) );

	for( var i = 0; i < this._bufferedIceCandidates.length; i++ ) {
		this._$webRtcConnection.addIceCandidate( this._bufferedIceCandidates[ i ] );
	}
	
	this._bufferedIceCandidates = [];
	this._stateChange( C.CALL_STATE.ACCEPTED );
};

/**
 * Decline an incoming call
 *
 * @param   {[String]} reason An optional reason as to why the call was declined
 *
 * @private
 * @returns {void}
 */
WebRtcCall.prototype.decline = function( reason ) {
	if( this.isAccepted ) {
		throw new Error( 'Can\'t decline incoming call. Call was already accepted' );
	}

	if( this.isDeclined ) {
		throw new Error( 'Incoming call was already declined' );
	}

	this.isDeclined = true;
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_CALL_DECLINED, [ this._localId, this._remoteId, reason || null ] );
	this._$declineReceived( reason || null );
};

/**
 * Ends a call that's in progress.
 *
 * @public
 * @returns {void}
 */
WebRtcCall.prototype.end = function() {
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.WEBRTC_CALL_ENDED, [ this._localId, this._remoteId, null ] );
	this._$close();
};

/**
 * Closes the connection and ends the call. This can be invoked from the
 * outside as a result of an incoming end message as well as by calling end()
 *
 * @protected
 * @returns {void}
 */
WebRtcCall.prototype._$close = function() {
	this._stateChange( C.CALL_STATE.ENDED );
	if( this._$webRtcConnection ) {
		this._$webRtcConnection.close();
	}
	this.emit( 'ended' );
};

/**
 * Add an ICE (Interactive Connection Establishing) Candidate
 *
 * @param   {RTCIceCandidate} iceCandidate An object, describing a host and port combination
 *                                         that the peers can try to connect on
 *
 * @protected
 * @returns {void}
 */
WebRtcCall.prototype._$addIceCandidate = function( iceCandidate ) {
	if( this.isIncoming && this.isAccepted === false ) {
		this._bufferedIceCandidates.push( iceCandidate );
	} else {
		this._$webRtcConnection.addIceCandidate( iceCandidate );
	}
};

/**
 * Will be invoked by the webrtcHandler if a decline message is received from the other party
 *
 * @param   {[String]} reason Optional reason as to why the call was declined
 *
 * @protected
 * @returns {void}
 */
WebRtcCall.prototype._$declineReceived = function( reason ) {
	this.isDeclined = true;
	this.isAccepted = false;
	this._stateChange( C.CALL_STATE.DECLINED );
	this.emit( 'declined', reason );
};

/**
 * Is invoked for every stateChange
 *
 * @param   {String} state one of C.CALL_STATE
 *
 * @private
 * @returns {void}
 */
WebRtcCall.prototype._stateChange = function( state ) {
	this.state = state;
	this.emit( 'stateChange', state );
};

/**
 * Initiates the an outgoing call
 *
 * @private
 * @returns {void}
 */
WebRtcCall.prototype._initiate = function() {
	this._stateChange( C.CALL_STATE.CONNECTING );
	this._$webRtcConnection = new WebRtcConnection( this._connection, this._options, this._localId, this._remoteId );
	this._$webRtcConnection.initiate( this._localStream, this.metaData );
	this._$webRtcConnection.on( 'stream', this._onEstablished.bind( this ) );
};

/**
 * Callback for accept messages. Sets the call to established and informs the client
 *
 * @param   {MediaStream} stream
 *
 * @private
 * @returns {void}
 */
WebRtcCall.prototype._onEstablished = function( stream ) {
	this.isDeclined = false;
	this.isAccepted = true;
	this._stateChange( C.CALL_STATE.ESTABLISHED );
	this.emit( 'established', stream );
};

module.exports = WebRtcCall;