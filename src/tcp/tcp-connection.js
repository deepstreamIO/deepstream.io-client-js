var net = require( 'net' ),
	URL = require( 'url' ),
	events = require( 'events' ),
	util = require( 'util' ),
	C = require( '../constants/constants' );

/**
 * An alternative to the engine.io connection for backend processes (or 
 * other clients that speak TCP). Exposes the same interface as the engine.io
 * client
 *
 * @param   {String} url (or short version without protocol, e.g. host:port )
 *
 * @emits error
 * @emits open
 * @emits close
 * @emits message
 * 
 * @constructor
 */
var TcpConnection = function( url ) {
	this._socket = null;
	this._url = url;
	this._messageBuffer = '';
	this._destroyFn = this._destroy.bind( this );
	process.on( 'exit', this._destroyFn );
	this.open();
	this._isOpen = false;
};

util.inherits( TcpConnection, events.EventEmitter );

/**
 * Creates the connection. Can be called multiple times to
 * facilitate reconnecting.
 *
 * @private
 * @returns {void}
 */
TcpConnection.prototype.open = function() {
	this._socket = net.createConnection( this._getOptions() );

	this._socket.setEncoding( 'utf8' );
	this._socket.setKeepAlive( true, 5000 );
	this._socket.setNoDelay( true );

	this._socket.on( 'data', this._onData.bind( this ) );
	this._socket.on( 'error', this._onError.bind( this ) );
	this._socket.on( 'connect', this._onConnect.bind( this ) );
	this._socket.on( 'close', this._onClose.bind( this ) );
};

/**
 * Sends a message over the socket. Sending happens immediatly,
 * conflation takes place on a higher level
 *
 * @param   {String} message
 *
 * @private
 * @returns {void}
 */
TcpConnection.prototype.send = function( message ) {
	if( this._isOpen === true ) {
		this._socket.write( message );
	} else {
		this.emit( 'error', 'attempt to send message on closed socket: ' + message );
	}
};

/**
 * Closes the connection. Please note: messages that
 * are already in-flight might still be received
 * after the socket is closed. The _onData method
 * therefor has an additional check for this.
 *
 * @todo  set flag for deliberateClose
 *
 * @returns {[type]} [description]
 */
TcpConnection.prototype.close = function() {
	this._isOpen = false;
	process.removeListener( 'exit', this._destroyFn );
	this._socket.end();
};

/**
 * Callbacks for errors emitted from the underlying
 * net.Socket
 *
 * @param   {String} error
 *
 * @private
 * @returns {void}
 */
TcpConnection.prototype._onError = function( error ) {
	var msg;
	
	if( error.code === 'ECONNREFUSED' ) {
		msg = 'Can\'t connect! Deepstream server unreachable on ' + this._url;
	} else {
		msg = error.toString();
	}
	
	this.emit( 'error', msg );
};

/**
 * Callbacks for connect events emitted from the underlying
 * net.Socket
 *
 * @private
 * @returns {void}
 */
TcpConnection.prototype._onConnect = function() {
	this._isOpen = true;
	this.emit( 'open' );
};

/**
 * Callbacks for close events emitted from the underlying
 * net.Socket.
 *
 * @todo  check for deliberateClose flag do decide whether to
 * try to reconnect
 *
 * @private
 * @returns {void}
 */
TcpConnection.prototype._onClose = function() {
	this._isOpen = false;
	this.emit( 'close' );
};

/**
 * Callback for messages received on the socket. The socket
 * is set to utf-8 by both the client and the server, so the
 * message parameter should always be a string. Let's make sure that
 * no binary data / buffers get into the message pipeline though.
 * 
 * IMPORTANT: There is no guarantee that this method is invoked for complete
 * messages only. Especially under heavy load, packets are written as quickly
 * as possible. Therefor every message ends with a MESSAGE_SEPERATOR charactor
 * and it is this methods responsibility to buffer and concatenate the messages
 * accordingly
 * 
 * @param   {String} packet
 *
 * @private
 * @returns {void}
 */
TcpConnection.prototype._onData = function( packet ) {
	if( typeof packet !== 'string' ) {
		this.emit( 'error', 'received non-string message from socket' );
		return;
	}

	if( this._isOpen === false ) {
		this.emit( 'error', 'received message on half closed socket: ' + packet );
		return;
	}

	var message;

	// Incomplete message, write to buffer
	if( packet.charAt( packet.length - 1 ) !== C.MESSAGE_SEPERATOR ) {
		this._messageBuffer += packet;
		return;
	}
	
	// Message that completes previously received message
	if( this._messageBuffer.length !== 0 ) {
		message = this._messageBuffer + packet;
		this._messageBuffer = '';

	// Complete message
	} else {
		message = packet;
	}

	this.emit( 'message', message );
};

/**
 * Returns the options for net.Socket, based
 * on the provided URL
 *
 * @todo  - test what happens if URL doesn't have a port
 *
 *
 * @private
 * @returns {Object} options
 */
TcpConnection.prototype._getOptions = function() {
	var parsedUrl = {};
	
	if( this._url.indexOf( '/' ) === -1 ) {
		parsedUrl.hostname = this._url.split( ':' )[ 0 ];
		parsedUrl.port = this._url.split( ':' )[ 1 ];
	} else {
		parsedUrl = URL.parse( this._url );
	}

	return {
		host: parsedUrl.hostname,
		port: parseInt( parsedUrl.port, 10 ),
		allowHalfOpen: false
	};
};

/**
 * Closes the socket as a last resort before the
 * process exits
 *
 * @private
 * @returns {void}
 */
TcpConnection.prototype._destroy = function() {
	this._socket.destroy();
};

module.exports = TcpConnection;
