var C = require( '../constants/constants' );

var RpcResponse = function( connection, name, correlationId ) {
	this._connection = connection;
	this._name = name;
	this._correlationId = correlationId;
	this._isAcknowledged = false;
	this._isComplete = false;
	this.autoAck = true;
	setTimeout( this._performAutoAck.bind( this ), 0 );
};

RpcResponse.prototype.ack = function() {
	if( this._isAcknowledged === false ) {
		this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.ACK, [ this._name, this._correlationId ] );
		this._isAcknowledged = true;
	}
};

RpcResponse.prototype.reject = function() {
	
};

RpcResponse.prototype.send = function( data ) {
	if( this._isComplete === true ) {
		throw new Error( 'Rpc ' + this._name + ' already completed' );
	}
	
	this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.RESPONSE, [ this._name, this._correlationId, data ] );
	this._isComplete = true;
};

RpcResponse.prototype._performAutoAck = function() {
	if( this.autoAck === true ) {
		this.ack();
	}
};

module.exports = RpcResponse;