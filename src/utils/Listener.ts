import { Client } from "../Client";
import { Connection } from "../message/Connection";
import { ResubscribeNotifier } from "./ResubscribeNotifier";
import { Actions, Events } from "../constants/Constants";
import { ParsedMessage } from "../message/MessageParser";
import { DeepstreamOptions } from "../DefaultOptions";
import { ScheduledEventHandler, timeout, cancelTimeout } from "./Utils";

/**
 * Creates a listener instance which is usedby deepstream Records and Events.
 *
 * @param {String} type                 One of CONSTANTS.TOPIC
 * @param {String} pattern              A pattern that can be compiled via new RegExp(pattern)
 * @param {Function} callback           The function which is called when pattern was found and removed
 * @param {Connection} Connection       The instance of the server connection
 * @param {Object} options              Deepstream options
 * @param {Client} client               deepstream.io client
 *
 * @constructor
 */
export class Listener {

    private _type: string;
    private _callback: Listener.Callback;
    private _pattern: string;
    private _client: Client;
    private _connection: Connection;
    private _ackTimeout: ScheduledEventHandler;
    private _resubscribeNotifier: ResubscribeNotifier;
    public destroyPending: boolean;

    private get _options(): DeepstreamOptions {
        return this._client.options;
    }

    public constructor(type: string, pattern: string, callback: Listener.Callback, client: Client, connection: Connection) {
        this._type = type;
        this._callback = callback;
        this._pattern = pattern;
        this._client = client;
        this._connection = connection;
        this._ackTimeout = timeout(this._onAckTimeout.bind(this), this._options.subscriptionTimeout);
        this._resubscribeNotifier = new ResubscribeNotifier(client, this._sendListen.bind(this));
        this._sendListen();
        this.destroyPending = false;
    }

    public sendDestroy(): void {
        this.destroyPending = true;
        this._connection.sendMessage(this._type, Actions.UNLISTEN, [this._pattern]);
        this._resubscribeNotifier.destroy();
    }

    /**
     * Resets internal properties. Is called when provider cals unlisten.
     *
     * @returns {void}
     */
    public destroy() {
        this._callback = undefined as any;
        this._pattern = undefined as any;
        this._client = undefined as any;
        this._connection = undefined as any;
    }

    /**
     * Accepting a listener request informs deepstream that the current provider is willing to
     * provide the record or event matching the subscriptionName . This will establish the current
     * provider as the only publisher for the actual subscription with the deepstream cluster.
     * Either accept or reject needs to be called by the listener, otherwise it prints out a deprecated warning.
     *
     * @returns {void}
     */
    public accept(name: string): void {
        this._connection.sendMessage(this._type, Actions.LISTEN_ACCEPT, [this._pattern, name]);
    }

    /**
     *  Rejecting a listener request informs deepstream that the current provider is not willing
     * to provide the record or event matching the subscriptionName . This will result in deepstream
     * requesting another provider to do so instead. If no other provider accepts or exists, the
     * record will remain unprovided.
     * Either accept or reject needs to be called by the listener, otherwise it prints out a deprecated warning.
     *
     * @returns {void}
     */
    public reject(name: string): void {
        this._connection.sendMessage(this._type, Actions.LISTEN_REJECT, [this._pattern, name]);
    }

    /**
     * Wraps accept and reject as an argument for the callback function.
     *
     * @private
     * @returns {Object}
     */
    private _createCallbackResponse(message: ParsedMessage): {
        accept: (name: string) => void,
        reject: (name: string) => void
    } {
        return {
            accept: this.accept.bind(this, message.data[1]),
            reject: this.reject.bind(this, message.data[1])
        }
    }

    /**
     * Handles the incomming message.
     *
     * @private
     * @returns {void}
     */
    public _$onMessage(message: ParsedMessage): void {
        if (message.action === Actions.ACK) {
            cancelTimeout(this._ackTimeout);
        } else if (message.action === Actions.SUBSCRIPTION_FOR_PATTERN_FOUND) {
            this._callback(message.data[1], true, this._createCallbackResponse(message));
        } else if (message.action === Actions.SUBSCRIPTION_FOR_PATTERN_REMOVED) {
            this._callback(message.data[1], false);
        } else {
            this._client._$onError(this._type, Events.UNSOLICITED_MESSAGE, message.data[0] + '|' + message.data[1]);
        }
    }

    /**
     * Sends a Actions.LISTEN to deepstream.
     *
     * @private
     * @returns {void}
     */
    private _sendListen(): void {
        this._connection.sendMessage(this._type, Actions.LISTEN, [this._pattern]);
    }

    /**
     * Sends a Events.ACK_TIMEOUT to deepstream.
     *
     * @private
     * @returns {void}
     */
    private _onAckTimeout(): void {
        this._client._$onError(this._type, Events.ACK_TIMEOUT, 'No ACK message received in time for ' + this._pattern);
    }
}

export namespace Listener {
    export type CallbackResponse = {accept: (name: string) => void, reject: (name: string) => void};
    export type Callback = (event: string, pattern: boolean, callback?: Listener.CallbackResponse) => void;
}
