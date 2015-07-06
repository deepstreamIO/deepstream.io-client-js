var WebRtcCall = function( webRtcConnection ) {
	this._webRtcConnection = webRtcConnection;
};

WebRtcCall.prototype.end = function() {
	this._webRtcConnection.close();
};

module.exports = WebRtcCall;