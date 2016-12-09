'use strict'

const sinon = require( 'sinon' );

const clientHandler = require('./client-handler');
const utils = require('./utils');

const clients = clientHandler.clients;

module.exports = function (){

	const subscribeEvent = 'subscribe';
	const queryEvent = 'query';

	this.Given(/^(.+) subscribes to presence events$/, function (clientExpression, done) {
		clientHandler.getClients( clientExpression ).forEach( ( client ) => {
			client.presence.callbacks[ subscribeEvent ] = sinon.spy();
			client.client.presence.subscribe( client.presence.callbacks[ subscribeEvent ] );
		} );
		setTimeout( done, utils.defaultDelay );
	});

	this.When(/^(.+) queries for connected clients$/, function (clientExpression, done) {
		clientHandler.getClients( clientExpression ).forEach( ( client ) => {
			client.presence.callbacks[ queryEvent ] = sinon.spy();
			client.client.presence.getAll( client.presence.callbacks[ queryEvent ] );
		} );
		setTimeout( done, utils.defaultDelay );
	});

	this.Then(/^(.+) (?:is|are) notified that (.+) logged ([^"]*)$/, function (notifeeExpression, notiferExpression, event) {
		clientHandler.getClients( notifeeExpression ).forEach( ( notifee ) => {
			clientHandler.getClients( notiferExpression ).forEach( ( notifier ) => {
				sinon.assert.calledWith( notifee.presence.callbacks[ subscribeEvent ], notifier.user, event === 'in' ? true : false );
			});
			notifee.presence.callbacks[ subscribeEvent ].reset();
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
