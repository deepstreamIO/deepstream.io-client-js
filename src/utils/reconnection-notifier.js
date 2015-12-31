var C = require( '../constants/constants' );

var ReconnectionNotifier = function( client, reconnect ) {
	this._client = client;
	this._reconnect = reconnect;

    this._isReconnecting = false;
    this._connectionStateChangeHandler = this._handleConnectionStateChanges.bind( this );
    this._client.on( 'connectionStateChanged', this._connectionStateChangeHandler );
};

ReconnectionNotifier.prototype.destroy = function() {
    this._client.removeListener( 'connectionStateChanged', this._connectionStateChangeHandler );
    this._client = null;
};

 /**
 * Makes sure that all functionality is resubscribed on reconnect. Subscription is called
 * when the connection drops - which seems counterintuitive, but in fact just means
 * that the re-subscription message will be added to the queue of messages that
 * need re-sending as soon as the connection is re-established.
 * 
 * The _isReconnecting flag exists to make sure that the message is only send once per
 * connection loss
 * 
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