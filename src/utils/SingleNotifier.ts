import { Connection } from "../message/Connection";
import { Client } from "../Client";
import { ResubscribeNotifier } from "./ResubscribeNotifier";
import { timeout, ScheduledEventHandler, cancelTimeout } from "./Utils";
import { Events } from "../constants/Constants";

/**
 * Provides a scaffold for subscriptionless requests to deepstream, such as the SNAPSHOT
 * and HAS functionality. The SingleNotifier multiplexes all the client requests so
 * that they can can be notified at once, and also includes reconnection funcionality
 * incase the connection drops.
 *
 * @param {Client} client          The deepstream client
 * @param {Connection} connection  The deepstream connection
 * @param {String} topic           Constant. One of Topics
 * @param {String} action          Constant. One of Actions
 * @param {Number} timeoutDuration The duration of the timeout in milliseconds
 *
 * @constructor
 */
export class SingleNotifier {
	private _client: Client;
	private _connection: Connection;
	private _topic: string;
	private _action: string;
	private _timeoutDuration: number;
	private _requests: {[key: string]: SingleNotifier.Request[]};
	private _resubscribeNotifier: ResubscribeNotifier;

	public constructor(client: Client, connection: Connection, topic: string, action: string, timeoutDuration: number) {
		this._client = client;
		this._connection = connection;
		this._topic = topic;
		this._action = action;
		this._timeoutDuration = timeoutDuration;
		this._requests = {};
		this._resubscribeNotifier = new ResubscribeNotifier( this._client, this._resendRequests.bind( this ) );
	}

	/**
	 * Check if there is a request pending with a specified name
	 *
	 * @param {String} name An identifier for the request, e.g. a record name
	 *
	 * @public
	 * @returns {Boolean}
	 */
	public hasRequest(name: string): boolean {
		return !!this._requests[ name ];
	}

	/**
	 * Add a request. If one has already been made it will skip the server request
	 * and multiplex the response
	 *
	 * @param {String} name An identifier for the request, e.g. a record name

	 *
	 * @public
	 * @returns {void}
	 */
	public request(name: string): Promise<any> {
		let responseTimeout: ScheduledEventHandler;
		let resolve: ((value: any) => void) | undefined,
			revoke: ((error: string) => void) | undefined;
		let promise = new Promise((res, rev) => { resolve = res; revoke = rev; });

		if( !this._requests[ name ] ) {
			this._requests[ name ] = [];
			this._connection.sendMessage( this._topic, this._action, [ name ] );
		}

		responseTimeout = timeout( this._onResponseTimeout.bind( this, name ), this._timeoutDuration );
		if (resolve && revoke) {
			this._requests[ name ].push({
				timeout: responseTimeout,
				resolve: resolve,
				revoke: revoke
			});
		} else {
			throw new Error("No resolve and revoke.");
		}

		return promise;
	}

	/**
	 * Process a response for a request. This has quite a flexible API since callback functions
	 * differ greatly and helps maximise reuse.
	 *
	 * @param {String} name An identifier for the request, e.g. a record name
	 * @param {String} error Error message
	 * @param {Object} data If successful, the response data
	 *
	 * @public
	 * @returns {void}
	 */
	public receive(name: string, error: string, data: any): void {
		let entries = this._requests[ name ];

		if( !entries ) {
			this._client._$onError( this._topic, Events.UNSOLICITED_MESSAGE, 'no entry for ' + name );
			return;
		}

		for(let i = 0; i < entries.length; i++ ) {
			let entry = entries[ i ];
			cancelTimeout( entry.timeout );
			if (error) {
				entry.revoke(error);
			} else {
				entry.resolve(data);
			}
		}

		delete this._requests[ name ];
	}

	/**
	 * Will be invoked if a timeout occurs before a response arrives from the server
	 *
	 * @param {String} name An identifier for the request, e.g. a record name
	 *
	 * @private
	 * @returns {void}
	 */
	private _onResponseTimeout(name: string): void {
		let msg = 'No response received in time for ' + this._topic + '|' + this._action + '|' + name;
		this._client._$onError( this._topic, Events.RESPONSE_TIMEOUT, msg );
	}

	/**
	 * Resends all the requests once the connection is back up
	 *
	 * @private
	 * @returns {void}
	 */
	private _resendRequests(): void {
		for(let request in this._requests) {
			this._connection.sendMessage( this._topic, this._action, [ this._requests[ request ] ] );
		}
	}
}

export namespace SingleNotifier {
	export interface Request {
		timeout: ScheduledEventHandler;
		resolve: (value: any) => void;
		revoke: (error: string) => void;
	}
}
