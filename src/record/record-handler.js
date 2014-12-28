var Record = require( './record' );

var RecordHandler = function( options, connection, client ) {
	this._options = options;
	this._connection = connection;
	this._client = client;
	this._records = {};
};

RecordHandler.prototype.getRecord = function( name, options ) {
	if( !this._records[ name ] ) {
		this._records[ name ] = new Record( name, options || {}, this._connection );
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

};

module.exports = RecordHandler;