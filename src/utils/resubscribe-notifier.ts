import { Client } from "../client";
/**
 * Makes sure that all functionality is resubscribed on reconnect. Subscription is called
 * when the connection drops - which seems counterintuitive, but in fact just means
 * that the re-subscription message will be added to the queue of messages that
 * need re-sending as soon as the connection is re-established.
 *
 * Resubscribe logic should only occur once per connection loss
 *
 * @param {Client} client          The deepstream client
 * @param {Function} reconnect     Function to call to allow resubscribing
 *
 * @constructor
 */
export class ResubscribeNotifier {
	private _client: Client;
	private _resubscribe: () => void;
	private _isReconnecting: boolean;
	private _connectionStateChangeHandler: () => void;

	public constructor(client: Client, resubscribe: () => void) {
		this._client = client;
		this._resubscribe = resubscribe;

		this._isReconnecting = false;
		this._connectionStateChangeHandler = this._handleConnectionStateChanges.bind( this );
		this._client.on( 'connectionStateChanged', this._connectionStateChangeHandler );
	}

	/**
	 * Call this whenever this functionality is no longer needed to remove links
	 *
	 * @returns {void}
	 */
	public destroy(): void {
		this._client.removeListener( 'connectionStateChanged', this._connectionStateChangeHandler );
		this._connectionStateChangeHandler = undefined as any;
		this._client = undefined as any;
	}

	/**
	 * Check whenever the connection state changes if it is in reconnecting to resubscribe
	 * @private
	 * @returns {void}
	 */
	private _handleConnectionStateChanges(): void {
		var state = this._client.getConnectionState();

		if( state === C.CONNECTION_STATE.RECONNECTING && this._isReconnecting === false ) {
			this._isReconnecting = true;
		}
		if( state === C.CONNECTION_STATE.OPEN && this._isReconnecting === true ) {
			this._isReconnecting = false;
			this._resubscribe();
		}
	}
}
