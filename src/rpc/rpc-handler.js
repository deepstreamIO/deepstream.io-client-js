var C = require( '../constants/constants' ),
	RpcResponse = require( './rpc-response' ),
	messageParser = require( './message/message-parser' ),
	messageBuilder = require( '../message/message-builder' );

/**
 * The main class for remote procedure calls
 * 
 * Provides the rpc interface and handles incoming messages
 * on the rpc topic
 * 
 * @param {Object} options deepstream configuration options
 * @param {Connection} connection
 * @param {Client} client
 * 
 * @constructor
 * @public
 */
var RpcHandler = function( options, connection, client ) {
	this._options = options;
	this._connection = connection;
	this._client = client;
	this._rpcs = {};
	this._providers = {};
};

/**
 * Registers a callback function as a RPC provider. If another connected client calls
 * client.rpc.make() the request will be routed to this method
 * 
 * The callback will be invoked with two arguments:
 * 
 * {Mixed} data The data passed to the client.rpc.make function
 * {RpcResponse} rpcResponse An object with methods to respons, acknowledge or reject the request
 * 
 * Please note: Deepstream tries to deliver data in its original format. Data passed to client.rpc.make as a String will arrive as a String,
 * numbers or implicitly JSON serialized objects will arrive in their respective format as well
 * 
 * @public
 * @returns void
 */
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
	var uid = this._client.getUid(),
		typedData = messageBuilder.typed( data );
		
	this._rpcs[ uid ] = callback;
	this._connection.sendMsg( C.TOPIC.RPC, C.ACTIONS.REQUEST, [ name, uid, typedData ] );
};

RpcHandler.prototype._respondToRpc = function( message ) {
	var name = message.data[ 0 ],
		correlationId = message.data[ 1 ],
		data =  message.data[ 2 ] ? messageParser.convertTyped( message.data[ 2 ] ) : null,
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

RpcHandler.prototype._handleError = function( errorMsg ) {
	var correlationId = errorMsg.data[ 2 ],
		rpcName = errorMsg.data[ 1 ],
		errorName = errorMsg.data[ 0 ];

	if( !this._rpcs[ correlationId ] ) {
		return; //TODO - this should never happen - investigate if it does
	}

	this._rpcs[ correlationId ]( errorName, errorName );
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
	else if( message.action === C.ACTIONS.ERROR ) {
		message.processedError = true;
		this._handleError( message );
	}
};

module.exports = RpcHandler;