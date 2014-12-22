var events = require( 'events' ),
	util = require( 'util' );
	
var SocketMock = function() {
	this.lastSendMessage = null;
	this.isOpen = false;
};

util.inherits( SocketMock, events.EventEmitter );

SocketMock.prototype.setEncoding = function(){};
SocketMock.prototype.setKeepAlive = function(){};
SocketMock.prototype.setNoDelay = function(){};
SocketMock.prototype.destroy = function(){};

SocketMock.prototype.write = function( message ){
	this.lastSendMessage = message;
};

SocketMock.prototype.end = function() {
	this.isOpen = false;	
};

module.exports = SocketMock;