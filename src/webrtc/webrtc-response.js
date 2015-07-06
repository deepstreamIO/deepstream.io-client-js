var Emitter = require( 'component-emitter' );

var WebRtcResponse = function() {
	this.isAccepted = false;
	this.isDeclined = false;
};

Emitter( WebRtcResponse.prototype );

/**
 * Accept the incoming call. This will establish the Webrtc channel.
 * Optionally a localStream can be provided 
 *
 * @param   {[type]} localStream [description]
 *
 * @returns {[type]}
 */
WebRtcResponse.prototype.accept = function( localStream, callEstablishedCallback ) {
	if( this.isAccepted ) {
		throw new Error( 'Incoming call is already accepted' );
	}

	if( this.isDeclined ) {
		throw new Error( 'Can\'t accept incoming call. Call was already declined' );
	}

	this.isAccepted = true;
	
	if( arguments.length === 1 ) {
		localStream = null;
		callEstablishedCallback = arguments[ 0 ];
	}

	this.emit( 'accepted', localStream, callEstablishedCallback );
};

WebRtcResponse.prototype.decline = function( reason ) {
	if( this.isAccepted ) {
		throw new Error( 'Can\'t decline incoming call. Call was already accepted' );
	}

	if( this.isDeclined ) {
		throw new Error( 'Incoming call was already declined' );
	}

	this.isDeclined = true;
	this.emit( 'declined', reason );
};

module.exports = WebRtcResponse;