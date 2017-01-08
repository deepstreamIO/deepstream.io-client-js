import { DeepstreamOptions } from "../DefaultOptions";
import { Client } from "../Client";
import { Events } from "../constants/Constants";
import { MessageParser } from "../message/MessageParser";
/**
 * This class represents a single remote procedure
 * call made from the client to the server. It's main function
 * is to encapsulate the logic around timeouts and to convert the
 * incoming response data
 *
 * @param {Object}   options  deepstream client config
 * @param {Function} callback the function that will be called once the request is complete or failed
 * @param {Client} client
 *
 * @constructor
 */
export class RPC {
	private _client: Client;
	private _callback: RPC.Callback;
	private _ackTimeout: number;
	private _responseTimeout: number;

	private get _options(): DeepstreamOptions { return this._client.options; }

	public constructor(client: Client, callback: RPC.Callback) {
		this._client = client;
		this._callback = callback;
		this._ackTimeout = setTimeout( this.error.bind( this, Events.ACK_TIMEOUT ), this._options.rpcAckTimeout );
		this._responseTimeout = setTimeout( this.error.bind( this, Events.RESPONSE_TIMEOUT ), this._options.rpcResponseTimeout );
	}

	/**
	 * Called once an ack message is received from the server
	 *
	 * @public
	 * @returns {void}
	 */
	public ack(): void {
		clearTimeout( this._ackTimeout );
	}

	/**
	 * Called once a response message is received from the server.
	 * Converts the typed data and completes the request
	 *
	 * @param   {String} data typed value
	 *
	 * @public
	 * @returns {void}
	 */
	public respond(data: string): void {
		let convertedData = MessageParser.convertTyped( data, this._client );
		this._callback( undefined, convertedData );
		this._complete();
	}

	/**
	 * Callback for error messages received from the server. Once
	 * an error is received the request is considered completed. Even
	 * if a response arrives later on it will be ignored / cause an
	 * UNSOLICITED_MESSAGE error
	 *
	 * @param   {String} errorMsg @TODO should be CODE and message
	 *
	 * @public
	 * @returns {void}
	 */
	public error(errorMessage: string): void {
		this._callback( errorMessage );
		this._complete();
	}

	/**
	 * Called after either an error or a response
	 * was received
	 *
	 * @private
	 * @returns {void}
	 */
	private _complete(): void {
		clearTimeout( this._ackTimeout );
		clearTimeout( this._responseTimeout );
	}
}

export namespace RPC {
	export type Callback = (error?: string, result?: any) => void;
}
