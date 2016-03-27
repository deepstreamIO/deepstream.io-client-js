var C = require( '../constants/constants' ),
	ResubscribeNotifier = require( './resubscribe-notifier' );

/**
 * Provides a scaffold for subscriptionless requests to deepstream, such as the SNAPSHOT 
 * and HAS functionality. The SingleNotifier multiplexes all the client requests so 
 * that they can can be notified at once, and also includes reconnection funcionality 
 * incase the connection drops.
 *
 * @param {Client} client          The deepstream client
 * @param {Connection} connection  The deepstream connection
 * @param {String} topic           Constant. One of C.TOPIC
 * @param {String} action          Constant. One of C.ACTIONS
 * @param {Number} timeoutDuration The duration of the timeout in milliseconds
 *
 * @constructor
 */
var SingleNotifier = function( client, connection, topic, action, timeoutDuration ) {
	this._client = client;
	this._connection = connection;
	this._topic = topic;
	this._action = action;
	this._timeoutDuration = timeoutDuration;
	this._requests = {};
	this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._resendRequests.bind( this ) );
};

/**
 * Check if there is a request pending with a specified name
 *
 * @param {String} name An identifier for the request, e.g. a record name
 *
 * @public
 * @returns {void}
 */
SingleNotifier.prototype.hasRequest = function( name ) {		
	return !!this._requests[ name ]; 
};

/**
 * Add a request. If one has already been made it will skip the server request
 * and multiplex the response
 *
 * @param {String} name An identifier for the request, e.g. a record name

 *
 * @public
 * @returns {void}
 */
SingleNotifier.prototype.request = function( name, callback ) {	
	var responseTimeout;

	if( !this._requests[ name ] ) {
		this._requests[ name ] = [];
		this._connection.sendMsg( this._topic, this._action, [ name ] );
	}

	responseTimeout = setTimeout( this._onResponseTimeout.bind( this, name ), this._timeoutDuration );
	this._requests[ name ].push( { timeout: responseTimeout, callback: callback } );
};

/**
 * Process a response for a request. This has quite a flexible API since callback functions
 * differ greatly and helps maximise reuse.
 *
 * @param {String} name An identifier for the request, e.g. a record name
 * @param {String} error Error message
 * @param {Object} data If successful, the response data
 *
 * @public
 * @returns {void}
 */
SingleNotifier.prototype.recieve = function( name, error, data ) {
	var entries = this._requests[ name ];
	for( i=0; i < entries.length; i++ ) {
		entry = entries[ i ];
		clearTimeout( entry.timeout );
		entry.callback( error, data );
	}
	delete this._requests[ name ];
};

/**
 * Will be invoked if a timeout occurs before a response arrives from the server
 *
 * @param {String} name An identifier for the request, e.g. a record name
 *
 * @private
 * @returns {void}
 */
SingleNotifier.prototype._onResponseTimeout = function( name ) {
	var msg = 'No response received in time for ' + this._topic + '|' + this._action + '|' + name;
	this._client._$onError( this._topic, C.EVENT.RESPONSE_TIMEOUT, msg );
};

/**
 * Resends all the requests once the connection is back up
 *
 * @private
 * @returns {void}
 */
SingleNotifier.prototype._resendRequests = function() {
	for( var request in this._requests ) {
		this._connection.sendMsg( this._topic, this._action, [ this._requests[ request ] ] );
	}
};

module.exports = SingleNotifier;