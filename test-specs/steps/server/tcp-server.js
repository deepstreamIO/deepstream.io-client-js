var net = require('net');
var config = require( '../config' );

function TCPServer( tcpPort ) {
	this.server;
	this.isReady = false;
	this.lastSocket;
	this.connections = [];

	this.allMessages = [];
	this.lastMessage = null;

	this.tcpPort = tcpPort || config.testServerPort;
}

TCPServer.prototype.start = function() {
	if( this.server ) {
		this.stop( this.start.bind( this ) );
	} else { 
		this.start();
	}
};

TCPServer.prototype.stop = function( callback ) {
	this.stop( callback );
}

TCPServer.prototype.send = function( message ) {
	this.lastSocket.write( message );
};

TCPServer.prototype.whenReady = function( callback ) {
	if( !this.server ) {
		this.start();
	}

	if( this.isReady ) {
		callback();
	} else {
		this.server.once( 'listening', callback );
	}
};

TCPServer.prototype.start = function() {
	this.server = net.createServer();
	this.server.on( 'connection', this.bindSocket.bind( this ) );
	this.server.on( 'listening', this.onListening.bind( this ) );
	this.server.listen( this.tcpPort, config.testServerHost );
}

TCPServer.prototype.stop = function( callback ) {
	this.isReady = false;

	this.allMessages = [];
	this.lastMessage = null;

	this.connections.forEach( function( connection ) {
		connection.end();
	} );
	this.server.close( callback );
	this.server = null;
}

TCPServer.prototype.bindSocket = function( socket ) {
	this.lastSocket = socket;
	socket.setEncoding( 'utf8' );
	socket.on( 'data', this.onIncomingMessage.bind( this ) );
	socket.on( 'close', this.onDisconnect.bind( this, socket ) );
	this.connections.push( socket );
}

TCPServer.prototype.onDisconnect = function( socket ) {
	this.connections.splice( this.connections.indexOf( socket ), 1);
}

TCPServer.prototype.onIncomingMessage = function( message ) {
	var messages = message.split( String.fromCharCode( 30 ) );
	if( !messages[ messages.length - 1 ] ) {
		messages.splice( messages.length - 1, 1 );
	}
	for( var i=0; i<messages.length; i++) {
		this.allMessages.push( messages[ i ] + String.fromCharCode( 30 ) );
	}
	this.lastMessage = messages[ messages.length - 1 ] + String.fromCharCode( 30 );
}

TCPServer.prototype.onListening = function() {
	this.isReady = true;
}

module.exports = TCPServer;