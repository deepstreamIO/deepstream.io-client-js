var Record = require( './record' ),
	Listener = require( '../utils/listener' ),
	utils = require( '../utils/utils' ),
	SingleNotifier = require( '../utils/single-notifier' ),
	C = require( '../constants/constants' ),
	messageParser = require( '../message/message-parser' ),
	EventEmitter = require( 'component-emitter' ),
	Rx = require( 'rxjs' );

/**
 * A collection of factories for records. This class
 * is exposed as client.record
 *
 * @param {Object} options    deepstream options
 * @param {Connection} connection
 * @param {Client} client
 */
var RecordHandler = function( options, connection, client ) {
	this._options = options;
	this._connection = connection;
	this._client = client;
	this._records = {};
	this._listener = {};
	this._destroyEventEmitter = new EventEmitter();

	this._snapshotRegistry = new SingleNotifier( client, connection, C.TOPIC.RECORD, C.ACTIONS.SNAPSHOT, this._options.recordReadTimeout );
};

/**
 * Returns an existing record or creates a new one.
 *
 * @param   {String} name          		the unique name of the record
 * @param   {[Object]} recordOptions 	A map of parameters for this particular record.
 *                                    	{ persist: true }
 *
 * @public
 * @returns {Record}
 */
RecordHandler.prototype.getRecord = function( recordName, recordOptions ) {
	if( !this._records[ recordName ] ) {
		this._records[ recordName ] = new Record( recordName, recordOptions || {}, this._connection, this._options, this._client );
		this._records[ recordName ].on( 'error', this._onRecordError.bind( this, recordName ) );
		this._records[ recordName ].on( 'destroy', this._onRecordDestroy.bind( this, recordName ) );
	}

	this._records[ recordName ].usages++;

	return this._records[ recordName ];
};

/**
 * Allows to listen for record subscriptions made by this or other clients. This
 * is useful to create "active" data providers, e.g. providers that only provide
 * data for a particular record if a user is actually interested in it
 *
 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
 * @param   {Function} callback
 *
 * @public
 * @returns {void}
 */
RecordHandler.prototype.listen = function( pattern, callback ) {
	if ( typeof pattern !== 'string' || pattern.length === 0 ) {
		throw new Error( 'invalid argument pattern' );
	}
	if ( typeof callback !== 'function' ) {
		throw new Error( 'invalid argument callback' );
	}

	if( this._listener[ pattern ] && !this._listener[ pattern ].destroyPending ) {
		return this._client._$onError( C.TOPIC.RECORD, C.EVENT.LISTENER_EXISTS, pattern );
	}

	if( this._listener[ pattern ] ) {
		this._listener[ pattern ].destroy();
	}
	this._listener[ pattern ] = new Listener( C.TOPIC.RECORD, pattern, callback, this._options, this._client, this._connection );
};

/**
 * Removes a listener that was previously registered with listenForSubscriptions
 *
 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
 * @param   {Function} callback
 *
 * @public
 * @returns {void}
 */
RecordHandler.prototype.unlisten = function( pattern ) {
	if ( typeof pattern !== 'string' || pattern.length === 0 ) {
		throw new Error( 'invalid argument pattern' );
	}

	var listener = this._listener[ pattern ];
	if( listener && !listener.destroyPending ) {
		listener.sendDestroy();
	} else if( this._listener[ pattern ] ) {
		this._listener[ pattern ].destroy();
		delete this._listener[ pattern ];
	} else {
		this._client._$onError( C.TOPIC.RECORD, C.EVENT.NOT_LISTENING, pattern );
	}
};

/**
 * Retrieve the current record data without subscribing to changes
 *
 * @param   {String}	name the unique name of the record
 * @param   {Function}	callback
 *
 * @public
 */
RecordHandler.prototype.snapshot = function( name, callback ) {
	if ( typeof name !== 'string' || name.length === 0 ) {
		throw new Error( 'invalid argument name' );
	}

	var promise;
	if (typeof callback === 'undefined') {
		promise = utils.createPromise();
		callback = promise.callback;
  }

	if( this._records[ name ] && this._records[ name ].hasData ) {
		callback( null, this._records[ name ].get() );
	} else {
		this._snapshotRegistry.request( name, callback );
	}

	return promise;
};

RecordHandler.prototype.set = function( name, pathOrData, data ) {
	var path = data ? pathOrData : undefined;
	var data = data ? data : pathOrData;

	var record = this.getRecord( name );
	record.set( path, data );
	record.discard();
};

RecordHandler.prototype.observe = function observe (recordName) {
  return Rx.Observable
    .create(o => {
      const rec = this.getRecord(recordName)
      const onValue = val => o.next(val)
      const onError = err => o.error(err)
      rec.subscribe(onValue, true)
      rec.on('error', onError)
      return () => {
        rec.unsubscribe(onValue)
        rec.off('error', onError)
        rec.discard()
      }
    })
}

/**
 * Will be called by the client for incoming messages on the RECORD topic
 *
 * @param   {Object} message parsed and validated deepstream message
 *
 * @package private
 * @returns {void}
 */
RecordHandler.prototype._$handle = function( message ) {
	var name;

	if( message.action === C.ACTIONS.ERROR &&
		( message.data[ 0 ] !== C.ACTIONS.SNAPSHOT &&
			message.data[ 0 ] !== C.EVENT.MESSAGE_DENIED
		)
	) {
		message.processedError = true;
		this._client._$onError( C.TOPIC.RECORD, message.data[ 0 ], message.data[ 1 ] );
		return;
	}

	if( message.action === C.ACTIONS.ACK || message.action === C.ACTIONS.ERROR ) {
		name = message.data[ 1 ];

		if( message.data[ 0 ] === C.ACTIONS.SNAPSHOT ) {
			message.processedError = true;
			this._snapshotRegistry.recieve( name, message.data[ 2 ] );
			return;
		}

	} else {
		name = message.data[ 0 ];
	}

	var processed = false;

	if( this._records[ name ] ) {
		processed = true;
		this._records[ name ]._$onMessage( message );
	}

	if( message.action === C.ACTIONS.READ && this._snapshotRegistry.hasRequest( name ) ) {
		processed = true;
		this._snapshotRegistry.recieve( name, null, JSON.parse( message.data[ 2 ] ) );
	}

	if( message.action === C.ACTIONS.ACK && message.data[ 0 ] === C.ACTIONS.UNLISTEN &&
		this._listener[ name ] && this._listener[ name ].destroyPending
	) {
		processed = true;
		this._listener[ name ].destroy();
		delete this._listener[ name ];
	} else if( this._listener[ name ] ) {
		processed = true;
		this._listener[ name ]._$onMessage( message );
	} else if( message.action === C.ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED ) {
		// An unlisten ACK was received before an PATTERN_REMOVED which is a valid case
		processed = true;
	}  else if( message.action === C.ACTIONS.SUBSCRIPTION_HAS_PROVIDER ) {
		// record can receive a HAS_PROVIDER after discarding the record
		processed = true;
	}

	if( !processed ) {
		message.processedError = true;
		this._client._$onError( C.TOPIC.RECORD, C.EVENT.UNSOLICITED_MESSAGE, name );
	}
};

/**
 * Callback for 'error' events from the record.
 *
 * @param   {String} recordName
 * @param   {String} error
 *
 * @private
 * @returns {void}
 */
RecordHandler.prototype._onRecordError = function( recordName, error ) {
	this._client._$onError( C.TOPIC.RECORD, error, recordName );
};

/**
 * Callback for the 'destroy' event from a record. Removes the record from
 * the registry
 *
 * @param   {String} recordName
 *
 * @returns {void}
 */
RecordHandler.prototype._onRecordDestroy = function( recordName ) {
	delete this._records[ recordName ];
};

module.exports = RecordHandler;
