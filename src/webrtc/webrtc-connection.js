var Emitter = require( 'component-emitter' );
var C = require( '../constants/constants' );

var WebRtcConnection = function( connection, localId, remoteId ) {
	this._connection = connection;
	this._remoteId = remoteId;
	this._localId = localId;
	this._peerConnection = new RTCPeerConnection( null );
	this._peerConnection.onaddstream = this._onStream.bind( this );
	this._peerConnection.onicecandidate = this._onIceCandidate.bind( this );
	this._peerConnection.oniceconnectionstatechange = this._onIceConnectionStateChange.bind( this );
	this._constraints = { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } };
};

Emitter( WebRtcConnection.prototype );

WebRtcConnection.prototype.initiate = function( stream, metaData ) {
	this._peerConnection.addStream( stream );
	this._peerConnection.createOffer( this._onOfferCreated.bind( this, metaData ), this._onError.bind( this ) );
};

WebRtcConnection.prototype.close = function() {
	this._peerConnection.close();
};

WebRtcConnection.prototype.addStream = function( stream ) {
	this._peerConnection.addStream( stream );
};

WebRtcConnection.prototype.setRemoteDescription = function( remoteDescription ) {
	this._peerConnection.setRemoteDescription( remoteDescription, this._onRemoteDescriptionSuccess.bind( this ), this._onError.bind( this ) );
};

WebRtcConnection.prototype.createAnswer = function() {
	this._peerConnection.createAnswer( this._onAnswerCreated.bind( this ), this._onError.bind( this ), this._constraints );
};

WebRtcConnection.prototype.addIceCandidate = function( iceCandidate ) {
	this._peerConnection.addIceCandidate( iceCandidate, this._onAddIceCandidateSuccess.bind( this ), this._onError.bind( this ) );
};

WebRtcConnection.prototype._onAddIceCandidateSuccess = function() {

};

WebRtcConnection.prototype._onStream = function( event ) {
	this.emit( 'stream', event.stream );
};

WebRtcConnection.prototype._onOfferCreated = function( metaData, offer ) {
	this._sendMsg( C.ACTIONS.WEBRTC_OFFER, JSON.stringify({
		sdp: offer.sdp,
		type: offer.type,
		meta: metaData
	}));
	this._peerConnection.setLocalDescription( 
		offer, 
		this._onLocalDescriptionSuccess.bind( this ),
		this._onError.bind( this ) );
};

WebRtcConnection.prototype._onAnswerCreated = function( answer ) {
	this._sendMsg( C.ACTIONS.WEBRTC_ANSWER, answer.toJSON() );
	this._peerConnection.setLocalDescription( 
		answer, 
		this._onLocalDescriptionSuccess.bind( this ),
		this._onError.bind( this ) );
};	

WebRtcConnection.prototype._sendMsg = function( action, data ) {console.log( 'Sending', C.TOPIC.WEBRTC,
		action,
		[ this._localId, this._remoteId, data ]);
	this._connection.sendMsg( 
		C.TOPIC.WEBRTC,
		action,
		[ this._localId, this._remoteId, data ]
	);
};

WebRtcConnection.prototype._onRemoteDescriptionSuccess = function() {

};

WebRtcConnection.prototype._onIceCandidate = function( event ) {
	if( event.candidate ) {
		this._sendMsg( C.ACTIONS.WEBRTC_ICE_CANDIDATE, event.candidate.toJSON() );
	}
};

/**
 * "new": the ICE agent is gathering addresses or waiting for remote candidates (or both).
 * "checking": the ICE agent has remote candidates, on at least one component, and is check them, though it has not found a connection yet. At the same time, it may still be gathering candidates.
 * "connected": the ICE agent has found a usable connection for each component, but is still testing more remote candidates for a better connection. At the same time, it may still be gathering candidates.
 * "completed": the ICE agent has found a usable connection for each component, and is no more testing remote candidates.
 * "failed": the ICE agent has checked all the remote candidates and didn't find a match for at least one component. Connections may have been found for some components.
 * "disconnected": liveness check has failed for at least one component. This may be a transient state, e. g. on a flaky network, that can recover by itself.
 * "closed": the ICE agent has shutdown and is not answering to requests.
 *
 * @param   {[type]} event [description]
 *
 * @returns {[type]}
 */
WebRtcConnection.prototype._onIceConnectionStateChange = function( event ) {
	//iceConnectionState
	console.log( '_onIceConnectionStateChange', this._peerConnection.iceConnectionState );
};

WebRtcConnection.prototype._onLocalDescriptionSuccess = function() {
	console.log( '_onLocalDescriptionSuccess', arguments );
};

WebRtcConnection.prototype._onError = function( error ) {
	throw error;
};

module.exports = WebRtcConnection;
