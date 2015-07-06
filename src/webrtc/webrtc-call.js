var WebRtcConnection = require( './webrtc-connection' ),
	EventEmitter = require( 'component-emitter' ),
	C = require( '../constants/constants' );
/**
 * [WebRtcCall description]
 *
 * @event established <remoteStream>
 * @event declined <reason>
 * @event error <error>
 * @event stateChange <state>
 * @event destroy
 *
 * @param {Object} settings
 *
 * {
 * 		isOutgoing, 
 * 		connection, 
 * 		localId, 
 * 		remoteId, 
 * 		localStream,
 * 		offer
 * }
 */
var WebRtcCall = function( settings ) {
	this._connection = settings.connection;
	this._localId = settings.localId;
	this._remoteId = settings.remoteId;
	this._localStream = settings.localStream;
	this._offer = settings.offer;
	this._$webRtcConnection = null;

	this.state = C.CALL_STATE.INITIAL;
	this.metaData = null;
	this.callee = '<string>';
	this.isOutgoing = settings.isOutgoing;
	this.isIncoming = !settings.isOutgoing;
	this.isAccepted = false;
	this.isDeclined = false;
	
	if( this.isOutgoing ) {
		this._initiate();
	}
};

EventEmitter( WebRtcCall.prototype );

WebRtcCall.prototype.accept = function( localStream ) {
	if( this.isAccepted ) {
		throw new Error( 'Incoming call is already accepted' );
	}

	if( this.isDeclined ) {
		throw new Error( 'Can\'t accept incoming call. Call was already declined' );
	}

	this.isAccepted = true;

	this._$webRtcConnection = new WebRtcConnection( this._connection, this._localId, this._remoteId );
	if( localStream ) {
		this._$webRtcConnection.addStream( localStream );
	}
	this._$webRtcConnection.setRemoteDescription( new RTCSessionDescription( this._offer ) );
	this._$webRtcConnection.createAnswer();
	this._$webRtcConnection.on( 'stream', this._onEstablished.bind( this ) );
};

WebRtcCall.prototype.decline = function( reason ) {
	if( this.isAccepted ) {
		throw new Error( 'Can\'t decline incoming call. Call was already accepted' );
	}

	if( this.isDeclined ) {
		throw new Error( 'Incoming call was already declined' );
	}

	this.isDeclined = true;
	this._connection.sendMsg( C.TOPIC.WEBRTC, C.ACTIONS.CALL_DECLINED, [ this._localId, this._remoteId ] );
};

WebRtcCall.prototype.end = function() {
	this._$webRtcConnection.close();
};

WebRtcCall.prototype._initiate = function() {
	this._$webRtcConnection = new WebRtcConnection( this._connection, this._localId, this._remoteId );
	this._$webRtcConnection.initiate( this._localStream );
	this._$webRtcConnection.on( 'stream', this._onEstablished.bind( this ) );
};

WebRtcCall.prototype._onEstablished = function( stream ) {
	this.emit( 'established', stream );
};

module.exports = WebRtcCall;