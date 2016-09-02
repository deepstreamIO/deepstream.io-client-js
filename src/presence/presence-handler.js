'use strict';

var C = require( '../constants/constants' ),
	messageParser = require( '../message/message-parser' ),
	messageBuilder = require( '../message/message-builder' );

module.exports = class PresenceHandler {

	constructor( options, connection, client ) {
		this._options = options;
		this._connection = connection;
		this._client = client;
		this._clientAddedCallback = null;
		this._clientRemovedCallback = null;
	}

	getCurrentClients( callback ) {
		this._presentClientsCallback = callback;
		var msg = messageBuilder.getMsg( C.TOPIC.PRESENCE, C.ACTIONS.QUERY );
		this._connection.send( msg );
	}

	onClientLogin( callback ) {
		this._clientAddedCallback = callback;

	}

	onClientLogout( callback ) {
		this._clientRemovedCallback = callback;
	}

	_$handle( message ) {
		if( message.action === C.ACTIONS.PRESENCE_ADD && this._clientAddedCallback !== null ) {
			this._clientAddedCallback( message.data );
		}
		else if( message.action === C.ACTIONS.PRESENCE_REMOVE && this._clientRemovedCallback !== null ) {
			this._clientRemovedCallback( message.data );
		}
		else if( message.action === C.ACTIONS.QUERY ) {
			this._presentClientsCallback( message.data );
		}
	}
}

