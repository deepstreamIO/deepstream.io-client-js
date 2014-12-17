var C = require( '../constants/constants' ),
	messageParser = require( '../message/message-parser' );

var Rpc = function( options, callback ) {
	this._options = options;
	this._callback = callback;
	this._ackTimeout = setTimeout( this.error.bind( this, C.EVENT.ACK_TIMEOUT ), this._options.rpcAckTimeout );
	this._responseTimeout = setTimeout( this.error.bind( this, C.EVENT.RESPONSE_TIMEOUT ), this._options.rpcResponseTimeout );
};

Rpc.prototype.ack = function() {
	clearTimeout( this._ackTimeout );
};

Rpc.prototype.respond = function( data ) {
	var convertedData = messageParser.convertTyped( data );
	this._callback( null, convertedData );
	this._complete();
};

Rpc.prototype.error = function( errorMsg ) {
	this._callback( errorMsg );
	this._complete();
};

Rpc.prototype._complete = function() {
	clearTimeout( this._ackTimeout );
	clearTimeout( this._responseTimeout );
};

module.exports = Rpc;