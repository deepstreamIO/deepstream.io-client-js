var events = require( 'events' ),
	util = require( 'util' );

/**
 * @emit open
 * @emit close
 * @emit error
 * @emit message
 */
var TcpConnectionMock = function() {
	this.isOpen = false;
	this.lastSendMessage = null;
};

util.inherits( TcpConnectionMock, events.EventEmitter );

TcpConnectionMock.prototype.simulateOpen = function() {
	this.isOpen = true;
	this.emit( 'open' );
};

TcpConnectionMock.prototype.close = function() {
	this.isOpen = false;
	this.emit( 'close' );
};

TcpConnectionMock.prototype.send = function( msg ) {
	this.lastSendMessage = msg;
};

module.exports = TcpConnectionMock;