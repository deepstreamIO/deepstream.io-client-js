import Emitter = require("component-emitter");
import { Client } from "../Client";
import { ParsedMessage } from "../message/MessageParser";
import { Events } from "../constants/Constants";
import { ScheduledEventHandler, timeout } from "./Utils";

/**
 * Subscriptions to events are in a pending state until deepstream acknowledges
 * them. This is a pattern that's used by numerour classes. This registry aims
 * to centralise the functionality necessary to keep track of subscriptions and
 * their respective timeouts.
 *
 * @param {Client} client          The deepstream client
 * @param {String} topic           Constant. One of Topics
 * @param {Number} timeoutDuration The duration of the timeout in milliseconds
 *
 * @extends {EventEmitter}
 * @constructor
 */
export class AckTimeoutRegistry extends Emitter {
	private _client: Client;
	private _topic: string;
	private _timeoutDuration: number;
	private _register: {[key: string]: ScheduledEventHandler};

	public constructor(client: Client, topic: string, timeoutDuration: number) {
		super();

		this._client = client;
		this._topic = topic;
		this._timeoutDuration = timeoutDuration;
		this._register = {};
	}

	/**
	 * Add an entry
	 *
	 * @param {String} name An identifier for the subscription, e.g. a record name or an event name.
	 *
	 * @public
	 * @returns {void}
	 */
	public add(name: string, action: string): void {
		let uniqueName = action ? action + name : name;

		this.remove( name, action );

		this._register[ uniqueName ] = timeout( this._onTimeout.bind( this, uniqueName, name ), this._timeoutDuration );
	}

	/**
	 * Remove an entry
	 *
	 * @param {String} name An identifier for the subscription, e.g. a record name or an event name.
	 *
	 * @public
	 * @returns {void}
	 */
	public remove(name: string, action: string): void {
		let uniqueName = action ? action + name : name;

		if( this._register[ uniqueName ] ) {
			this.clear({ // We can ignore the other parameters and force cast it becuase it doesn't need it.
				data: [ action, name ]
			} as ParsedMessage);
		}
	}

	/**
	 * Processes an incoming ACK-message and removes the corresponding subscription
	 *
	 * @param   {Object} message A parsed deepstream ACK message
	 *
	 * @public
	 * @returns {void}
	 */
	public clear(message: ParsedMessage) {
		let name = message.data[ 1 ];
		let uniqueName = message.data[ 0 ] + name;
		let timeout =  this._register[ uniqueName ] || this._register[ name ];

		if( timeout ) {
			cancelTimeout( timeout );
		} else {
			this._client._$onError( this._topic, Events.UNSOLICITED_MESSAGE, message.raw );
		}
	}

	/**
	 * Will be invoked if the timeout has occured before the ack message was received
	 *
	 * @param {String} name An identifier for the subscription, e.g. a record name or an event name.
	 *
	 * @private
	 * @returns {void}
	 */
	public _onTimeout(uniqueName: string, name: string): void {
		delete this._register[ uniqueName ];
		let msg = 'No ACK message received in time for ' + name;
		this._client._$onError( this._topic, Events.ACK_TIMEOUT, msg );
		this.emit( 'timeout', name );
	}
}
