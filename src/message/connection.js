var engineIoClient = require( 'engine.io-client' ),
	messageParser = require( './message-parser' ),
	messageBuilder = require( './message-builder' ),
	TcpConnection = require( '../tcp/tcp-connection' ),
	utils = require( '../utils/utils' ),
	C = require( '../constants/constants' );

/**
 * Establishes a connection to a deepstream server, either
 * using TCP in node or engine.io in the browser.
 *
 * @param {Client} client
 * @param {String} url     Short url, e.g. <host>:<port>. Deepstream works out the protocol
 * @param {Object} options connection options
 *
 * @constructor
 */
var Connection = function( client, url, options ) {
	this._client = client;
	this._url = url;
	this._options = options;
	this._authParams = null;
	this._authCallback = null;
	this._deliberateClose = false;
	this._queuedMessages = [];
	this._reconnectTimeout = null;
	this._reconnectionAttempt = 0;
	this._currentPacketMessageCount = 0;
	this._sendNextPacketTimeout = null;
	this._currentMessageResetTimeout = null;

	this._state = C.CONNECTION_STATE.CLOSED;

	if( utils.isNode() ) {
		this._endpoint = new TcpConnection( url );
	} else {
		this._endpoint = engineIoClient( url, options );
	}

	this._endpoint.on( 'open', this._onOpen.bind( this ) );
	this._endpoint.on( 'error', this._onError.bind( this ) );
	this._endpoint.on( 'close', this._onClose.bind( this ) );
	this._endpoint.on( 'message', this._onMessage.bind( this ) );
};

/**
 * Returns the current connection state.
 * (One of constants.CONNECTION_STATE) 
 *
 * @public
 * @returns {String} connectionState
 */
Connection.prototype.getState = function() {
	return this._state;
};

/**
 * Sends the specified authentication parameters
 * to the server. Can be called up to <maxAuthAttempts>
 * times for the same connection.
 *
 * @param   {Object}   authParams A map of user defined auth parameters. E.g. { username:<String>, password:<String> }
 * @param   {Function} callback   A callback that will be invoked with the authenticationr result
 *
 * @public
 * @returns {void}
 */
Connection.prototype.authenticate = function( authParams, callback ) {
	if( this._deliberateClose === true && this._state === C.CONNECTION_STATE.CLOSED ) {
		this._client._$onError( C.TOPIC.ERROR, C.EVENT.IS_CLOSED, 'this client\'s connection was closed' );
		return;
	}
	
	this._authParams = authParams;
	this._authCallback = callback;

	if( this._state === C.CONNECTION_STATE.AWAITING_AUTHENTICATION ) {
		this._sendAuthParams();
	}
};

/**
 * High level send message method. Creates a deepstream message
 * string and invokes the actual send method.
 *
 * @param   {String} topic  One of C.TOPIC
 * @param   {String} action One of C.ACTIONS
 * @param   {[Mixed]} data 	Date that will be added to the message. Primitive values will
 *                          be appended directly, objects and arrays will be serialized as JSON
 *
 * @private
 * @returns {void}
 */
Connection.prototype.sendMsg = function( topic, action, data ) {
	this.send( messageBuilder.getMsg( topic, action, data ) );
};

/**
 * Main method for sending messages. Doesn't send messages instantly,
 * but instead achieves conflation by adding them to the message
 * buffer that will be drained on the next tick
 *
 * @param   {String} message deepstream message
 *
 * @public
 * @returns {void}
 */
Connection.prototype.send = function( message ) {
	this._queuedMessages.push( message );
	this._currentPacketMessageCount++;

	if( this._currentMessageResetTimeout === null ) {
		this._currentMessageResetTimeout = utils.nextTick( this._resetCurrentMessageCount.bind( this ) );
	}

	if( this._state === C.CONNECTION_STATE.OPEN && 
		this._queuedMessages.length < this._options.maxMessagesPerPacket &&
		this._currentPacketMessageCount < this._options.maxMessagesPerPacket ) {
		this._sendQueuedMessages();
	}
	else if( this._sendNextPacketTimeout === null ) {
		this._queueNextPacket();
	}
};

/**
 * Closes the connection. Using this method
 * sets a _deliberateClose flag that will prevent the client from
 * reconnecting.
 *
 * @public
 * @returns {void}
 */
Connection.prototype.close = function() {
	this._deliberateClose = true;
	this._endpoint.close();
};

/**
 * When the implementation tries to send a large
 * number of messages in one execution thread, the first
 * <maxMessagesPerPacket> are send straight away.
 *
 * _currentPacketMessageCount keeps track of how many messages
 * went into that first packet. Once this number has been exceeded
 * the remaining messages are written to a queue and this message
 * is invoked on a timeout to reset the count.
 *
 * @private
 * @returns {void}
 */
Connection.prototype._resetCurrentMessageCount = function() {
	this._currentPacketMessageCount = 0;
	this._currentMessageResetTimeout = null;
};

/**
 * Concatenates the messages in the current message queue
 * and sends them as a single package. This will also
 * empty the message queue and conclude the send process.
 *
 * @private
 * @returns {void}
 */
Connection.prototype._sendQueuedMessages = function() {
	if( this._state !== C.CONNECTION_STATE.OPEN ) {
		return;
	}

	if( this._queuedMessages.length === 0 ) {
		this._sendNextPacketTimeout = null;
		return;
	}

	var message = this._queuedMessages.splice( 0, this._options.maxMessagesPerPacket ).join( '' );

	if( this._queuedMessages.length !== 0 ) {
		this._queueNextPacket();
	} else {
		this._sendNextPacketTimeout = null;
	}

	this._endpoint.send( message );
};

/**
 * Schedules the next packet whilst the connection is under
 * heavy load.
 *
 * @private
 * @returns {void}
 */
Connection.prototype._queueNextPacket = function() {
	var fn = this._sendQueuedMessages.bind( this ),
		delay = this._options.timeBetweenSendingQueuedPackages;

	this._sendNextPacketTimeout = setTimeout( fn, delay );
};

/**
 * Sends authentication params to the server. Please note, this
 * doesn't use the queued message mechanism, but rather sends the message directly
 *
 * @private
 * @returns {void}
 */
Connection.prototype._sendAuthParams = function() {
	this._setState( C.CONNECTION_STATE.AUTHENTICATING );
	var authMessage = messageBuilder.getMsg( C.TOPIC.AUTH, C.ACTIONS.REQUEST, [ this._authParams ] );
	this._endpoint.send( authMessage );
};

/**
 * Will be invoked once the connection is established. The client
 * can't send messages yet, but needs to authenticate first.
 *
 * If authentication parameters are already provided this will kick of
 * authentication immediatly. The actual 'open' event won't be emitted
 * by the client until the authentication is succesfull
 *
 * @private
 * @returns {void}
 */
Connection.prototype._onOpen = function() {
	this._clearReconnect();
	this._setState( C.CONNECTION_STATE.AWAITING_AUTHENTICATION );
	
	if( this._authParams ) {
		this._sendAuthParams();
	}
};

/**
 * Callback for generic connection errors. Forwards
 * the error to the client.
 *
 * The connection is considered broken once this method has been
 * invoked.
 *
 * @param   {String|Error} error connection error
 *
 * @private
 * @returns {void}
 */
Connection.prototype._onError = function( error ) {
	this._setState( C.CONNECTION_STATE.ERROR );

	/*
	 * If the implementation isn't listening on the error event this will throw
	 * an error. So let's defer it to allow the reconnection to kick in.
	 */
	setTimeout(function(){
		this._client._$onError( null, C.EVENT.CONNECTION_ERROR, error.toString() );
	}.bind( this ), 1);
};

/**
 * Callback when the connection closes. This might have been a deliberate
 * close triggered by the client or the result of the connection getting
 * lost.
 *
 * In the latter case the client will try to reconnect using the configured
 * strategy.
 *
 * @private
 * @returns {void}
 */
Connection.prototype._onClose = function() {
	if( this._deliberateClose === true ) {
		this._setState( C.CONNECTION_STATE.CLOSED );
	} else {
		this._tryReconnect();
	}
};

/**
 * Callback for messages received on the connection.
 *
 * @param   {String} message deepstream message
 *
 * @private
 * @returns {void}
 */
Connection.prototype._onMessage = function( message ) {
	var parsedMessages = messageParser.parse( message, this._client ),
		i;

	for( i = 0; i < parsedMessages.length; i++ ) {
		if( parsedMessages[ i ] === null ) {
			continue;
		}
		else if( parsedMessages[ i ].topic === C.TOPIC.AUTH ) {
			this._handleAuthResponse( parsedMessages[ i ] );
		} else {
			this._client._$onMessage( parsedMessages[ i ] );
		}
	}
};

/**
 * Callback for messages received for the AUTH topic. If
 * the authentication was succesfull this method will
 * open the connection and send all messages that the client
 * tried to send so far.
 *
 * @param   {Object} message parsed auth message
 *
 * @private
 * @returns {void}
 */
Connection.prototype._handleAuthResponse = function( message ) {
	if( message.action === C.ACTIONS.ERROR ) {
		
		if( message.data[ 0 ] === C.EVENT.TOO_MANY_AUTH_ATTEMPTS ) {
			this._deliberateClose = true;
		} else {
			this._setState( C.CONNECTION_STATE.AWAITING_AUTHENTICATION );
		}
		
		if( this._authCallback ) {
			this._authCallback( false, message.data[ 0 ], message.data[ 1 ] );
		}
	
	} else if( message.action === C.ACTIONS.ACK ) {
		this._setState( C.CONNECTION_STATE.OPEN );
		
		if( this._authCallback ) {
			this._authCallback( true );
		}

		this._sendQueuedMessages();
	}
};

/**
 * Updates the connection state and emits the 
 * connectionStateChanged event on the client
 *
 * @private
 * @returns {void}
 */
Connection.prototype._setState = function( state ) {
	this._state = state;
	this._client.emit( C.EVENT.CONNECTION_STATE_CHANGED, state );
};

/**
 * If the connection drops or is closed in error this
 * method schedules increasing reconnection intervals
 *
 * If the number of failed reconnection attempts exceeds
 * options.maxReconnectAttempts the connection is closed
 * 
 * @private
 * @returns {void}
 */
Connection.prototype._tryReconnect = function() {
	if( this._reconnectTimeout !== null ) {
		return;
	}

	if( this._reconnectionAttempt < this._options.maxReconnectAttempts ) {
		this._setState( C.CONNECTION_STATE.RECONNECTING );
		this._reconnectTimeout = setTimeout(
			this._tryOpen.bind( this ),
			this._options.reconnectIntervalIncrement * this._reconnectionAttempt 
		);
		this._reconnectionAttempt++;
	} else {
		this._clearReconnect();
		this.close();
	}
};

/**
 * Attempts to open a errourosly closed connection
 * 
 * @private
 * @returns {void}
 */
Connection.prototype._tryOpen = function() {
	this._endpoint.open();
	this._reconnectTimeout = null;
};

/**
 * Stops all further reconnection attempts,
 * either because the connection is open again
 * or because the maximal number of reconnection
 * attempts has been exceeded
 *
 * @private
 * @returns {void}
 */
Connection.prototype._clearReconnect = function() {
	clearTimeout( this._reconnectTimeout );
	this._reconnectTimeout = null;
	this._reconnectionAttempt = 0;
};

module.exports = Connection;