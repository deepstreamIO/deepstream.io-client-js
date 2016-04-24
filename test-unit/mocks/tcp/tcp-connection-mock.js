var events = require( 'events' ),
	util = require( 'util' );

/**
 * @emit open
 * @emit close
 * @emit error
 * @emit message
 */
var TcpConnectionMock = function( url ) {
	this.url = url;
	this.isOpen = false;
	this.callsToOpen = 0;
	this.lastSendMessage = null;
	this.messages = [];
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

TcpConnectionMock.prototype.open = function() {
	this.callsToOpen++;
};

TcpConnectionMock.prototype.send = function( msg ) {
	this.messages.push( msg );
	this.lastSendMessage = msg;
};

module.exports = TcpConnectionMock;