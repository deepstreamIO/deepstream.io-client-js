const Record = require( './record' );
const Listener = require( '../utils/listener' );
const utils = require( '../utils/utils' );
const SingleNotifier = require( '../utils/single-notifier' );
const C = require( '../constants/constants' );
const messageParser = require( '../message/message-parser' );
const EventEmitter = require( 'component-emitter' );
const Rx = require( 'rxjs' );

const RecordHandler = function( options, connection, client ) {
	this._options = options;
	this._connection = connection;
	this._client = client;
	this._records = {};
	this._listener = {};
	this._destroyEventEmitter = new EventEmitter();
	this._debounce = { prev: new Set(), next: new Set() };
	this._cleanup();
};

RecordHandler.prototype._cleanup = function () {
	utils.requestIdleCallback( () => {
		for ( let key of this._debounce.prev ) {
			this._records[ key ].discard();
		}
		this._debounce.prev = this._debounce.next;
		this._debounce.next = new Set();
		setTimeout( this._cleanup.bind( this ), this._options.recordDiscardDelay );
	} );
}

RecordHandler.prototype.getRecord = function( recordName, recordOptions ) {
	if( !this._records[ recordName ] ) {
		this._records[ recordName ] = new Record( recordName, recordOptions || {}, this._connection, this._options, this._client );
		this._records[ recordName ].on( 'error', this._onRecordError.bind( this, recordName ) );
		this._records[ recordName ].on( 'destroy', this._onRecordDestroy.bind( this, recordName ) );
	}

	if ( !this._debounce.next.has ( recordName ) ) {
		this._records[ recordName ].usages++;
		this._debounce.next.add( recordName );
	}

	this._records[ recordName ].usages++;
	return this._records[ recordName ];
};

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


RecordHandler.prototype.get = function( recordName ) {
	if ( typeof recordName !== 'string' || recordName.length === 0 ) {
		throw new Error( 'invalid argument recordName' );
	}

	var record = this.getRecord( recordName );
	return record
		.whenReady()
		.then( () => record.get() )
		.then( val => {
			record.discard();
			return val;
		} )
		.catch( err => {
			record.discard();
			throw err;
		} );
};

RecordHandler.prototype.set = function( recordName, pathOrData, dataOrNil ) {
	if ( typeof recordName !== 'string' || recordName.length === 0 ) {
		throw new Error( 'invalid argument recordName' );
	}

	const path = dataOrNil ? pathOrData : undefined;
	const data = dataOrNil ? dataOrNil : pathOrData;

	const record = this.getRecord( recordName );
	record.set( path, data );
	record.discard();

	return record.whenReady();
};

RecordHandler.prototype.update = function( recordName, pathOrUpdater, updaterOrNil ) {
	if ( typeof recordName !== 'string' || recordName.length === 0 ) {
		throw new Error( 'invalid argument recordName' );
	}

	const path = updaterOrNil ? pathOrUpdater : undefined;
	const updater = updaterOrNil ? updaterOrNil : pathOrUpdater;

	return this
		.get( recordName, path )
		.then( data => this.set( recordName, path, updater( data ) ) );
};

RecordHandler.prototype.observe = function ( recordName ) {
  return Rx.Observable
    .create( ( o ) => {
			if ( typeof recordName !== 'string' || recordName.length === 0 ) {
				o.error ( new Error( 'invalid argument recordName' ) );
			} else {
	      const record = this.getRecord( recordordName );
	      const onValue = function ( value ) { o.next( value ); };
	      const onError = function ( error ) { o.error( error ); };
	      record.subscribe( onValue, true );
	      record.on( 'error', onError );
	      return () => {
	        record.unsubscribe( onValue );
	        record.off( 'error', onError );
	        record.discard();
	      }
			}
    } );
}

RecordHandler.prototype._$handle = function( message ) {
	if( message.action === C.ACTIONS.ERROR &&	message.data[ 0 ] !== C.EVENT.MESSAGE_DENIED ) {
		message.processedError = true;
		this._client._$onError( C.TOPIC.RECORD, message.data[ 0 ], message.data[ 1 ] );
		return;
	}

	let recordName;
	if( message.action === C.ACTIONS.ACK || message.action === C.ACTIONS.ERROR ) {
		recordName = message.data[ 1 ];
	} else {
		recordName = message.data[ 0 ];
	}

	const processed = false;

	if( this._records[ recordName ] ) {
		processed = true;
		this._records[ recordName ]._$onMessage( message );
	}

	if( message.action === C.ACTIONS.ACK && message.data[ 0 ] === C.ACTIONS.UNLISTEN &&
		this._listener[ recordName ] && this._listener[ recordName ].destroyPending
	) {
		processed = true;
		this._listener[ recordName ].destroy();
		delete this._listener[ recordName ];
	} else if( this._listener[ recordName ] ) {
		processed = true;
		this._listener[ recordName ]._$onMessage( message );
	} else if( message.action === C.ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED ) {
		// An unlisten ACK was received before an PATTERN_REMOVED which is a valid case
		processed = true;
	} else if( message.action === C.ACTIONS.SUBSCRIPTION_HAS_PROVIDER ) {
		// record can receive a HAS_PROVIDER after discarding the record
		processed = true;
	}

	if( !processed ) {
		message.processedError = true;
		this._client._$onError( C.TOPIC.RECORD, C.EVENT.UNSOLICITED_MESSAGE, name );
	}
};

RecordHandler.prototype._onRecordError = function( recordName, error ) {
	this._client._$onError( C.TOPIC.RECORD, error, recordName );
};

RecordHandler.prototype._onRecordDestroy = function( recordName ) {
	delete this._records[ recordName ];
};

module.exports = RecordHandler;
