var C = require( '../constants/constants' ),
	EventEmitter = require( 'component-emitter2' );

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
var AckTimeoutRegistry = function( client, options ) {
	this._options = options;
	this._client = client;
	this._register = {};
};

EventEmitter( AckTimeoutRegistry.prototype );

/**
 * Add an entry
 *
 * @param {String} name An identifier for the subscription, e.g. a record name or an event name.
 *
 * @public
 * @returns {void}
 */
AckTimeoutRegistry.prototype.add = function(timeout) {
	this.remove(timeout);
	this._register[ this._getUniqueName(timeout) ] = setTimeout(
		this._onTimeout.bind(this, timeout),
		timeout.timeout || this._options.subscriptionTimeout
	);
};

/**
 * Remove an entry
 *
 * @param {String} name An identifier for the subscription, e.g. a record name or an event name.
 *
 * @public
 * @returns {void}
 */
AckTimeoutRegistry.prototype.remove = function(timeout) {
	if( this._register[ this._getUniqueName(timeout) ] ) {
		this.clear( {
			topic: timeout.topic,
			data: [ timeout.action, timeout.name ]
		} );
	}
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
	var uniqueName = message.topic + message.data[ 0 ] + (message.data[ 1 ] ? message.data[ 1 ] : '');

	if( this._register[ uniqueName ] ) {
		clearTimeout( this._register[ uniqueName ] );
	} else {
		this._client._$onError( message.topic, C.EVENT.UNSOLICITED_MESSAGE, message.raw );
	}
};

/**
 * Will be invoked if the timeout has occured before the ack message was received
 *
 * @param {Object} name The timeout object registered
 *
 * @private
 * @returns {void}
 */
AckTimeoutRegistry.prototype._onTimeout = function(timeout) {
	delete this._register[ this._getUniqueName(timeout) ];
	var msg = 'No ACK message received in time' + ( timeout.name ? ' for ' + timeout.name : '');
	this._client._$onError( timeout.topic, C.EVENT.ACK_TIMEOUT, msg );
	this.emit( 'timeout', timeout.name );
};

/**
 * Returns a unique name from the timeout
 *
 * @private
 * @returns {void}
 */
AckTimeoutRegistry.prototype._getUniqueName = function(timeout) {
	return timeout.topic + timeout.action + (timeout.name ? timeout.name : '');
};

module.exports = AckTimeoutRegistry;
