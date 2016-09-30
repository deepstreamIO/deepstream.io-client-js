var sinon = require( 'sinon' );
var config = require( '../config' );
var check = require( '../helper' ).check;

var records = {};
var subscribeCallback = sinon.spy();
var listenCallback = sinon.spy();

module.exports = function() {

	this.When(/^the client creates a record named "([^"]*)"$/, function (recordName, callback) {
		records[ recordName ] = global.dsClient.record.getRecord( recordName );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client sets the record "([^"]*)" "([^"]*)" to "(.+)"$/, function (recordName, path, value, callback) {
	  records[ recordName ].set( path, value );
	  setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client sets the record "([^"]*)" to (.+)$/, function (recordName, value, callback) {
	  records[ recordName ].set( JSON.parse( value ) );
	  setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.Then(/^the client record "([^"]*)" data is (.*)$/, function (recordName, data, callback) {
		check( 'record data', records[ recordName ].get(), JSON.parse( data ), callback );
	});

	this.When(/^the client discards the record named "([^"]*)"$/, function (recordName, callback) {
		records[ recordName ].discard();
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client deletes the record named "([^"]*)"$/, function (recordName, callback) {
	 	records[ recordName ].delete();
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	/**
	* Listen
	*/
	this.When(/^the client listens to a record matching "([^"]*)"$/, function (pattern, callback) {
		global.dsClient.record.listen( pattern, listenCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.Then(/^the client will be notified of new record match "([^"]*)"$/, function (recordName) {
		sinon.assert.calledWith( listenCallback, recordName, true );

	});

	this.Then(/^the client will be notified of record match removal "([^"]*)"$/, function (recordName) {
	  sinon.assert.calledWith( listenCallback, recordName, false );
	});

	this.When(/^the client unlistens to a record matching "([^"]*)"$/, function (pattern, callback) {
	  	global.dsClient.record.unlisten( pattern, listenCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	/**
	* Subscribe
	*/
	this.When(/^the client subscribes to "([^"]*)" for the record "([^"]*)"$/, function (path, recordName, callback) {
	  	records[ recordName ].subscribe( path, subscribeCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client unsubscribes to the entire record "([^"]*)" changes$/, function (recordName, callback) {
	  	records[ recordName ].unsubscribe( subscribeCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client unsubscribes to "([^"]*)" for the record "([^"]*)"$/, function (path, recordName, callback) {
	  	records[ recordName ].unsubscribe( path, subscribeCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client subscribes to the entire record "([^"]*)" changes$/, function (recordName, callback) {
	  	records[ recordName ].subscribe( subscribeCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
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

};