var jsonPath = require( './json-path' ),
	utils = require( '../utils/utils' ),
	ResubscribeNotifier = require( '../utils/resubscribe-notifier' ),
	EventEmitter = require( 'component-emitter' ),
	C = require( '../constants/constants' ),
	messageBuilder = require( '../message/message-builder' ),
	messageParser = require( '../message/message-parser' );

/**
 * This class represents a single record - an observable
 * dataset returned by client.record.getRecord()
 *
 * @extends {EventEmitter}
 *
 * @param {String} name          		The unique name of the record
 * @param {Object} recordOptions 		A map of options, e.g. { persist: true }
 * @param {Connection} Connection		The instance of the server connection
 * @param {Object} options				Deepstream options
 * @param {Client} client				deepstream.io client
 *
 * @constructor
 */
var Record = function( name, recordOptions, connection, options, client ) {
	if ( typeof name !== 'string' || name.length === 0 ) {
		throw new Error( 'invalid argument name' );
	}

	this.name = name;
	this.usages = 0;
	this._recordOptions = recordOptions;
	this._connection = connection;
	this._client = client;
	this._options = options;
	this.isReady = false;
	this.isDestroyed = false;
	this.hasProvider = false;
	this._$data = Object.create( null );
	this.version = null;
	this._eventEmitter = new EventEmitter();
	this._queuedMethodCalls = [];

	this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._sendRead.bind( this ) );
	this._sendRead();
};

EventEmitter( Record.prototype );

/**
 * Returns a copy of either the entire dataset of the record
 * or - if called with a path - the value of that path within
 * the record's dataset.
 *
 * Returning a copy rather than the actual value helps to prevent
 * the record getting out of sync due to unintentional changes to
 * its data
 *
 * @param   {[String]} path A JSON path, e.g. users[ 2 ].firstname
 *
 * @public
 * @returns {Mixed} value
 */
Record.prototype.get = function( path ) {
	return jsonPath.get( this._$data, path, this._options.recordDeepCopy );
};

/**
 * Sets the value of either the entire dataset
 * or of a specific path within the record
 * and submits the changes to the server
 *
 * If the new data is equal to the current data, nothing will happen
 *
 * @param {[String|Object]} pathOrData Either a JSON path when called with two arguments or the data itself
 * @param {Object} data     The data that should be stored in the record
 *
 * @public
 * @returns {void}
 */
Record.prototype.set = function( pathOrData, data ) {
	if( arguments.length === 1 && typeof pathOrData !== 'object' ) {
		throw new Error( 'invalid argument data' );
	}
	if( arguments.length === 2 && ( typeof pathOrData !== 'string' || pathOrData.length === 0 ) ) {
		throw new Error( 'invalid argument path' )
	}

	if( this._checkDestroyed( 'set' ) ) {
		return this;
	}

	if( !this.isReady ) {
		this._queuedMethodCalls.push({ method: 'set', args: arguments });
		return this;
	}

	var path = arguments.length === 1 ? undefined : pathOrData;
	data = path ? data : pathOrData;

	var oldValue = this._$data;
	var newValue = jsonPath.set( oldValue, path, data, this._options.recordDeepCopy );

	if ( oldValue === newValue ) {
		return this;
	}

	this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.UPDATE, [
		this.name,
		++this.version,
		newValue
	]);

	this._applyChange( newValue );
	return this;
};

/**
 * Subscribes to changes to the records dataset.
 *
 * Callback is the only mandatory argument.
 *
 * When called with a path, it will only subscribe to updates
 * to that path, rather than the entire record
 *
 * If called with true for triggerNow, the callback will
 * be called immediatly with the current value
 *
 * @param   {[String]}		path			A JSON path within the record to subscribe to
 * @param   {Function} 		callback       	Callback function to notify on changes
 * @param   {[Boolean]}		triggerNow      A flag to specify whether the callback should be invoked immediatly
 *                                       	with the current value
 *
 * @public
 * @returns {void}
 */
Record.prototype.subscribe = function( path, callback, triggerNow ) {
	var args = this._normalizeArguments( arguments );

	if ( args.path !== undefined && ( typeof args.path !== 'string' || args.path.length === 0 ) ) {
		throw new Error( 'invalid argument path' );
	}
	if ( typeof args.callback !== 'function' ) {
		throw new Error( 'invalid argument callback' );
	}

	if( this._checkDestroyed( 'subscribe' ) ) {
		return;
	}

	if( args.triggerNow ) {
		this.whenReady( function () {
			this._eventEmitter.on( args.path, args.callback );
			args.callback( this.get( args.path ) );
		}.bind(this) );
	} else {
		this._eventEmitter.on( args.path, args.callback );
	}
};

/**
 * Removes a subscription that was previously made using record.subscribe()
 *
 * Can be called with a path to remove the callback for this specific
 * path or only with a callback which removes it from the generic subscriptions
 *
 * Please Note: unsubscribe is a purely client side operation. If the app is no longer
 * interested in receiving updates for this record from the server it needs to call
 * discard instead
 *
 * @param   {[String|Function]}   pathOrCallback A JSON path
 * @param   {Function} 			  callback   	The callback method. Please note, if a bound method was passed to
 *                                	   			subscribe, the same method must be passed to unsubscribe as well.
 *
 * @public
 * @returns {void}
 */
Record.prototype.unsubscribe = function( pathOrCallback, callback ) {
	var args = this._normalizeArguments( arguments );

	if ( args.path !== undefined && ( typeof args.path !== 'string' || args.path.length === 0 ) ) {
		throw new Error( 'invalid argument path' );
	}
	if ( args.callback !== undefined && typeof args.callback !== 'function' ) {
		throw new Error( 'invalid argument callback' );
	}

	if( this._checkDestroyed( 'unsubscribe' ) ) {
		return;
	}
	this._eventEmitter.off( args.path, args.callback );
};

/**
 * Removes all change listeners and notifies the server that the client is
 * no longer interested in updates for this record
 *
 * @public
 * @returns {void}
 */
Record.prototype.discard = function() {
	if( this._checkDestroyed( 'discard' ) ) {
		return;
	}
	this.usages--;
	this.whenReady( function() {
		if( this.usages === 0 ) {
			this._discardTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.ACK_TIMEOUT ), this._options.subscriptionTimeout );
			this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.UNSUBSCRIBE, [ this.name ] );
		}
	}.bind( this ) );
};

/**
 * Deletes the record on the server.
 *
 * @public
 * @returns {void}
 */
Record.prototype.delete = function() {
	if( this._checkDestroyed( 'delete' ) ) {
		return;
	}
	this.usages = 0;
	this.whenReady( function() {
		if ( this.usage === 0 ) {
			this._deleteAckTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.DELETE_TIMEOUT ), this._options.recordDeleteTimeout );
			this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.DELETE, [ this.name ] );
		}
	}.bind( this ) );
};

/**
 * Convenience method, similar to promises. Executes callback
 * whenever the record is ready, either immediatly or once the ready
 * event is fired
 *
 * @param   {Function} callback Will be called when the record is ready
 *
 * @returns {void}
 */
Record.prototype.whenReady = function( callback ) {
	if( this.isReady === true ) {
		callback();
	} else {
		this.once( 'ready', callback );
	}
};

/**
 * Callback for incoming messages from the message handler
 *
 * @param   {Object} message parsed and validated deepstream message
 *
 * @package private
 * @returns {void}
 */
Record.prototype._$onMessage = function( message ) {
	if( message.action === C.ACTIONS.READ ) {
		if ( this._readTimeout ) {
			clearTimeout( this._readTimeout );
		}

		if( !this.isReady ) {
			this._onRead( message );
		} else {
			this._applyUpdate( message );
		}
	}
	else if( message.action === C.ACTIONS.ACK ) {
		this._processAckMessage( message );
	}
	else if( message.action === C.ACTIONS.UPDATE ) {
		this._applyUpdate( message );
	}
	else if( message.data[ 0 ] === C.EVENT.MESSAGE_DENIED ) {
		this._clearTimeouts();
	} else if( message.action === C.ACTIONS.SUBSCRIPTION_HAS_PROVIDER ) {
		var hasProvider = messageParser.convertTyped( message.data[ 1 ], this._client );
		this.hasProvider = hasProvider;
		this.emit( 'hasProviderChanged', hasProvider );
	}
};

/**
 * Callback for ack-messages. Acks can be received for
 * subscriptions, discards and deletes
 *
 * @param   {Object} message parsed and validated deepstream message
 *
 * @private
 * @returns {void}
 */
Record.prototype._processAckMessage = function( message ) {
	var acknowledgedAction = message.data[ 0 ];

	if( acknowledgedAction === C.ACTIONS.SUBSCRIBE ) {
		clearTimeout( this._readAckTimeout );
	}
	else if( acknowledgedAction === C.ACTIONS.DELETE ) {
		this.emit( 'delete' );
		this._destroy();
	}
	else if( acknowledgedAction === C.ACTIONS.UNSUBSCRIBE ) {
		this.emit( 'discard' );
		this._destroy();
	}
};

/**
 * Applies incoming updates to the record's dataset
 *
 * @param   {Object} message parsed and validated deepstream message
 *
 * @private
 * @returns {void}
 */
Record.prototype._applyUpdate = function( message ) {
	var version = parseInt( message.data[ 1 ], 10 );
	var data = JSON.parse( message.data[ 2 ] );

	if ( this.version > version ) {
		return;
	}

	this.version = version;
	this._applyChange( jsonPath.set( this._$data, undefined, data ) );
};

/**
 * Callback for incoming read messages
 *
 * @param   {Object} message parsed and validated deepstream message
 *
 * @private
 * @returns {void}
 */
Record.prototype._onRead = function( message ) {
	this.version = parseInt( message.data[ 1 ], 10 );
	this._applyChange( jsonPath.set( this._$data, undefined, JSON.parse( message.data[ 2 ] ) ) );
	this._setReady();
};

/**
 * Invokes method calls that where queued while the record wasn't ready
 * and emits the ready event
 *
 * @private
 * @returns {void}
 */
Record.prototype._setReady = function() {
	this.isReady = true;
	for( var i = 0; i < this._queuedMethodCalls.length; i++ ) {
		this[ this._queuedMethodCalls[ i ].method ].apply( this, this._queuedMethodCalls[ i ].args );
	}
	this._queuedMethodCalls = [];
	this.emit( 'ready' );
};

/**
 * Sends the read message, either initially at record
 * creation or after a lost connection has been re-established
 *
 * @private
 * @returns {void}
 */
 Record.prototype._sendRead = function() {
 	this._readAckTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.ACK_TIMEOUT ), this._options.recordReadAckTimeout );
 	this._readTimeout = setTimeout( this._onTimeout.bind( this, C.EVENT.RESPONSE_TIMEOUT ), this._options.recordReadTimeout );
 	this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.CREATEORREAD, [ this.name ] );
 };

/**
 * Compares the new values for every path with the previously stored ones and
 * updates the subscribers if the value has changed
 *
 * @private
 * @returns {void}
 */
Record.prototype._applyChange = function( newData ) {
	if ( this.isDestroyed ) {
		return;
	}

	var oldData = this._$data;
	this._$data = newData;

	if ( !this._eventEmitter._callbacks ) {
		return;
	}

	var paths = Object.keys( this._eventEmitter._callbacks );

	for ( var i = 0; i < paths.length; i++ ) {
		var newValue = jsonPath.get( newData, paths[ i ], false );
		var oldValue = jsonPath.get( oldData, paths[ i ], false );

		if( newValue !== oldValue ) {
			this._eventEmitter.emit( paths[ i ], this.get( paths[ i ] ) );
		}
	}
};

/**
 * Creates a map based on the types of the provided arguments
 *
 * @param {Arguments} args
 *
 * @private
 * @returns {Object} arguments map
 */
Record.prototype._normalizeArguments = function( args ) {
	var result = Object.create( null );

	for( var i = 0; i < args.length; i++ ) {
		if( typeof args[ i ] === 'string' ) {
			result.path = args[ i ];
		}
		else if( typeof args[ i ] === 'function' ) {
			result.callback = args[ i ];
		}
		else if( typeof args[ i ] === 'boolean' ) {
			result.triggerNow = args[ i ];
		}
	}

	return result;
};

/**
 * Clears all timeouts that are set when the record is created
 *
 * @private
 * @returns {void}
 */
Record.prototype._clearTimeouts = function() {
	clearTimeout( this._readAckTimeout );
	clearTimeout( this._deleteAckTimeout );
	clearTimeout( this._discardTimeout );
	clearTimeout( this._deleteAckTimeout );
};

/**
 * A quick check that's carried out by most methods that interact with the record
 * to make sure it hasn't been destroyed yet - and to handle it gracefully if it has.
 *
 * @param   {String} methodName The name of the method that invoked this check
 *
 * @private
 * @returns {Boolean} is destroyed
 */
Record.prototype._checkDestroyed = function( methodName ) {
	if( this.isDestroyed ) {
		this.emit( 'error', 'Can\'t invoke \'' + methodName + '\'. Record \'' + this.name + '\' is already destroyed' );
		return true;
	}

	return false;
};
/**
 * Generic handler for ack, read and delete timeouts
 *
 * @private
 * @returns {void}
 */
Record.prototype._onTimeout = function( timeoutType ) {
	this._clearTimeouts();
	this.emit( 'error', timeoutType );
};

/**
 * Destroys the record and nulls all
 * its dependencies
 *
 * @private
 * @returns {void}
 */
 Record.prototype._destroy = function() {
 	this._clearTimeouts();
	if ( this.usages > 0 ) {
		this._sendRead();
	} else {
	 	this._eventEmitter.off();
	 	this._resubscribeNotifier.destroy();
	 	this.isDestroyed = true;
	 	this.isReady = false;
	 	this._client = null;
		this._eventEmitter = null;
		this._connection = null;
		this.emit( 'destroy' );
	}
 };

module.exports = Record;
