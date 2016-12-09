var sinon = require( 'sinon' );
var config = require( '../config' );
var check = require( '../helper' ).check;

var records = {};
var subscribeCallback = sinon.spy();
var listenCallback = sinon.spy();
var snapshotCallback = sinon.spy();
var hasCallback = sinon.spy();

module.exports = function() {

	this.When(/^the client creates a record named "([^"]*)"$/, function (recordName, callback) {
		records[ recordName ] = global.dsClient.record.getRecord( recordName );
		setTimeout( callback, config.messageWaitTime );
	});

	this.When(/^the client sets the record "([^"]*)" "([^"]*)" to "(.+)"$/, function (recordName, path, value, callback) {
	  if( records[ recordName ].setCallback )
	  	records[ recordName ].set( path, value, records[ recordName ].setCallback );
	  else
	  	records[ recordName ].set( path, value );
	  setTimeout( callback, config.messageWaitTime );
	});

	this.When(/^the client sets the record "([^"]*)" to (.+)$/, function (recordName, value, callback) {
	  if( records[ recordName ].setCallback )
	  	records[ recordName ].set( JSON.parse( value ), records[ recordName ].setCallback );
	  else
	  	records[ recordName ].set( JSON.parse( value ) );
	  setTimeout( callback, config.messageWaitTime );
	});

	this.When(/^the client requires write acknowledgement on record "([^"]*)"$/, function (recordName) {
	  records[ recordName ].setCallback = sinon.spy();
	});

	this.When(/^the client is notified that the record "([^"]*)" was written without error$/, function (recordName) {
	  sinon.assert.calledWith( records[ recordName ].setCallback, null );
	  sinon.assert.calledOnce( records[ recordName ].setCallback );
	  records[ recordName ].setCallback.reset();
	});

	this.When(/^the client is notified that the record "([^"]*)" was written with error "([^"]*)"$/, function (recordName, errorMessage) {
	  sinon.assert.calledWith( records[ recordName ].setCallback, errorMessage );
	  sinon.assert.calledOnce( records[ recordName ].setCallback );
	  records[ recordName ].setCallback.reset();
	});

	this.Then(/^the client record "([^"]*)" data is (.*)$/, function (recordName, data, callback) {
		check( 'record data', records[ recordName ].get(), JSON.parse( data ), callback );
	});

	this.When(/^the client discards the record named "([^"]*)"$/, function (recordName, callback) {
		records[ recordName ].discard();
		setTimeout( callback, config.messageWaitTime );
	});

	this.When(/^the client deletes the record named "([^"]*)"$/, function (recordName, callback) {
	 	records[ recordName ].delete();
		setTimeout( callback, config.messageWaitTime );
	});

	/**
	* Listen
	*/
	this.When(/^the client listens to a record matching "([^"]*)"$/, function (pattern, callback) {
		global.dsClient.record.listen( pattern, listenCallback );
		setTimeout( callback, config.messageWaitTime );
	});

	this.Then(/^the client will be notified of new record match "([^"]*)"$/, function (recordName) {
		sinon.assert.calledWith( listenCallback, recordName, true );

	});

	this.Then(/^the client will be notified of record match removal "([^"]*)"$/, function (recordName) {
	  sinon.assert.calledWith( listenCallback, recordName, false );
	});

	this.When(/^the client unlistens to a record matching "([^"]*)"$/, function (pattern, callback) {
	  	global.dsClient.record.unlisten( pattern, listenCallback );
		setTimeout( callback, config.messageWaitTime );
	});

	/**
	* Subscribe
	*/
	this.When(/^the client subscribes to "([^"]*)" for the record "([^"]*)"$/, function (path, recordName, callback) {
	  	records[ recordName ].subscribe( path, subscribeCallback );
		setTimeout( callback, config.messageWaitTime );
	});

	this.When(/^the client unsubscribes to the entire record "([^"]*)" changes$/, function (recordName, callback) {
	  	records[ recordName ].unsubscribe( subscribeCallback );
		setTimeout( callback, config.messageWaitTime );
	});

	this.When(/^the client unsubscribes to "([^"]*)" for the record "([^"]*)"$/, function (path, recordName, callback) {
	  	records[ recordName ].unsubscribe( path, subscribeCallback );
		setTimeout( callback, config.messageWaitTime );
	});

	this.When(/^the client subscribes to the entire record "([^"]*)" changes$/, function (recordName, callback) {
	  	records[ recordName ].subscribe( subscribeCallback );
		setTimeout( callback, config.messageWaitTime );
	});

	this.Then(/^the client will not be notified of the record change$/, function () {
		sinon.assert.notCalled( subscribeCallback );
	});

	this.Then(/^the client will be notified of the record change$/, function () {
		sinon.assert.calledOnce( subscribeCallback );
		//sinon.assert.calledWith( subscribeCallback, record.get() );
		subscribeCallback.reset();
	});

	this.Then(/^the client will be notified of the second record change$/, function () {
		sinon.assert.calledOnce( subscribeCallback );
		//sinon.assert.calledWith( subscribeCallback, 5 );
		subscribeCallback.reset();
	});

	this.Then(/^the client will be notified of the partial record change$/, function () {
		sinon.assert.calledOnce( subscribeCallback );
		//sinon.assert.calledWith( subscribeCallback, record.get() );
		subscribeCallback.reset();
	});

	/**
	 * Snapshot
	 */
	this.Given(/^the client requests a snapshot for the record "([^"]*)"$/, function (recordName, callback) {
		global.dsClient.record.snapshot( recordName, snapshotCallback );
		setTimeout( callback, config.messageWaitTime );
    });

	this.Then(/^the client has no response for the snapshot of record "([^"]*)"$/, function (recordName) {
         sinon.assert.notCalled( snapshotCallback );
    });

	this.Then(/^the client is told the record "([^"]*)" encountered an error retrieving snapshot$/, function (recordName) {
         sinon.assert.calledWith( snapshotCallback, "RECORD_NOT_FOUND" );
		 sinon.assert.calledOnce( snapshotCallback );
		 snapshotCallback.reset();
    });

	this.Then(/^the client is provided the snapshot for record "([^"]*)" with data "(.*)"$/, function (recordName, data) {
         sinon.assert.calledWith( snapshotCallback, null, JSON.parse( data ) );
		 sinon.assert.calledOnce( snapshotCallback );
		 snapshotCallback.reset();
    });

	/**
	 * Has
	 */
	this.Given(/^the client checks if the server has the record "([^"]*)"$/, function (recordName, callback) {
		global.dsClient.record.has( recordName, hasCallback );
		setTimeout( callback, config.messageWaitTime );
    });

	this.Then(/^the client is told the record "([^"]*)" exists$/, function (recordName) {
		sinon.assert.calledWith( hasCallback, null, true );
		sinon.assert.calledOnce( hasCallback );
		hasCallback.reset();
    });

	this.Then(/^the client is told the record "([^"]*)" doesn't exist$/, function (recordName) {
		sinon.assert.calledWith( hasCallback, null, false );
		sinon.assert.calledOnce( hasCallback );
		hasCallback.reset();
    });
};