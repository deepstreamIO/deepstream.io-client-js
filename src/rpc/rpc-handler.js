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
	this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.REQUEST, [ name, uid, data ] );
};

RpcHandler.prototype._respondToRpc = function( message ) {
	var name = message.data[ 0 ],
		correlationId = message.data[ 1 ],
		data =  message.data[ 2 ] || null,
		response;
		
	if( this._providers[ name ] ) {
		response = new RpcResponse( this._connection,name, correlationId );
		this._providers[ name ]( data, response );
	} else {
		this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.REJECTION, [ name, correlationId ] );
	}
};

RpcHandler.prototype._handleResponse = function( message ) {
	var correlationId = message.data[ 1 ];
	
	if( !this._rpcs[ correlationId ] ) {
		return; //TODO - this should never happen - investigate if it does
	}
	
	this._rpcs[ correlationId ]( null, message.data[ 2 ] );
	delete this._rpcs[ correlationId ];
};

RpcHandler.prototype._$handle = function( message ) {
	if( message.action === C.ACTIONS.REQUEST ) {
		this._respondToRpc( message );
	}
	else if( message.action === C.ACTIONS.ACK ) {
		//TODO
	}
	else if( message.action === C.ACTIONS.RESPONSE ) {
		this._handleResponse( message );
	}
};

module.exports = RpcHandler;