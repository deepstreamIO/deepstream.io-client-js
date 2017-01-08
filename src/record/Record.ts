import { Client } from "../Client";
import { Connection } from "../message/Connection";
import { MergeStrategy } from "../constants/MergeStrategies";
import { JSONPath } from "./JSONPath";
import { ConnectionStates, Events } from "../constants/Constants";
import { ParsedMessage } from "../message/MessageParser";
import Emitter = require("component-emitter");

/**
 * This class represents a single record - an observable
 * dataset returned by client.record.getRecord()
 *
 * @extends {EventEmitter}
 *
 * @param {String} name                The unique name of the record
 * @param {Object} recordOptions        A map of options, e.g. { persist: true }
 * @param {Connection} Connection        The instance of the server connection
 * @param {Object} options                Deepstream options
 * @param {Client} client                deepstream.io client
 *
 * @constructor
 */
export class Record extends Emitter {

    public name?: string;
    public usages: number;
    private _recordOptions: any; // TODO: Type
    private _connection?: Connection;
    private _client?: Client;
    private _options: any; // TODO: Type
    public isReady: boolean;
    public isDestroyed: boolean;
    public hasProvider: boolean;
    private _$data: any; // TODO: Type
    private version: any; // TODO: Type
    private _eventEmitter: Emitter;
    private _queuedMethodCalls: any[]; // TODO: Type
    private _writeCallbacks: {[key: string]: any}; // TODO: Type
    private _mergeStrategy?: MergeStrategy; // TODO: Type
    private _resubscribeNotifier: any; // TODO: Type
    private _readAckTimeout: number;
    private _readTimeout: number;

    public constructor();
    public constructor(name: string, recordOptions: any, connection: Connection, options: any, client: Client);
    public constructor(name?: string, recordOptions?: any, connection?: Connection, options?: any, client?: Client) {
        super();

        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('invalid argument name');
        }

        this.name = name;
        this.usages = 0;
        this._recordOptions = recordOptions;
        this._connection = connection;
        this._client = client;
        this._options = options;
        this.isReady = false;
        this.isDestroyed = false;
        this.hasProvider = false;
        this._$data = Object.create(null);
        this.version = null;
        this._eventEmitter = new Emitter();
        this._queuedMethodCalls = [];
        this._writeCallbacks = {};

        this._mergeStrategy = undefined;
        if (options.mergeStrategy) {
            this.setMergeStrategy(options.mergeStrategy);
        }

        this._resubscribeNotifier = new ResubscribeNotifier(this._client, this._sendRead.bind(this));
        this._readAckTimeout = setTimeout(this._onTimeout.bind(this, Events.ACK_TIMEOUT), this._options.recordReadAckTimeout);
        this._readTimeout = setTimeout(this._onTimeout.bind(this, Events.RESPONSE_TIMEOUT), this._options.recordReadTimeout);
        this._sendRead();
    }

    /**
     * Set a merge strategy to resolve any merge conflicts that may occur due
     * to offline work or write conflicts. The function will be called with the
     * local record, the remote version/data and a callback to call once the merge has
     * completed or if an error occurs ( which leaves it in an inconsistent state until
     * the next update merge attempt ).
     *
     * @param   {Function} mergeStrategy A Function that can resolve merge issues.
     *
     * @public
     * @returns {void}
     */
    public setMergeStrategy(mergeStrategy: MergeStrategy): void {
        if (typeof mergeStrategy === 'function') {
            this._mergeStrategy = mergeStrategy;
        } else {
            throw new Error('Invalid merge strategy: Must be a Function');
        }
    }

    /**
     * Returns a copy of either the entire dataset of the record
     * or - if called with a path - the value of that path within
     * the record's dataset.
     *
     * Returning a copy rather than the actual value helps to prevent
     * the record getting out of sync due to unintentional changes to
     * its data
     *
     * @param   {[String]} path A JSON path, e.g. users[ 2 ].firstname
     *
     * @public
     * @returns {Mixed} value
     */
    public get(path?: JSONPath): any {
        return jsonPath.get(this._$data, path, this._options.recordDeepCopy);
    }

    /**
     * Sets the value of either the entire dataset
     * or of a specific path within the record
     * and submits the changes to the server
     *
     * If the new data is equal to the current data, nothing will happen
     *
     * @public
     * @returns {void}
     */
    public set(path: JSONPath, data: any): void;
    public set(data: any): void;
    public set(pathOrData: JSONPath | any, dataOrUndefined?: any): Promise<void> { // TODO: Callback type
        let path: JSONPath | undefined,
            data: any;

        if (arguments.length === 1) { // set( object )
            if (typeof pathOrData !== 'object')
                throw new Error('invalid argument data');
            data = pathOrData;
        } else if (typeof pathOrData === 'string' && pathOrData.length !== 0 && typeof dataOrUndefined !== 'undefined') { // set( path, data )
            path = pathOrData;
            data = undefined;
        } else {
            throw new Error('invalid argument path');
        }

        // Create the promise
        let resolve: (() => void) | undefined, revoke: ((error: string) => void) | undefined;
        let promise = new Promise((res, rev) => {
            resolve = res;
            revoke = rev;
        });

        if (this._checkDestroyed('set')) {
            if (revoke) revoke('Record destroyed');
            return promise;
        }

        if (!this.isReady) {
            this._queuedMethodCalls.push({method: 'set', args: arguments});
            if (revoke) revoke('Not ready');
            return promise;
        }

        let oldValue = this._$data;
        let newValue = jsonPath.set(oldValue, path, data, this._options.recordDeepCopy);

        if (oldValue === newValue) {
            if (revoke) revoke('No change.');
            return promise;
        }

        let config: any; // TODO: Type
        if (resolve) {
            config = {};
            config.writeSuccess = true;
            this._setUpCallback(this.version, resolve);
            let connectionState = this._client.getConnectionState();
            if (connectionState === ConnectionStates.CLOSED || connectionState === ConnectionStates.RECONNECTING) {
                revoke('Connection error: error updating record as connection was closed');
            }
        } else {
            throw new Error("No resolve.");
        }
        this._sendUpdate(path, data, config);
        this._applyChange(newValue);
        return promise;
    }

    /**
     * Subscribes to changes to the records dataset.
     *
     * Callback is the only mandatory argument.
     *
     * When called with a path, it will only subscribe to updates
     * to that path, rather than the entire record
     *
     * If called with true for triggerNow, the callback will
     * be called immediatly with the current value
     *
     * @param   {[String]}        path            A JSON path within the record to subscribe to
     * @param   {Function}        callback        Callback function to notify on changes
     * @param   {[Boolean]}        triggerNow      A flag to specify whether the callback should be invoked immediatly
     *                                        with the current value
     *
     * @public
     * @returns {void}
     */
    public subscribe(path: JSONPath, callback: Record.SubscribeCallback): void;
    public subscribe(callback: Record.SubscribeCallback): void;
    public subscribe(...pathAndCallback: any[]): void {
        let args = this._normalizeArguments(pathAndCallback);

        if (args.path !== undefined && ( typeof args.path !== 'string' || args.path.length === 0 )) {
            throw new Error('invalid argument path');
        }
        if (typeof args.callback !== 'function') {
            throw new Error('invalid argument callback');
        }

        if (this._checkDestroyed('subscribe')) {
            return;
        }

        if (args.triggerNow) {
            this.whenReady(function () {
                this._eventEmitter.on(args.path, args.callback);
                args.callback(this.get(args.path));
            }.bind(this));
        } else {
            this._eventEmitter.on(args.path, args.callback);
        }
    }

    /**
     * Removes a subscription that was previously made using record.subscribe()
     *
     * Can be called with a path to remove the callback for this specific
     * path or only with a callback which removes it from the generic subscriptions
     *
     * Please Note: unsubscribe is a purely client side operation. If the app is no longer
     * interested in receiving updates for this record from the server it needs to call
     * discard instead
     *
     * @param   {[String|Function]}   pathOrCallback A JSON path
     * @param   {Function}              callback    The callback method. Please note, if a bound method was passed to
     *                                                subscribe, the same method must be passed to unsubscribe as well.
     *
     * @public
     * @returns {void}
     */
    public unsubscribe(path: JSONPath, callback: Record.SubscribeCallback): void;
    public unsubscribe(callback: Record.SubscribeCallback): void;
    public unsubscribe(pathAndCallback: any[]): void {
        var args = this._normalizeArguments(pathAndCallback);

        if (args.path !== undefined && ( typeof args.path !== 'string' || args.path.length === 0 )) {
            throw new Error('invalid argument path');
        }
        if (args.callback !== undefined && typeof args.callback !== 'function') {
            throw new Error('invalid argument callback');
        }

        if (this._checkDestroyed('unsubscribe')) {
            return;
        }
        this._eventEmitter.off(args.path, args.callback);
    }

    /**
     * Removes all change listeners and notifies the server that the client is
     * no longer interested in updates for this record
     *
     * @public
     * @returns {void}
     */
    public discard(): void {
        if (this._checkDestroyed('discard')) {
            return;
        }
        this.whenReady(function () {
            this.usages--;
            if (this.usages <= 0) {
                this.emit('destroyPending');
                this._discardTimeout = setTimeout(this._onTimeout.bind(this, Events.ACK_TIMEOUT), this._options.subscriptionTimeout);
                this._connection.sendMsg(Topics.RECORD, Actions.UNSUBSCRIBE, [this.name]);
            }
        }.bind(this));
    }

    /**
     * Deletes the record on the server.
     *
     * @public
     * @returns {void}
     */
    public delete(): void {
        if (this._checkDestroyed('delete')) {
            return;
        }
        this.whenReady(function () {
            this.emit('destroyPending');
            this._deleteAckTimeout = setTimeout(this._onTimeout.bind(this, Events.DELETE_TIMEOUT), this._options.recordDeleteTimeout);
            this._connection.sendMsg(Topics.RECORD, Actions.DELETE, [this.name]);
        }.bind(this));
    }

    /**
     * Convenience method, similar to promises. Executes callback
     * whenever the record is ready, either immediatly or once the ready
     * event is fired
     *
     * @param   {Function} callback Will be called when the record is ready
     *
     * @returns {void}
     */
    public whenReady(callback: () => void): void {
        if (this.isReady === true) {
            callback(this);
        } else {
            this.once('ready', callback.bind(this, this));
        }
    }

    /**
     * Callback for incoming messages from the message handler
     *
     * @param   {Object} message parsed and validated deepstream message
     *
     * @package private
     * @returns {void}
     */
    private _$onMessage(message: ParsedMessage): void {
        if (message.action === Actions.READ) {
            if (this.version === null) {
                clearTimeout(this._readTimeout);
                this._onRead(message);
            } else {
                this._applyUpdate(message, this._client);
            }
        }
        else if (message.action === Actions.ACK) {
            this._processAckMessage(message);
        }
        else if (message.action === Actions.UPDATE || message.action === Actions.PATCH) {
            this._applyUpdate(message, this._client);
        }
        else if (message.action === Actions.WRITE_ACKNOWLEDGEMENT) {
            var versions = JSON.parse(message.data[1]);
            for (var i = 0; i < versions.length; i++) {
                var callback = this._writeCallbacks[versions[i]];
                if (callback !== undefined) {
                    callback(messageParser.convertTyped(message.data[2], this._client))
                    delete this._writeCallbacks[versions[i]];
                }
            }
        }
        // Otherwise it should be an error, and dealt with accordingly
        else if (message.data[0] === Events.VERSION_EXISTS) {
            this._recoverRecord(message.data[2], JSON.parse(message.data[3]), message);
        }
        else if (message.data[0] === Events.MESSAGE_DENIED) {
            this._clearTimeouts();
        } else if (message.action === Actions.SUBSCRIPTION_HAS_PROVIDER) {
            var hasProvider = messageParser.convertTyped(message.data[1], this._client);
            this.hasProvider = hasProvider;
            this.emit('hasProviderChanged', hasProvider);
        }
    }

    /**
     * Called when a merge conflict is detected by a VERSION_EXISTS error or if an update recieved
     * is directly after the clients. If no merge strategy is configure it will emit a VERSION_EXISTS
     * error and the record will remain in an inconsistent state.
     *
     * @param   {Number} remoteVersion The remote version number
     * @param   {Object} remoteData The remote object data
     * @param   {Object} message parsed and validated deepstream message
     *
     * @private
     * @returns {void}
     */
    private _recoverRecord(remoteVersion: number, remoteData: any, message: ParsedMessage): void {
        message.processedError = true;
        if (this._mergeStrategy) {
            this._mergeStrategy(this, remoteData, remoteVersion, this._onRecordRecovered.bind(this, remoteVersion, remoteData, message));
        }
        else {
            this.emit('error', Events.VERSION_EXISTS, 'received update for ' + remoteVersion + ' but version is ' + this.version);
        }
    }

    private _sendUpdate(path: string | undefined, data: any, config: any): void { // TODO: Config type
        this.version++;
        let msgData: string[];
        if (!path) {
            msgData = config === undefined ?
                [this.name, this.version, data] :
                [this.name, this.version, data, config];
            this._connection.sendMessage(Topics.RECORD, Actions.UPDATE, msgData);
        } else {
            msgData = config === undefined ?
                [this.name, this.version, path, messageBuilder.typed(data)] :
                [this.name, this.version, path, messageBuilder.typed(data), config];
            this._connection.sendMessage(Topics.RECORD, Actions.PATCH, msgData);
        }
    }

    /**
     * Callback once the record merge has completed. If successful it will set the
     * record state, else emit and error and the record will remain in an
     * inconsistent state until the next update.
     *
     * @param   {Number} remoteVersion The remote version number
     * @param   {Object} remoteData The remote object data
     * @param   {Object} message parsed and validated deepstream message
     *
     * @private
     * @returns {void}
     */
    private _onRecordRecovered(remoteVersion: number, remoteData: any, message: ParsedMessage, error: string, data: any): void {
        if (!error) {
            let oldVersion = this.version;
            this.version = remoteVersion;

            let oldValue = this._$data;
            let newValue = jsonPath.set(oldValue, undefined, data, false);
            if (oldValue === newValue) {
                return;
            }

            let config = message.data[4];
            if (config && JSON.parse(config).writeSuccess) {
                let callback = this._writeCallbacks[oldVersion];
                delete this._writeCallbacks[oldVersion];
                this._setUpCallback(this.version, callback)
            }
            this._sendUpdate(undefined, data, config);
            this._applyChange(newValue);
        } else {
            this.emit('error', Events.VERSION_EXISTS, 'received update for ' + remoteVersion + ' but version is ' + this.version);
        }
    }

    /**
     * Callback for ack-messages. Acks can be received for
     * subscriptions, discards and deletes
     *
     * @param   {Object} message parsed and validated deepstream message
     *
     * @private
     * @returns {void}
     */
    private processAckMessage(message: ParsedMessage) {
        let acknowledgedAction = message.data[0];

        if (acknowledgedAction === Actions.SUBSCRIBE) {
            clearTimeout(this._readAckTimeout);
        }

        else if (acknowledgedAction === Actions.DELETE) {
            this.emit('delete');
            this._destroy();
        }

        else if (acknowledgedAction === Actions.UNSUBSCRIBE) {
            this.emit('discard');
            this._destroy();
        }
    }

    /**
     * Applies incoming updates and patches to the record's dataset
     *
     * @param   {Object} message parsed and validated deepstream message
     *
     * @private
     * @returns {void}
     */
    private _applyUpdate(message: ParsedMessage): void {
        let version = parseInt(message.data[1], 10);
        let data;
        if (message.action === Actions.PATCH) {
            data = messageParser.convertTyped(message.data[3], this._client);
        } else {
            data = JSON.parse(message.data[2]);
        }

        if (this.version === null) {
            this.version = version;
        }
        else if (this.version + 1 !== version) {
            if (message.action === Actions.PATCH) {
                /**
                 * Request a snapshot so that a merge can be done with the read reply which contains
                 * the full state of the record
                 **/
                this._connection.sendMsg(Topics.RECORD, Actions.SNAPSHOT, [this.name]);
            } else {
                this._recoverRecord(version, data, message);
            }
            return;
        }

        this.version = version;
        this._applyChange(jsonPath.set(this._$data, message.action === Actions.PATCH ? message.data[2] : undefined, data));
    }

    /**
     * Callback for incoming read messages
     *
     * @param   {Object} message parsed and validated deepstream message
     *
     * @private
     * @returns {void}
     */
    private _onRead(message: ParsedMessage): void {
        this.version = parseInt(message.data[1], 10);
        this._applyChange(jsonPath.set(this._$data, undefined, JSON.parse(message.data[2])));
        this._setReady();
    }

    /**
     * Invokes method calls that where queued while the record wasn't ready
     * and emits the ready event
     *
     * @private
     * @returns {void}
     */
    private _setReady() {
        this.isReady = true;
        for (let i = 0; i < this._queuedMethodCalls.length; i++) {
            this[this._queuedMethodCalls[i].method].apply(this, this._queuedMethodCalls[i].args);
        }
        this._queuedMethodCalls = [];
        this.emit('ready');
    }

    private _setUpCallback(currentVersion: number, callback: () => void): void {
        var newVersion = Number(this.version) + 1;
        this._writeCallbacks[newVersion] = callback;
    }

    /**
     * Sends the read message, either initially at record
     * creation or after a lost connection has been re-established
     *
     * @private
     * @returns {void}
     */
    private _sendRead() {
        this._connection.sendMsg(Topics.RECORD, Actions.CREATEORREAD, [this.name]);
    }

    /**
     * Compares the new values for every path with the previously stored ones and
     * updates the subscribers if the value has changed
     *
     * @private
     * @returns {void}
     */
    private _applyChange(newData: any): void {
        if (this.isDestroyed) {
            return;
        }

        let oldData = this._$data;
        this._$data = newData;

        if (!this._eventEmitter._callbacks) {
            return;
        }

        let paths = Object.keys(this._eventEmitter._callbacks);

        for (let i = 0; i < paths.length; i++) {
            let newValue = jsonPath.get(newData, paths[i], false);
            let oldValue = jsonPath.get(oldData, paths[i], false);

            if (newValue !== oldValue) {
                this._eventEmitter.emit(paths[i], this.get(paths[i]));
            }
        }
    }

    /**
     * Creates a map based on the types of the provided arguments
     *
     * @param {Arguments} args
     *
     * @private
     * @returns {Object} arguments map
     */
    private _normalizeArguments(args: any[]): {path?: string, triggerNow: boolean} {
        // If arguments is already a map of normalized parameters
        // (e.g. when called by AnonymousRecord), just return it.
        if (args.length === 1 && typeof args[0] === 'object') {
            return args[0];
        }

        let result = {
            path: undefined,
            triggerNow: false
        };

        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === 'string') {
                result.path = args[i];
            }
            else if (typeof args[i] === 'function') {
                result.callback = args[i];
            }
            else if (typeof args[i] === 'boolean') {
                result.triggerNow = args[i];
            }
        }

        return result;
    }

    /**
     * Clears all timeouts that are set when the record is created
     *
     * @private
     * @returns {void}
     */
    private _clearTimeouts() {
        clearTimeout(this._readAckTimeout);
        clearTimeout(this._deleteAckTimeout);
        clearTimeout(this._discardTimeout);
        clearTimeout(this._deleteAckTimeout);
    }

    /**
     * A quick check that's carried out by most methods that interact with the record
     * to make sure it hasn't been destroyed yet - and to handle it gracefully if it has.
     *
     * @param   {String} methodName The name of the method that invoked this check
     *
     * @private
     * @returns {Boolean} is destroyed
     */
    private _checkDestroyed(methodName: string): boolean {
        if (this.isDestroyed) {
            this.emit('error', 'Can\'t invoke \'' + methodName + '\'. Record \'' + this.name + '\' is already destroyed');
            return true;
        }

        return false;
    }

    /**
     * Generic handler for ack, read and delete timeouts
     *
     * @private
     * @returns {void}
     */
    private _onTimeout(timeoutType: string) {
        this._clearTimeouts();
        this.emit('error', timeoutType);
    }

    /**
     * Destroys the record and nulls all
     * its dependencies
     *
     * @private
     * @returns {void}
     */
    private _destroy(): void {
        this._clearTimeouts();
        this._eventEmitter.off();
        this._resubscribeNotifier.destroy();
        this.isDestroyed = true;
        this.isReady = false;
        this._client = undefined;
        this._eventEmitter = null;
        this._connection = undefined;
    }
}

export namespace Record {
    export type SubscribeCallback = (value: any) => void;
}
