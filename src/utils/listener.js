var C = require( '../constants/constants' );

var Listener = function( type, pattern, callback, options, client, connection ) {
    this._type = type;
    this._callback = callback;
    this._pattern = pattern;
    this._options = options;
    this._client = client;
    this._connection = connection;
    this._ackTimeout = setTimeout( this._onAckTimeout.bind( this ), this._options.subscriptionTimeout );
    this._connection.sendMsg( this._type, C.ACTIONS.LISTEN, [ this._pattern ] );
};

Listener.prototype.destroy = function() {
    this._connection.sendMsg( this._type, C.ACTIONS.UNLISTEN, [ this._pattern ] );
    this._callback = null;
    this._pattern = null;
    this._client = null;
    this._connection = null;
};

Listener.prototype._$onMessage = function( message ) {
    if( message.action === C.ACTIONS.ACK ) {
        clearTimeout( this._ackTimeout );
    } else {
        var isFound = message.action === C.ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND;
        this._callback( message.data[ 1 ], isFound );
    }
};

Listener.prototype._onAckTimeout = function() {
    this._client._$onError( this._type, C.EVENT.ACK_TIMEOUT, 'Listening to pattern ' + this._pattern );
};

module.exports = Listener;