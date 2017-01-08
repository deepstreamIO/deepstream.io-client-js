var C = require( '../constants/constants' ),
	messageParser = require( '../message/message-parser' );

/**
 * This class represents a single remote procedure
 * call made from the client to the server. It's main function
 * is to encapsulate the logic around timeouts and to convert the
 * incoming response data
 *
 * @param {Object}   options  deepstream client config
 * @param {Function} callback the function that will be called once the request is complete or failed
 * @param {Client} client
 *
 * @constructor
 */
var Rpc = function( options, callback, client ) {
	this._options = options;
	this._callback = callback;
	this._client = client;
	this._ackTimeout = setTimeout( this.error.bind( this, C.EVENT.ACK_TIMEOUT ), this._options.rpcAckTimeout );
	this._responseTimeout = setTimeout( this.error.bind( this, C.EVENT.RESPONSE_TIMEOUT ), this._options.rpcResponseTimeout );
};

/**
 * Called once an ack message is received from the server
 *
 * @public
 * @returns {void}
 */
Rpc.prototype.ack = function() {
	clearTimeout( this._ackTimeout );
};

/**
 * Called once a response message is received from the server.
 * Converts the typed data and completes the request
 *
 * @param   {String} data typed value
 *
 * @public
 * @returns {void}
 */
Rpc.prototype.respond = function( data ) {
	var convertedData = messageParser.convertTyped( data, this._client );
	this._callback( null, convertedData );
	this._complete();
};

/**
 * Callback for error messages received from the server. Once
 * an error is received the request is considered completed. Even
 * if a response arrives later on it will be ignored / cause an
 * UNSOLICITED_MESSAGE error
 *
 * @param   {String} errorMsg @TODO should be CODE and message
 *
 * @public
 * @returns {void}
 */
Rpc.prototype.error = function( errorMsg ) {
	this._callback( errorMsg );
	this._complete();
};

/**
 * Called after either an error or a response
 * was received
 *
 * @private
 * @returns {void}
 */
Rpc.prototype._complete = function() {
	clearTimeout( this._ackTimeout );
	clearTimeout( this._responseTimeout );
};

module.exports = Rpc;