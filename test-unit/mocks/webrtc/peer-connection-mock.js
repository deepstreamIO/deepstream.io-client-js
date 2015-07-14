var PeerConnectionMock = function() {
	this.onaddstream = null;
	this.onicecandidate = null;
	this.oniceconnectionstatechange = null;
	this.addStream = jasmine.createSpy( 'peerConnection.addStream' );
	this.close = jasmine.createSpy( 'peerConnection.close' );
	this.createOffer = jasmine.createSpy( 'peerConnection.createOffer' );
	this.setLocalDescription = jasmine.createSpy( 'peerConnection.setLocalDescription' );
	this.setRemoteDescription = jasmine.createSpy( 'peerConnection.setRemoteDescription' );
	this.createAnswer = jasmine.createSpy( 'peerConnection.createAnswer' );
	this.addIceCandidate = jasmine.createSpy( 'peerConnection.addIceCandidate' );
};

module.exports = PeerConnectionMock;