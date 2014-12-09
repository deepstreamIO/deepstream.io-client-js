var C = require( '../constants/constants' ),
	RpcResponse = require( './rpc-response' );

var RpcHandler = function( options, connection, client ) {
	this._options = options;
	this._connection = connection;
	this._client = client;
	this._rpcs = {};
	this._providers = {};
};

RpcHandler.prototype.provide = function( name, callback ) {
	if( this._providers[ name ] ) {
		throw new Error( 'rpc ' + name + ' already registered' );
	}

	this._providers[ name ] = callback;
	this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.SUBSCRIBE, [ name ] );
};

RpcHandler.prototype.unprovide = function( name ) {
	if( this._providers[ name ] ) {
		this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.UNSUBSCRIBE, [ name ] );
	}
};

RpcHandler.prototype.make = function( name, data, callback ) {
	var uid = this._client.getUid();
	this._rpcs[ uid ] = callback;
	this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.RPC, [ name, uid, data ] );
};

RpcHandler.prototype._respondToRpc = function( message ) {

};

RpcHandler.prototype._$handle = function( message ) {
	if( message.action === C.ACTIONS.RPC ) {
		this._respondToRpc( message );
	}
};

module.exports = RpcHandler;