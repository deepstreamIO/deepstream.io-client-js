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
var ReconnectionNotifier = function( client, reconnect ) {
	this._client = client;
	this._reconnect = reconnect;

    this._isReconnecting = false;
    this._connectionStateChangeHandler = this._handleConnectionStateChanges.bind( this );
    this._client.on( 'connectionStateChanged', this._connectionStateChangeHandler );
};

/**
 * Call this whenever this functionality is no longer needed to remove links
 * 
 * @returns {void}
 */
ReconnectionNotifier.prototype.destroy = function() {
    this._client.removeListener( 'connectionStateChanged', this._connectionStateChangeHandler );
    this._connectionStateChangeHandler = null;
    this._client = null;
};

 /**
 * Check whenever the connection state changes if it is in reconnecting to resubscribe
 * @private
 * @returns {void}
 */
 ReconnectionNotifier.prototype._handleConnectionStateChanges = function() {
    var state = this._client.getConnectionState();
        
    if( state === C.CONNECTION_STATE.RECONNECTING && this._isReconnecting === false ) {
        this._isReconnecting = true;
        this._reconnect();
    }
    if( state === C.CONNECTION_STATE.OPEN && this._isReconnecting === true ) {
        this._isReconnecting = false;
    }
 };

module.exports = ReconnectionNotifier;