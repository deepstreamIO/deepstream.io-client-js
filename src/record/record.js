var jsonPath = require( './json-path' ),
	utils = require( '../utils/utils' ),
	ResubscribeNotifier = require( '../utils/resubscribe-notifier' ),
	EventEmitter = require( 'component-emitter' ),
	C = require( '../constants/constants' ),
	messageBuilder = require( '../message/message-builder' ),
	messageParser = require( '../message/message-parser' ),
	CID = utils.getShortId();

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
	this.isDestroyed = false;
	this.isDestroying = false;
	this.hasProvider = false;
	this.version = null;

	this._recordOptions = recordOptions;
	this._connection = connection;
	this._client = client;
	this._options = options;
	this._eventEmitter = new EventEmitter();

	this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._sendRead.bind( this ) );
	this._reset();
	this._sendRead();
};

EventEmitter( Record.prototype );

Record.prototype._reset = function () {
	this._data = undefined;
	this._patchQueue = [];
	this.usages = 0;
	this.isReady = false;
}

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
	return jsonPath.get( this._data, path );
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

	if( path && this._patchQueue ) {
		this._patchQueue.push({ path, data });
	} else {
		this._patchQueue = undefined
	}

	var path = arguments.length === 1 ? undefined : pathOrData;
	data = path ? data : pathOrData;

	var oldValue = this._data;
	var newValue = jsonPath.set( oldValue, path, data );

	if ( oldValue === newValue ) {
		return this;
	}

	this._applyChange( newValue );

	if ( this.isReady ) {
		this._dispatchUpdate();
	}

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

	this._eventEmitter.on( args.path, args.callback );

	if( args.triggerNow && this._data ) {
		args.callback( this.get( args.path ) );
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
		if( this.usages === 0 && !this.isDestroying ) {
			this.isDestroying = true;
			this._reset();
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
	this.set( Object.create( null ) );
	this.discard();
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
Record.prototype.whenReady = function( ) {
	return new Promise( ( resolve ) => {
		if( this.isReady ) {
			resolve( this );
		} else {
			this.once( 'ready', resolve( this ) );
		}
	} );
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
			this._readTimeout = undefined;
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
	}
	else if( message.action === C.ACTIONS.SUBSCRIPTION_HAS_PROVIDER ) {
		var hasProvider = messageParser.convertTyped( message.data[ 1 ], this._client );
		this.hasProvider = hasProvider;
		this.emit( 'hasProviderChanged', hasProvider );
	}
};

/**
 * Callback for ack-messages. Acks can be received for
 * subscriptions and discards.
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
	else if( acknowledgedAction === C.ACTIONS.UNSUBSCRIBE ) {
		this.emit( 'discard' );
		this._destroy();
	}
};

Record.prototype._dispatchUpdate = function() {
	const start = this.version ? parseInt( this.version.split( '-' )[ 0 ], 10 ) : 0;
	const version = `${start + 1}-${utils.getShortId()}`;
	this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.UPDATE, [
		this.name,
		version,
		this._data,
		this.version
	] );
	this.version = version;
}

/**
 * Applies incoming updates to the record's dataset
 *
 * @param   {Object} message parsed and validated deepstream message
 *
 * @private
 * @returns {void}
 */
Record.prototype._applyUpdate = function( message ) {
	var version = message.data[ 1 ];
	var data = JSON.parse( message.data[ 2 ] );

	if ( utils.compareVersions( this.version, version ) ) {
		return;
	}

	this.version = version;
	this._applyChange( jsonPath.set( this._data, undefined, data ) );
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
	var oldValue = JSON.parse( message.data[ 2 ] );
	var newValue = this._data || oldValue;

	if ( this._patchQueue ) {
		for( var i = 0; i < this._patchQueue.length; i++ ) {
			newValue = jsonPath.set( newValue, this._patchQueue[ i ].path, this._patchQueue[ i ].data );
		}
		this._patchQueue = undefined;
	}

	this.isReady = true;
	this.version = message.data[ 1 ];
	this._applyChange( newValue );

	if ( newValue !== oldValue ) {
		this._dispatchUpdate();
	}

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
 	this._connection.sendMsg( C.TOPIC.RECORD, C.ACTIONS.READ, [ this.name ] );
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

	var oldData = this._data;
	this._data = newData;

	if ( !this._eventEmitter._callbacks ) {
		return;
	}

	var paths = Object.keys( this._eventEmitter._callbacks );

	for ( var i = 0; i < paths.length; i++ ) {
		var newValue = jsonPath.get( newData, paths[ i ] );
		var oldValue = jsonPath.get( oldData, paths[ i ] );

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
	clearTimeout( this._discardTimeout );
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
 * Generic handler for ack and read timeouts
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
  this.isDestroying = false;
 	this._clearTimeouts();
	if ( this.usages > 0 ) {
		this._sendRead();
	} else {
	 	this._eventEmitter.off();
	 	this._resubscribeNotifier.destroy();
	 	this.isDestroyed = true;
	 	this._client = null;
		this._eventEmitter = null;
		this._connection = null;
		this.emit( 'destroy' );
	}
 };

module.exports = Record;
