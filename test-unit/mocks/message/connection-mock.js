var messageBuilder = require( '../../../src/message/message-builder' );

var ConnectionMock = function() {
	this.lastSendMessage = null;
};

ConnectionMock.prototype.sendMsg = function( topic, action, data ) {
	this.lastSendMessage = messageBuilder.getMsg( topic, action, data );
};

module.exports = ConnectionMock;