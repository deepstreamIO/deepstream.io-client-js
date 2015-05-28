var EventEmitter = require( 'component-emitter' ),
	Record = require( './record' ),
	C = require( '../constants/constants' );

/**
 * A List is a specialised Record that contains
 * an Array of recordNames and provides a number
 * of convinience methods for interacting with them.
 *
 * @param {RecordHanlder} recordHandler
 * @param {String} name    The name of the list
 *
 * @constructor
 */
var List = function( recordHandler, name, options ) {
	this._recordHandler = recordHandler;
	this._record = this._recordHandler.getRecord( name, options );
	this._record._applyUpdate = this._applyUpdate.bind( this );

	this._record.on( 'delete', this.emit.bind( this, 'delete' ) );
	this._record.on( 'discard', this.emit.bind( this, 'discard' ) );
	this._record.on( 'ready', this._onReady.bind( this ) );

	this.isReady = this._record.isReady;
	this.name = name;
	this._queuedMethods = [];

	this.delete = this._record.delete.bind( this._record );
	this.discard = this._record.discard.bind( this._record );
	this.whenReady = this._record.whenReady.bind( this._record );
};

EventEmitter( List.prototype );

/**
 * Returns the array of list entries or an
 * empty array if the list hasn't been populated yet.
 *
 * @public
 * @returns {Array} entries
 */
List.prototype.getEntries = function() {
	var entries = this._record.get();

	if( !( entries instanceof Array ) ) {
		return [];
	}

	return entries;
};

/**
 * Returns true if the list is empty
 *
 * @public
 * @returns {Boolean} isEmpty
 */
List.prototype.isEmpty = function() {
	return this.getEntries().length === 0;
};

/**
 * Updates the list with a new set of entries
 *
 * @public
 * @param {Array} entries
 */
List.prototype.setEntries = function( entries ) {
	var errorMsg = 'entries must be an array of record names',
		i;

	if( !( entries instanceof Array ) ) {
		throw new Error( errorMsg );
	}

	for( i = 0; i < entries.length; i++ ) {
		if( typeof entries[ i ] !== 'string' ) {
			throw new Error( errorMsg );
		}
	}

	if( this._record.isReady === false ) {
		this._queuedMethods.push( this.setEntries.bind( this, entries ) );
	} else {
		return this._record.set( entries );
	}
};

/**
 * Removes an entry from the list
 *
 * @param   {String} entry
 * @param {Number} [index]
 *
 * @public
 * @returns {void}
 */
List.prototype.removeEntry = function( entry, index ) {
	if( this._record.isReady === false ) {
		this._queuedMethods.push( this.removeEntry.bind( this, entry ) );
		return;
	}

	var currentEntries = this._record.get(),
		hasIndex = this._hasIndex( index ),
		entries = [],
		i;

	for( i = 0; i < currentEntries.length; i++ ) {
		if( currentEntries[i] !== entry || ( hasIndex && index !== i ) ) {
			entries.push( currentEntries[i] );
		}
	}

	this._record.set( entries );
};

/**
 * Adds an entry to the list
 *
 * @param {String} entry
 * @param {Number} [index]
 *
 * @public
 * @returns {void}
 */
List.prototype.addEntry = function( entry, index ) {
	if( typeof entry !== 'string' ) {
		throw new Error( 'Entry must be a recordName' );
	}

	if( this._record.isReady === false ) {
		this._queuedMethods.push( this.addEntry.bind( this, entry ) );
		return;
	}

	var hasIndex = this._hasIndex( index );
	var entries = this.getEntries();
	if( hasIndex ) {
		entries.splice( index, 0, entry );
	} else {
		entries.push( entry );
	}
	this._record.set( entries );
};

/**
 * Proxies the underlying Record's subscribe method. Makes sure
 * that no path is provided
 *
 * @public
 * @returns {void}
 */
List.prototype.subscribe = function() {
	var parameters = Record.prototype._normalizeArguments( arguments );

	if( parameters.path ) {
		throw new Error( 'path is not supported for List.subscribe' );
	}

	this._record.subscribe( parameters );
};

/**
 * Proxies the underlying Record's unsubscribe method. Makes sure
 * that no path is provided
 *
 * @public
 * @returns {void}
 */
List.prototype.unsubscribe = function() {
	var parameters = Record.prototype._normalizeArguments( arguments );

	if( parameters.path ) {
		throw new Error( 'path is not supported for List.unsubscribe' );
	}

	this._record.unsubscribe( parameters );
};

/**
 * Listens for changes in the Record's ready state
 * and applies them to this list
 *
 * @private
 * @returns {void}
 */
List.prototype._onReady = function() {
	this.isReady = true;

	for( var i = 0; i < this._queuedMethods.length; i++ ) {
		this._queuedMethods[ i ]();
	}

	this.emit( 'ready' );
};

/**
 * Proxies the underlying Record's _update method. Set's
 * data to an empty array if no data is provided.
 *
 * @param   {null}   path must (should :-)) be null
 * @param   {Array}  data
 *
 * @private
 * @returns {void}
 */
List.prototype._applyUpdate = function( message ) {
	if( message.action === C.ACTIONS.PATCH ) {
		throw new Error( 'PATCH is not supported for Lists' );
	}

	if( message.data[ 2 ].charAt( 0 ) !== '[' ) {
		message.data[ 2 ] = '[]';
	}

	Record.prototype._applyUpdate.call( this._record, message );
};

/**
 * Validates that the index provided is within the current set of entries.
 *
 * @param {Number} index
 *
 * @private
 * @returns {Number}
 */
List.prototype._hasIndex = function( index ) {
	var hasIndex = false;
	var entries = this.getEntries();
	if( index !== undefined ) {
		if( isNaN( index ) ) {
			throw new Error( 'Index must be a number' );
		}
		if( index >= entries.length || index < 0 ) {
			throw new Error( 'Index must be within current entries' );
		}
		hasIndex = true;
	}
	return hasIndex;
};

module.exports = List;
