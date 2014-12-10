var C = require( './constants/constants' ),
	Emitter = require( 'component-emitter' ),
	Connection = require( './message/connection' ),
	EventHandler = require( './event/event-handler' ),
	RpcHandler = require( './rpc/rpc-handler' );
	
/**
 *
 * recordPersistDefault (Boolean): Whether records should be persisted by default. Overwritten by getRecord flag
 * agent (http.Agent): http.Agent to use, defaults to false (NodeJS only)
 * upgrade (Boolean): defaults to true, whether the client should try to upgrade the transport from long-polling to something better.
 * forceJSONP (Boolean): forces JSONP for polling transport.
 * jsonp (Boolean): determines whether to use JSONP when necessary for polling. If disabled (by settings to false) an error will be emitted (saying "No transports available") if no other transports are available. If another transport is available for opening a connection (e.g. WebSocket) that transport will be used instead.
 * forceBase64 (Boolean): forces base 64 encoding for polling transport even when XHR2 responseType is available and WebSocket even if the used standard supports binary.
 * enablesXDR (Boolean): enables XDomainRequest for IE8 to avoid loading bar flashing with click sound. default to false because XDomainRequest has a flaw of not sending cookie.
 * timestampRequests (Boolean): whether to add the timestamp with each transport request. Note: this is ignored if the browser is IE or Android, in which case requests are always stamped (false)
 * timestampParam (String): timestamp parameter (t)
 * policyPort (Number): port the policy server listens on (843)
 * path (String): path to connect to, default is /engine.io
 * transports (Array): a list of transports to try (in order). Defaults to ['polling', 'websocket']. Engine always attempts to connect directly with the first one, provided the feature detection test for it passes.
 * rememberUpgrade (Boolean): defaults to false. If true and if the previous websocket connection to the server succeeded, the connection attempt will bypass the normal upgrade process and will initially try websocket. A connection attempt following a transport error will use the normal upgrade process. It is recommended you turn this on only when using SSL/TLS connections, or if you know that your network does not block websockets.
 */
var Client = function( url, options ) {
	this._url = url;
	this._options = options || {};

	this._connection = new Connection( this, this._url, this._options );

	this._messageCallbacks = {};

	this.event = new EventHandler( this._options, this._connection );
	this.rpc = new RpcHandler( this._options, this._connection, this );

	this._messageCallbacks[ C.TOPIC.EVENT ] = this.event._$handle.bind( this.event );
	this._messageCallbacks[ C.TOPIC.RPC ] = this.rpc._$handle.bind( this.rpc );
	this._messageCallbacks[ C.TOPIC.ERROR ] = this._$onError;
};

Emitter( Client.prototype );

Client.prototype.login = function( authParams, callback ) {
	this._connection.authenticate( authParams, callback );
	return this;
};

Client.prototype.close = function() {
	this._connection.close();
};

Client.prototype.getConnectionState = function() {
	return this._connection.getState();
};

Client.prototype.onRecordSubscription = function( pattern, callback ) {

};

Client.prototype.getRecord = function( name, persist ) {

};

Client.prototype.getList = function( name, persist ) {

};

Client.prototype.getAnonymousRecord = function() {

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
	var f = function() {
		return (Math.random() * 10000000000000000).toString(36).replace( '.', '' );
	};
	
	return (new Date()).getTime().toString(36) + '-' + f() + '-' + f();
};

Client.prototype._$onMessage = function( message ) {
	if( this._messageCallbacks[ message.topic ] ) {
		this._messageCallbacks[ message.topic ]( message );
	} else {
		this._$onError( message.topic, message.action, 'received message for unknown topic ' + message.topic );
	}

	if( message.action === C.ACTIONS.ERROR && !message.processedError ) {
		this._$onError( message.topic, message.action, message.data[ 0 ] );
	}
};

Client.prototype._$onError = function( topic, event, msg ) {
	if( this.hasListeners( 'error' ) ) {
		this.emit( 'error', msg, event, topic );
		this.emit( event, topic, msg );
	} else {
		console.log( '--- You can catch all deepstream errors by subscribing to the error event ---' );
		
		var errorMsg = event + ': ' + msg;
		
		if( topic ) {
			errorMsg += ' (' + topic + ')';
		}

		throw new Error( errorMsg );
	}
};

module.exports = function( url, options ) {
	return new Client( url, options );
};