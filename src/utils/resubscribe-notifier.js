var C = require( '../constants/constants' );

/**
 * Makes sure that all functionality is resubscribed on reconnect. Subscription is called
 * when the connection drops - which seems counterintuitive, but in fact just means
 * that the re-subscription message will be added to the queue of messages that
 * need re-sending as soon as the connection is re-established.
 * 
 * Resubscribe logic should only occur once per connection loss
 *
 * @param {Client} client          The deepstream client
 * @param {Function} reconnect     Function to call to allow resubscribing
 *
 * @constructor
 */
var ResubscribeNotifier = function( client, resubscribe, unsubscribe, triggerNow ) {
	this._client = client;
	this._resubscribe = resubscribe;
	this._unsubscribe = unsubscribe;

	this._isConnecting = triggerNow;
	this._connectionStateChangeHandler = this._handleConnectionStateChanges.bind( this );
	this._client.on( 'connectionStateChanged', this._connectionStateChangeHandler );

	this._handleConnectionStateChanges();
};

/**
 * Call this whenever this functionality is no longer needed to remove links
 * 
 * @returns {void}
 */
ResubscribeNotifier.prototype.destroy = function() {
	this._client.removeListener( 'connectionStateChanged', this._connectionStateChangeHandler );
	this._connectionStateChangeHandler = null;
	this._client = null;
};

 /**
 * Check whenever the connection state changes if it is in reconnecting to resubscribe
 * @private
 * @returns {void}
 */
 ResubscribeNotifier.prototype._handleConnectionStateChanges = function() {
	var isConnecting = this._client.getConnectionState() !== C.CONNECTION_STATE.OPEN;
	if( this._resubscribe && isConnecting === false && this._isConnecting === true ) {
		this._resubscribe();
	}
	else if ( this._unsubscribe && isConnecting === true && this._isConnecting === false ) {
		this._unsubscribe();
	}
	this._isConnecting = isConnecting;
 };

module.exports = ResubscribeNotifier;