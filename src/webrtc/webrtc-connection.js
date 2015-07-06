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

WebRtcConnection.prototype.initiate = function( stream ) {
	this._peerConnection.addStream( stream );
	this._peerConnection.createOffer( this._onOfferCreated.bind( this ), this._onError.bind( this ) );
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

WebRtcConnection.prototype._onOfferCreated = function( offer ) {
	this._sendMsg( C.ACTIONS.WEBRTC_OFFER, offer.toJSON() );
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

WebRtcConnection.prototype._sendMsg = function( action, data ) {
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

WebRtcConnection.prototype._onIceConnectionStateChange = function( event ) {
	console.log( '_onIceConnectionStateChange', event );
};

WebRtcConnection.prototype._onLocalDescriptionSuccess = function() {
	console.log( '_onLocalDescriptionSuccess', arguments );
};

WebRtcConnection.prototype._onError = function( error ) {
	throw error;
};

module.exports = WebRtcConnection;
