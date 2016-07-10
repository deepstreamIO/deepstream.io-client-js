var C = require( './constants/constants' ),
	MS = require( './constants/merge-strategies' ),
	Emitter = require( 'component-emitter' ),
	Connection = require( './message/connection' ),
	EventHandler = require( './event/event-handler' ),
	RpcHandler = require( './rpc/rpc-handler' ),
	RecordHandler = require( './record/record-handler' ),
	WebRtcHandler = require( './webrtc/webrtc-handler' ),
	defaultOptions = require( './default-options' );

/**
 * deepstream.io javascript client - works in
 * node.js and browsers (using engine.io)
 *
 * @copyright 2016 deepstreamHub GmbH
 * @author deepstreamHub GmbH
 *
 *
 * @{@link http://deepstream.io}
 *
 *
 * @param {String} url     URL to connect to. The protocoll can be ommited, e.g. <host>:<port>. Use TCP URL for node.js
 * @param {Object} options A map of options that extend the ones specified in default-options.js
 *
 * @public
 * @constructor
 */
var Client = function( url, options ) {
	this._url = url;
	this._options = this._getOptions( options || {} );

	this._connection = new Connection( this, this._url, this._options );

	this.event = new EventHandler( this._options, this._connection, this );
	this.rpc = new RpcHandler( this._options, this._connection, this );
	this.record = new RecordHandler( this._options, this._connection, this );
	this.webrtc = new WebRtcHandler( this._options, this._connection, this );

	this._messageCallbacks = {};
	this._messageCallbacks[ C.TOPIC.WEBRTC ] = this.webrtc._$handle.bind( this.webrtc );
	this._messageCallbacks[ C.TOPIC.EVENT ] = this.event._$handle.bind( this.event );
	this._messageCallbacks[ C.TOPIC.RPC ] = this.rpc._$handle.bind( this.rpc );
	this._messageCallbacks[ C.TOPIC.RECORD ] = this.record._$handle.bind( this.record );
	this._messageCallbacks[ C.TOPIC.ERROR ] = this._onErrorMessage.bind( this );
};

Emitter( Client.prototype );

/**
 * Send authentication parameters to the client to fully open
 * the connection.
 *
 * Please note: Authentication parameters are send over an already established
 * connection, rather than appended to the server URL. This means the parameters
 * will be encrypted when used with a WSS / HTTPS connection. If the deepstream server
 * on the other side has message logging enabled it will however be written to the logs in
 * plain text. If additional security is a requirement it might therefor make sense to hash
 * the password on the client.
 *
 * If the connection is not yet established the authentication parameter will be
 * stored and send once it becomes available
 *
 * authParams can be any JSON serializable data structure and its up for the
 * permission handler on the server to make sense of them, although something
 * like { username: 'someName', password: 'somePass' } will probably make the most sense.
 *
 * login can be called multiple times until either the connection is authenticated or
 * forcefully closed by the server since its maxAuthAttempts threshold has been exceeded
 *
 * @param   {Object}   authParams JSON.serializable authentication data
 * @param   {Function} callback   Will be called with either (true) or (false, data)
 *
 * @public
 * @returns {Client}
 */
Client.prototype.login = function( authParams, callback ) {
	this._connection.authenticate( authParams || {}, callback );
	return this;
};

/**
 * Closes the connection to the server.
 *
 * @public
 * @returns {void}
 */
Client.prototype.close = function() {
	this._connection.close();
};

/**
 * Returns the current state of the connection.
 *
 * connectionState is one of CONSTANTS.CONNECTION_STATE
 *
 * @returns {[type]} [description]
 */
Client.prototype.getConnectionState = function() {
	return this._connection.getState();
};

/**
 * Returns a random string. The first block of characters
 * is a timestamp, in order to allow databases to optimize for semi-
 * sequentuel numberings
 *
 * @public
 * @returns {String} unique id
 */
Client.prototype.getUid = function() {
	var timestamp = (new Date()).getTime().toString(36),
		randomString = (Math.random() * 10000000000000000).toString(36).replace( '.', '' );

	return timestamp + '-' + randomString;
};

/**
 * Package private callback for parsed incoming messages. Will be invoked
 * by the connection class
 *
 * @param   {Object} message parsed deepstream message
 *
 * @package private
 * @returns {void}
 */
Client.prototype._$onMessage = function( message ) {
	if( this._messageCallbacks[ message.topic ] ) {
		this._messageCallbacks[ message.topic ]( message );
	} else {
		message.processedError = true;
		this._$onError( message.topic, C.EVENT.MESSAGE_PARSE_ERROR, 'Received message for unknown topic ' + message.topic );
	}

	if( message.action === C.ACTIONS.ERROR && !message.processedError ) {
		this._$onError( message.topic, message.data[ 0 ],  message.data.slice( 0 ) );
	}
};

/**
 * Package private error callback. This is the single point at which
 * errors are thrown in the client. (Well... that's the intention anyways)
 *
 * The expectations would be for implementations to subscribe
 * to the client's error event to prevent errors from being thrown
 * and then decide based on the event and topic parameters how
 * to handle the errors
 *
 * IMPORTANT: Errors that are specific to a request, e.g. a RPC
 * timing out or a record not being permissioned are passed directly
 * to the method that requested them
 *
 * @param   {String} topic One of CONSTANTS.TOPIC
 * @param   {String} event One of CONSTANTS.EVENT
 * @param   {String} msg   Error dependent message
 *
 * @package private
 * @returns {void}
 */
Client.prototype._$onError = function( topic, event, msg ) {
	var errorMsg;

	/*
	 * Help to diagnose the problem quicker by checking for
	 * some common problems
	 */
	if( event === C.EVENT.ACK_TIMEOUT || event === C.EVENT.RESPONSE_TIMEOUT ) {
		if( this.getConnectionState() === C.CONNECTION_STATE.AWAITING_AUTHENTICATION ) {
			errorMsg = 'Your message timed out because you\'re not authenticated. Have you called login()?';
			setTimeout( this._$onError.bind( this, C.EVENT.NOT_AUTHENTICATED, C.TOPIC.ERROR, errorMsg ), 1 );
		}
	}

	if( this.hasListeners( 'error' ) ) {
		this.emit( 'error', msg, event, topic );
		this.emit( event, topic, msg );
	} else {
		console.log( '--- You can catch all deepstream errors by subscribing to the error event ---' );

		errorMsg = event + ': ' + msg;

		if( topic ) {
			errorMsg += ' (' + topic + ')';
		}

		throw new Error( errorMsg );
	}
};

/**
 * Passes generic messages from the error topic
 * to the _$onError handler
 *
 * @param {Object} errorMessage parsed deepstream error message
 *
 * @private
 * @returns {void}
 */
Client.prototype._onErrorMessage = function( errorMessage ) {
	this._$onError( errorMessage.topic, errorMessage.data[ 0 ], errorMessage.data[ 1 ] );
};

/**
 * Creates a new options map by extending default
 * options with the passed in options
 *
 * @param   {Object} options The user specified client configuration options
 *
 * @private
 * @returns {Object}	merged options
 */
Client.prototype._getOptions = function( options ) {
	var mergedOptions = {},
		key;

	for( key in defaultOptions ) {
		if( typeof options[ key ] === 'undefined' ) {
			mergedOptions[ key ] = defaultOptions[ key ];
		} else {
			mergedOptions[ key ] = options[ key ];
		}
	}

	return mergedOptions;
};

/**
 * Exports factory function to adjust to the current JS style of
 * disliking 'new' :-)
 *
 * @param {String} url     URL to connect to. The protocoll can be ommited, e.g. <host>:<port>. Use TCP URL for node.js
 * @param {Object} options A map of options that extend the ones specified in default-options.js
 *
 * @public
 * @returns {void}
 */
function createDeepstream( url, options ) {
	return new Client( url, options );
}

/**
 * Expose constants to allow consumers to access them
*/
Client.prototype.CONSTANTS = C;
createDeepstream.CONSTANTS = C;

/**
 * Expose merge strategies to allow consumers to access them
*/
Client.prototype.MERGE_STRATEGIES = MS;
createDeepstream.MERGE_STRATEGIES = MS;

module.exports = createDeepstream;
