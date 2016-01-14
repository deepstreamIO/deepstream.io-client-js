var C = require( '../constants/constants' ),
	EventEmitter = require( 'component-emitter' );

/**
 * Subscriptions to events are in a pending state until deepstream acknowledges
 * them. This is a pattern that's used by numerour classes. This registry aims
 * to centralise the functionality necessary to keep track of subscriptions and
 * their respective timeouts.
 *
 * @param {Client} client          The deepstream client
 * @param {String} topic           Constant. One of C.TOPIC
 * @param {Number} timeoutDuration The duration of the timeout in milliseconds
 *
 * @extends {EventEmitter}
 * @constructor
 */
var AckTimeoutRegistry = function( client, topic, timeoutDuration ) {
	this._client = client;
	this._topic = topic;
	this._timeoutDuration = timeoutDuration;
	this._register = {};
};

EventEmitter( AckTimeoutRegistry.prototype );

/**
 * Add an entry
 *
 * @param {String} name An identifier for the subscription, e.g. a record name, an event name,
 *                      the name of a webrtc callee etc.
 *
 * @public
 * @returns {void}
 */
AckTimeoutRegistry.prototype.add = function( name, action ) {
	var uniqueName = action ? action + name : name;
	
	if( this._register[ uniqueName ] ) {
		this.clear( {
			data: [ action, name ]
		} );
	}

	this._register[ uniqueName ] = setTimeout( this._onTimeout.bind( this, uniqueName, name ), this._timeoutDuration );
};

/**
 * Processes an incoming ACK-message and removes the corresponding subscription
 *
 * @param   {Object} message A parsed deepstream ACK message
 *
 * @public
 * @returns {void}
 */
AckTimeoutRegistry.prototype.clear = function( message ) {
	var name = message.data[ 1 ];
	var uniqueName = message.data[ 0 ] + name;
	var timeout =  this._register[ uniqueName ] || this._register[ name ];

	if( timeout ) {
		clearTimeout( timeout );
	} else {
		this._client._$onError( this._topic, C.EVENT.UNSOLICITED_MESSAGE, message.raw );
	}
};

/**
 * Will be invoked if the timeout has occured before the ack message was received
 *
 * @param {String} name An identifier for the subscription, e.g. a record name, an event name,
 *                      the name of a webrtc callee etc.
 *
 * @private
 * @returns {void}
 */
AckTimeoutRegistry.prototype._onTimeout = function( uniqueName, name ) {
	delete this._register[ uniqueName ];
	var msg = 'No ACK message received in time for ' + name;
	this._client._$onError( this._topic, C.EVENT.ACK_TIMEOUT, msg );
	this.emit( 'timeout', name );
};

module.exports = AckTimeoutRegistry;