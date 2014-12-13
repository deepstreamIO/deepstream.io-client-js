var Emitter = require( 'component-emitter' );

var ClientMock = function() {

};

Emitter( ClientMock.prototype );

ClientMock.prototype._$onError = function( topic, event, msg ) {

};

ClientMock.prototype._$onMessage = function( msg ) {

};

module.exports = ClientMock;