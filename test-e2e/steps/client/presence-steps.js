'use strict'

const sinon = require( 'sinon' );

const clientHandler = require('./client-handler');
const utils = require('./utils');

const clients = clientHandler.clients;

module.exports = function (){

	const loginEvent = 'in';
	const logoutEvent = 'out';
	const queryEvent = 'query';

	this.Given(/^(.+) subscribes to presence login events$/, function (clientExpression, done) {
		clientHandler.getClients( clientExpression ).forEach( ( client ) => {
			client.presence.callbacks[ loginEvent ] = sinon.spy();
			client.client.onClientAdded( client.presence.callbacks[ loginEvent ] );
		} );
		setTimeout( done, utils.defaultDelay );
	});

	this.Given(/^(.+) subscribes to presence logout events$/, function (clientExpression, done) {
		clientHandler.getClients( clientExpression ).forEach( ( client ) => {
			client.presence.callbacks[ logoutEvent ] = sinon.spy();
			client.client.onClientRemoved( client.presence.callbacks[ logoutEvent ] );
		} );
		setTimeout( done, utils.defaultDelay );
	});

	this.When(/^(.+) queries for connected clients$/, function (clientExpression, done) {
		clientHandler.getClients( clientExpression ).forEach( ( client ) => {
			client.presence.callbacks[ queryEvent ] = sinon.spy();
			client.client.getPresentClients( client.presence.callbacks[ queryEvent ] );
		} );
		setTimeout( done, utils.defaultDelay );
	});

	this.Then(/^(.+) (?:is|are) notified that (.+) logged ([^"]*)$/, function (notifeeExpression, notiferExpression, event) {
		clientHandler.getClients( notifeeExpression ).forEach( ( notifee ) => {
			clientHandler.getClients( notiferExpression ).forEach( ( notifier ) => {
				sinon.assert.calledWith( notifee.presence.callbacks[ event ], notifier.user );
			});
			notifee.presence.callbacks[ event ].reset();
		});
	});

	this.Then(/^(.+) is notified that (?:clients|client) "([^"]*)" (?:are|is) connected$/, function (clientExpression, connectedClients) {
		clientHandler.getClients( clientExpression ).forEach( ( client ) => {
			sinon.assert.calledOnce( client.presence.callbacks[ queryEvent ] );
			sinon.assert.calledWith( client.presence.callbacks[ queryEvent ], connectedClients.split(',') );
			client.presence.callbacks[ queryEvent ].reset();
		} );
	});

	this.Then(/^(.+) is notified that no clients are connected$/, function (clientExpression) {
		clientHandler.getClients( clientExpression ).forEach( ( client ) => {
			sinon.assert.calledOnce( client.presence.callbacks[ queryEvent ] );
			sinon.assert.calledWith( client.presence.callbacks[ queryEvent ], [] );
			client.presence.callbacks[ queryEvent ].reset();
		} );
	});

}
