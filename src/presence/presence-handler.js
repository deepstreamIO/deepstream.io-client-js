'use strict';

var C = require( '../constants/constants' ),
	messageParser = require( '../message/message-parser' ),
	messageBuilder = require( '../message/message-builder' );

module.exports = class PresenceHandler {

	constructor( options, connection, client ) {
		this._options = options;
		this._connection = connection;
		this._client = client;
		this._presentClientsCallback = null;
	}

	getCurrentClients( callback ) {
		this._presentClientsCallback = callback;
		var msg = messageBuilder.getMsg( C.TOPIC.PRESENCE, C.ACTIONS.QUERY );
		this._connection.send( msg );
	}

	_$handle( message ) {
		if( message.action === C.ACTIONS.QUERY ) {
			this._presentClientsCallback( message.data );
		}
	}
}

