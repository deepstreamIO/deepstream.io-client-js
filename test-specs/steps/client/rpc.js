var sinon = require( 'sinon' );
var config = require( '../config' );
var check = require( '../helper' ).check;

var rpc;
var rpcCallback;
var rpcProvideCallback;

module.exports = function() {

	this.When( /^the client requests RPC "(\w*)" with data "(\w*)"$/, function( rpcName, rpcData, callback ){
		rpcCallback = sinon.spy();
		global.dsClient.rpc.make( rpcName, rpcData, rpcCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client provides a RPC called "(\w*)"$/, function ( rpcName, callback) {
	 	rpcProvideCallback = sinon.spy();
		global.dsClient.rpc.provide( rpcName, rpcProvideCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client stops providing a RPC called "(\w*)"$/, function ( rpcName, callback) {
		global.dsClient.rpc.unprovide( rpcName, rpcProvideCallback );
		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client responds to the RPC "(\w*)" with data "(\w*)"$/, function ( rpcName, rpcData, callback) {
  		rpc.send( 'ABC' );
  		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client responds to the RPC "(\w*)" with the error "([^"]*)"$/, function ( rpcName, errorMessage, callback) {
		rpc.error( errorMessage );
  		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.When(/^the client rejects the RPC "(\w*)"$/, function ( rpcName, callback ) {
		rpc.reject();
  		setTimeout( callback, config.tcpMessageWaitTime );
	});

	this.Then(/^the client recieves a request for a RPC called "(\w*)" with data "(\w*)"$/, function ( rpcName, rpcData ) {
  		rpc = rpcProvideCallback.getCall( 0 ).args[ 1 ];
  		sinon.assert.calledOnce( rpcProvideCallback );
  		sinon.assert.calledWith( rpcProvideCallback, rpcData );
  		rpcProvideCallback.reset();
	});

	this.Then(/^the client recieves a successful RPC callback for "(\w*)" with data "(\w*)"$/, function ( rpcName, rpcData ) {
  		sinon.assert.calledOnce( rpcCallback );
  		sinon.assert.calledWith( rpcCallback, null, rpcData );
	});

	this.Then(/^the client recieves an error RPC callback for "(\w*)" with the message "([^"]*)"$/, function ( rpcName, errorMessage ) {
  		sinon.assert.calledOnce( rpcCallback );
  		sinon.assert.calledWith( rpcCallback, errorMessage );
	});

};