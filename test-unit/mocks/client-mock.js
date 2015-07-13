var Emitter = require( 'component-emitter' );

var ClientMock = function() {
	this.uid = 1;
	this.lastError = null;
};

Emitter( ClientMock.prototype );

ClientMock.prototype.getUid = function(){
	return this.uid.toString();
};

ClientMock.prototype._$onError = function( topic, event, msg ) {
	this.lastError = [ topic, event, msg ];
};

ClientMock.prototype._$onMessage = function( msg ) {

};

module.exports = ClientMock;