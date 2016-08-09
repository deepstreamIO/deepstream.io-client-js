var C = require( '../constants/constants' );
var ResubscribeNotifier = require( './resubscribe-notifier' );

var Listener = function( type, pattern, callback, options, client, connection ) {
    this._type = type;
    this._callback = callback;
    this._pattern = pattern;
    this._options = options;
    this._client = client;
    this._connection = connection;
    this._ackTimeout = setTimeout( this._onAckTimeout.bind( this ), this._options.subscriptionTimeout );
    this._resubscribeNotifier = new ResubscribeNotifier( client, this._sendListen.bind( this ) );
    this._sendListen();
    this._responded = null;
};

Listener.prototype.destroy = function() {
    this._connection.sendMsg( this._type, C.ACTIONS.UNLISTEN, [ this._pattern ] );
    this._resubscribeNotifier.destroy();
    this._callback = null;
    this._pattern = null;
    this._client = null;
    this._connection = null;
};

Listener.prototype.accept = function( name ) {
    this._connection.sendMsg( this._type, C.ACTIONS.LISTEN_ACCEPT, [ this._pattern, name ] );
    this._responded = true;
}

Listener.prototype.reject = function( name ) {
    this._connection.sendMsg( this._type, C.ACTIONS.LISTEN_REJECT, [ this._pattern, name ] );
    this._responded = true;
}

Listener.prototype.createCallbackResponse = function(message) {
    return {
        accept: this.accept.bind( this, message.data[ 1 ] ),
        reject: this.reject.bind( this, message.data[ 1 ] )
    }
}

Listener.prototype._$onMessage = function( message ) {
    if( message.action === C.ACTIONS.ACK ) {
        clearTimeout( this._ackTimeout );
    } else if ( message.action === C.ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND ) {
        this._callback( message.data[ 1 ], true, this.createCallbackResponse( message) );
    } else if ( message.action === C.ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED ) {
        this._callback( message.data[ 1 ], false, this.createCallbackResponse( message ) );
    } else {
        this._client._$onError( _type, C.EVENT.UNSOLICITED_MESSAGE, name.data[ 1 ] );
    }

    if( message.action === C.ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND && this._responded !== true ) {
        var deprecatedMessage = 'DEPRECATED: listen should explicitly accept or reject for pattern: ' + message.data[ 0 ];
        deprecatedMessage += '\nhttp://https://github.com/deepstreamIO/deepstream.io-client-js/issues/PLACEHOLDER';
        console.warn( deprecatedMessage );
    }
};

Listener.prototype._sendListen = function() {
    this._connection.sendMsg( this._type, C.ACTIONS.LISTEN, [ this._pattern ] );
};

Listener.prototype._onAckTimeout = function() {
    this._client._$onError( this._type, C.EVENT.ACK_TIMEOUT, 'No ACK message received in time for ' + this._pattern );
};

module.exports = Listener;
