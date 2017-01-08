import { DeepstreamOptions, DefaultOptions, DeepstreamUserOptions } from "./DefaultOptions";
import Emitter = require("component-emitter");
import { Connection, AuthParams } from "./message/Connection";
import { EventHandler } from "./event/EventHandler";
import { RecordHandler } from "./record/RecordHandler";
import { PresenceHandler } from "./presence/PresenceHandler";
import { Topics, Events, ConnectionStates } from "./constants/Constants";
import { ParsedMessage } from "./message/MessageParser";
import { RPCHandler } from "./rpc/RPCHandler";
import { timeout } from "./utils/Utils";

/**
 * deepstream.io javascript client
 *
 * @copyright 2016 deepstreamHub GmbH
 * @author deepstreamHub GmbH
 *
 *
 * @{@link http://deepstream.io}
 *
 *
 * @param {String} url     URL to connect to. The protocol can be ommited, e.g. <host>:<port>.
 * @param {Object} options A map of options that extend the ones specified in DefaultOptions.js
 *
 * @public
 * @constructor
 */
export class Client extends Emitter {
	public event: EventHandler;
	public rpc: RPCHandler;
	public record: RecordHandler;
	public presence: PresenceHandler;
	public _options: DeepstreamOptions;
	private _url: string;
	private _connection: Connection;

	public get options(): DeepstreamOptions { return this.options; }

	public constructor(url: string, options?: DeepstreamUserOptions) {
		super();

		this._url = url;
		this._options = this._mergeWithDefaultOptions(options || {});

		this._connection = new Connection( this, this._url, this._options );

		this.event = new EventHandler( this._options, this._connection, this );
		this.rpc = new RPCHandler( this._options, this._connection, this );
		this.record = new RecordHandler( this._options, this._connection, this );
		this.presence = new PresenceHandler( this._options, this._connection, this );

		this._messageCallbacks = {};
		this._messageCallbacks[ Topics.EVENT ] = this.event._$handle.bind( this.event );
		this._messageCallbacks[ Topics.RPC ] = this.rpc._$handle.bind( this.rpc );
		this._messageCallbacks[ Topics.RECORD ] = this.record._$handle.bind( this.record );
		this._messageCallbacks[ Topics.PRESENCE ] = this.presence._$handle.bind( this.presence );
		this._messageCallbacks[ Topics.ERROR ] = this._onErrorMessage.bind( this );
	}

	/**
	 * Send authentication parameters to the client to fully open
	 * the connection.
	 *
	 * Please note: Authentication parameters are send over an already established
	 * connection, rather than appended to the server URL. This means the parameters
	 * will be encrypted when used with a WSS / HTTPS connection. If the deepstream server
	 * on the other side has message logging enabled it will however be written to the logs in
	 * plain text. If additional security is a requirement it might therefor make sense to hash
	 * the password on the client.
	 *
	 * If the connection is not yet established the authentication parameter will be
	 * stored and send once it becomes available
	 *
	 * authParams can be any JSON serializable data structure and its up for the
	 * permission handler on the server to make sense of them, although something
	 * like { username: 'someName', password: 'somePass' } will probably make the most sense.
	 *
	 * login can be called multiple times until either the connection is authenticated or
	 * forcefully closed by the server since its maxAuthAttempts threshold has been exceeded
	 *
	 * @param   {Object}   authParams JSON.serializable authentication data
	 * @param   {Function} callback   Will be called with either (true) or (false, data)
	 *
	 * @public
	 * @returns {Client}
	 */
	public login(authParams: AuthParams): Promise<any> {
		return this._connection.authenticate( authParams || {});
	}

	/**
	 * Closes the connection to the server.
	 *
	 * @public
	 * @returns {void}
	 */
	public close() {
		this._connection.close();
	}

	/**
	 * Returns the current state of the connection.
	 *
	 * connectionState is one of CONSTANTS.CONNECTION_STATE
	 *
	 * @returns {[type]} [description]
	 */
	public get connectionState(): string {
		return this._connection.state;
	}

	/**
	 * Returns a random string. The first block of characters
	 * is a timestamp, in order to allow databases to optimize for semi-
	 * sequentuel numberings
	 *
	 * @public
	 * @returns {String} unique id
	 */
	public createUid(): string {
		let timestamp = (new Date()).getTime().toString(36),
			randomString = (Math.random() * 10000000000000000).toString(36).replace( '.', '' );

		return timestamp + '-' + randomString;
	}

	/**
	 * Package private callback for parsed incoming messages. Will be invoked
	 * by the connection class
	 *
	 * @param   {Object} message parsed deepstream message
	 *
	 * @package private
	 * @returns {void}
	 */
	public _$onMessage(message: ParsedMessage): void {
		if( this._messageCallbacks[ message.topic ] ) {
			this._messageCallbacks[ message.topic ]( message );
		} else {
			message.processedError = true;
			this._$onError( message.topic, Events.MESSAGE_PARSE_ERROR, 'Received message for unknown topic ' + message.topic );
		}

		if( message.action === Actions.ERROR && !message.processedError ) {
			this._$onError( message.topic, message.data[ 0 ],  message.data.slice( 0 ) );
		}
	}

	/**
	 * Package private error callback. This is the single point at which
	 * errors are thrown in the client. (Well... that's the intention anyways)
	 *
	 * The expectations would be for implementations to subscribe
	 * to the client's error event to prevent errors from being thrown
	 * and then decide based on the event and topic parameters how
	 * to handle the errors
	 *
	 * IMPORTANT: Errors that are specific to a request, e.g. a RPC
	 * timing out or a record not being permissioned are passed directly
	 * to the method that requested them
	 *
	 * @param   {String} topic One of CONSTANTS.TOPIC
	 * @param   {String} event One of CONSTANTS.EVENT
	 * @param   {String} msg   Error dependent message
	 *
	 * @package private
	 * @returns {void}
	 */
	public _$onError(topic: string, event: string, message: string): void {
		let errorMsg: string;

		/*
		 * Help to diagnose the problem quicker by checking for
		 * some common problems
		 */
		if( event === Events.ACK_TIMEOUT || event === Events.RESPONSE_TIMEOUT ) {
			if( this.getConnectionState() === ConnectionStates.AWAITING_AUTHENTICATION ) {
				errorMsg = 'Your message timed out because you\'re not authenticated. Have you called login()?';
				timeout( this._$onError.bind( this, Events.NOT_AUTHENTICATED, Topics.ERROR, errorMsg ), 1 );
			}
		}

		if( this.hasListeners( 'error' ) ) {
			this.emit( 'error', msg, event, topic );
			this.emit( event, topic, msg );
		} else {
			console.log( '--- You can catch all deepstream errors by subscribing to the error event ---' );

			errorMsg = event + ': ' + msg;

			if( topic ) {
				errorMsg += ' (' + topic + ')';
			}

			throw new Error( errorMsg );
		}
	}

	/**
	 * Passes generic messages from the error topic
	 * to the _$onError handler
	 *
	 * @param {Object} errorMessage parsed deepstream error message
	 *
	 * @private
	 * @returns {void}
	 */
	private _onErrorMessage(errorMessage: string): void {
		this._$onError( errorMessage.topic, errorMessage.data[ 0 ], errorMessage.data[ 1 ] );
	}

	/**
	 * Creates a new options map by extending default
	 * options with the passed in options
	 *
	 * @param   {Object} options The user specified client configuration options
	 *
	 * @private
	 * @returns {Object}	merged options
	 */
	private _mergeWithDefaultOptions(options: DeepstreamUserOptions): DeepstreamOptions {
		let mergedOptions = {};

		for(let key in DefaultOptions ) {
			if( typeof options[ key ] === 'undefined' ) {
				mergedOptions[ key ] = DefaultOptions[ key ];
			} else {
				mergedOptions[ key ] = options[ key ];
			}
		}

		// Freeze the options so it can't be mutated
		Object.freeze(mergedOptions);

		return mergedOptions;
	}
}

/**
 * Exports factory function to adjust to the current JS style of
 * disliking 'new'... pshhh.
 *
 * @param {String} url     URL to connect to. The protocol can be ommited, e.g. <host>:<port>.
 * @param {Object} options A map of options that extend the ones specified in default-options.js
 *
 * @public
 * @returns {void}
 */
export function createDeepstream(url: string, options?: DeepstreamUserOptions): Client {
	return new Client(url, options);
}
