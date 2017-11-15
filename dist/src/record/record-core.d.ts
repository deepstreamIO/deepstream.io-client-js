import { Services } from '../client';
import { Options } from '../client-options';
import { MergeStrategy } from './merge-strategy';
import { RecordMessage, RecordWriteMessage } from '../../binary-protocol/src/message-constants';
import * as Emitter from 'component-emitter2';
import * as utils from '../util/utils';
import { Record } from './record';
import { AnonymousRecord } from './anonymous-record';
import { List } from './list';
export declare type WriteAckCallback = (error: string | null) => void;
export declare const enum RECORD_STATE {
    INITIAL = 0,
    SUBSCRIBING = 1,
    RESUBSCRIBING = 2,
    LOADING_OFFLINE = 3,
    READY = 4,
    MERGING = 5,
    UNSUBSCRIBING = 6,
    UNSUBSCRIBED = 7,
    DELETING = 8,
    DELETED = 9,
    ERROR = 10,
}
export declare class RecordCore extends Emitter {
    name: string;
    isReady: boolean;
    hasProvider: boolean;
    version: number;
    private references;
    private services;
    private options;
    private emitter;
    private data;
    private mergeStrategy;
    private writeCallbacks;
    private stateMachine;
    private responseTimeout;
    private discardTimeout;
    private deletedTimeout;
    private offlineDirty;
    private deleteResponse;
    private whenComplete;
    constructor(name: string, services: Services, options: Options, whenComplete: (recordName: string) => void);
    readonly recordState: RECORD_STATE;
    usages: number;
    /**
   * Convenience method, similar to promises. Executes callback
   * whenever the record is ready, either immediatly or once the ready
   * event is fired
   * @param   {[Function]} callback Will be called when the record is ready
   */
    whenReady(context: null | List | Record | AnonymousRecord, callback?: (context: any) => void): Promise<any> | void;
    /**
   * Sets the value of either the entire dataset
   * or of a specific path within the record
   * and submits the changes to the server
   *
   * If the new data is equal to the current data, nothing will happen
   *
   * @param {[String|Object]} pathOrData Either a JSON path when called with
   *                                     two arguments or the data itself
   * @param {Object} data     The data that should be stored in the record
   */
    set({path, data, callback}: utils.RecordSetArguments): void;
    /**
     * Wrapper function around the record.set that returns a promise
     * if no callback is supplied.
     * @returns {Promise} if a callback is omitted a Promise is returned with the result of the write
     */
    setWithAck(args: utils.RecordSetArguments): Promise<void> | void;
    /**
   * Returns a copy of either the entire dataset of the record
   * or - if called with a path - the value of that path within
   * the record's dataset.
   *
   * Returning a copy rather than the actual value helps to prevent
   * the record getting out of sync due to unintentional changes to
   * its data
   */
    get(path?: string): any;
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
   */
    subscribe(args: utils.RecordSubscribeArguments): void;
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
     * @param   {String}           path  A JSON path
     * @param   {Function}         callback     The callback method. Please note, if a bound
     *                                          method was passed to subscribe, the same method
     *                                          must be passed to unsubscribe as well.
     */
    unsubscribe(args: utils.RecordSubscribeArguments): void;
    /**
    * Removes all change listeners and notifies the server that the client is
    * no longer interested in updates for this record
    */
    discard(): void;
    /**
     * Deletes the record on the server.
     */
    delete(callback?: (error: string | null) => void): Promise<void> | void;
    /**
     * Set a merge strategy to resolve any merge conflicts that may occur due
     * to offline work or write conflicts. The function will be called with the
     * local record, the remote version/data and a callback to call once the merge has
     * completed or if an error occurs ( which leaves it in an inconsistent state until
     * the next update merge attempt ).
     */
    setMergeStrategy(mergeStrategy: MergeStrategy): void;
    /**
     * Transition States
     */
    private onSubscribing();
    private onResubscribing();
    private onOfflineLoading();
    private onReady();
    private onUnsubscribed();
    private onDeleted();
    handle(message: RecordMessage): void;
    private sendRead();
    private handleWriteAcknowledgements(message);
    private saveUpdate();
    private sendUpdate(path, data, writeSuccess);
    /**
     * Applies incoming updates and patches to the record's dataset
     */
    applyUpdate(message: RecordWriteMessage): void;
    /**
     * Compares the new values for every path with the previously stored ones and
     * updates the subscribers if the value has changed
     */
    private applyChange(newData);
    /**
     * If connected sends the delete message to server, otherwise
     * we delete in local storage and transition to delete success.
     */
    private sendDelete();
    /**
     * Called when a merge conflict is detected by a VERSION_EXISTS error or if an update recieved
     * is directly after the clients. If no merge strategy is configure it will emit a VERSION_EXISTS
     * error and the record will remain in an inconsistent state.
     *
     * @param   {Number} remoteVersion The remote version number
     * @param   {Object} remoteData The remote object data
     * @param   {Object} message parsed and validated deepstream message
     */
    private recoverRecord(remoteVersion, remoteData, message);
    /**
   * Callback once the record merge has completed. If successful it will set the
   * record state, else emit and error and the record will remain in an
   * inconsistent state until the next update.
   *
   * @param   {Number} remoteVersion The remote version number
   * @param   {Object} remoteData The remote object data
   * @param   {Object} message parsed and validated deepstream message
   */
    private onRecordRecovered(remoteVersion, remoteData, message, error, data);
    /**
   * A quick check that's carried out by most methods that interact with the record
   * to make sure it hasn't been destroyed yet - and to handle it gracefully if it has.
   */
    private checkDestroyed(methodName);
    private setupWriteCallback(version, callback);
    /**
     * Destroys the record and nulls all
     * its dependencies
     */
    private destroy();
}
