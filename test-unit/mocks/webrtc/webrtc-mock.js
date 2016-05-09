var PeerConnectionMock = function() {
	this.onaddstream = null;
	this.onicecandidate = null;
	this.oniceconnectionstatechange = null;
	this.addStream = jasmine.createSpy( 'peerConnection.addStream' );
	this.close = jasmine.createSpy( 'peerConnection.close' );
	this.setLocalDescription = jasmine.createSpy( 'peerConnection.setLocalDescription' );
	this.setRemoteDescription = jasmine.createSpy( 'peerConnection.setRemoteDescription' );
	this.addIceCandidate = jasmine.createSpy( 'peerConnection.addIceCandidate' );
};

PeerConnectionMock.prototype.createOffer = function( successCb, errorCb ) {
	setTimeout(function(){
		successCb({
			sdp: 'offer sdp',
			type: 'offer type'
		});
	}.bind( this ), 20 );
};

PeerConnectionMock.prototype.createAnswer = function( successCb, errorCb, description ) {
	setTimeout(function(){
		successCb({ toJSON: function(){
			return JSON.stringify({
				sdp: 'answer sdp',
				type: 'answer type'
			});
		}});
	}.bind( this ), 20 );
};


PeerConnectionMock.prototype.simulateOutgoingIceCandidate = function( id ) {
	this.onicecandidate({
		candidate: {
			toJSON: function(){
				return JSON.stringify({ icecandidate: id });
			}
		}
	});
};

exports.on = function() {
	global.RTCPeerConnection = PeerConnectionMock;
	global.RTCSessionDescription = function(){};
	global.RTCIceCandidate = function( candidate ){
		this.candidate = candidate;
	};
};

exports.off = function() {
	delete global.RTCPeerConnection;
	delete global.RTCSessionDescription;
	delete global.RTCIceCandidate;
};