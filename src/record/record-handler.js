var Record = require( './record' ),
	C = require( '../constants/constants' );

var RecordHandler = function( options, connection, client ) {
	this._options = options;
	this._connection = connection;
	this._client = client;
	this._records = {};
};

RecordHandler.prototype.getRecord = function( name, recordOptions ) {
	if( !this._records[ name ] ) {
		this._records[ name ] = new Record( name, recordOptions || {}, this._connection, this._options );
		this._records[ name ].on( 'error', this._onRecordError.bind( this, name ) );
		this._records[ name ].on( 'deleted', this._onRecordDeleted.bind( this, name ) );
	}

	return this._records[ name ];
};

RecordHandler.prototype.getList = function( name, options ) {

};

RecordHandler.prototype.getAnonymousRecord = function( name, options ) {

};

RecordHandler.prototype.listenForRequests = function( pattern, callback ) {

};


RecordHandler.prototype._$handle = function( message ) {
	var name;

	if( message.action === C.ACTIONS.ERROR ) {
		this._client._$onError( C.TOPIC.RECORD, message.data[ 0 ], message.data[ 1 ] );
		return;
	}
	
	if( message.action === C.ACTIONS.ACK ) {
		name = message.data[ 1 ];
	} else {
		name = message.data[ 0 ];
	}

	if( !this._records[ name ] ) {
		this._client._$onError( C.TOPIC.RECORD, C.EVENT.UNSOLICITED_MESSAGE, name );
	} else {
		this._records[ name ]._$onMessage( message );
	}
};

module.exports = RecordHandler;

RecordHandler.prototype._onRecordError = function( recordName, error ) {
	this._client._$onError( C.TOPIC.RECORD, error, recordName );
};

RecordHandler.prototype._onRecordDeleted = function( recordName ) {
	delete this._records[ recordName ];
};