var WebRtcResponse = function() {

};

/**
 * Accept the incoming call. This will establish the Webrtc channel.
 * Optionally a localStream can be provided 
 *
 * @param   {[type]} localStream [description]
 *
 * @returns {[type]}
 */
WebRtcResponse.prototype.accept = function( localStream ) {

};

WebRtcResponse.prototype.decline = function( reason ) {

};

module.exports = WebRtcResponse;