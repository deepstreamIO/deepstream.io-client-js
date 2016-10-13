var events = require( 'events' ),
	util = require( 'util' );

var count=-1;

/**
 * @emit open
 * @emit close
 * @emit error
 * @emit message
 */
var WebsocketMock = function( url ) {
	this.url = url;
	this.isOpen = false;
	this.lastSendMessage = null;
	this.messages = [];
	count++;
};

util.inherits( WebsocketMock, events.EventEmitter );

WebsocketMock.prototype.simulateOpen = function() {
	this.isOpen = true;
	this.emit( 'open' );
};

WebsocketMock.prototype.close = function() {
	this.isOpen = false;
	this.emit( 'close' );
};

WebsocketMock.prototype.getCallsToOpen = function() {
	return count;
};

WebsocketMock.prototype.resetCallsToOpen = function() {
	count=0;
};

WebsocketMock.prototype.send = function( msg ) {
	this.messages.push( msg );
	this.lastSendMessage = msg;
};

module.exports = WebsocketMock;