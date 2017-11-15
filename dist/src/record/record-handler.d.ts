import { Services } from '../client';
import { Options } from '../client-options';
import { WriteAckCallback } from './record-core';
import { Record } from './record';
import { AnonymousRecord } from './anonymous-record';
import { List } from './list';
import { Listener, ListenCallback } from '../util/listener';
export declare class RecordHandler {
    private services;
    private emitter;
    private options;
    private listener;
    private recordCores;
    private readRegistry;
    private headRegistry;
    private writeAckNotifier;
    constructor(services: Services, options: Options, listener?: Listener);
    /**
   * Returns an existing record or creates a new one.
   *
   * @param   {String} name              the unique name of the record
   */
    getRecord(name: string): Record;
    /**
     * Returns an existing List or creates a new one. A list is a specialised
     * type of record that holds an array of recordNames.
     *
     * @param   {String} name       the unique name of the list
     */
    getList(name: string): List;
    /**
     * Returns an anonymous record. A anonymous record is effectively
     * a wrapper that mimicks the API of a record, but allows for the
     * underlying record to be swapped without loosing subscriptions etc.
     *
     * This is particularly useful when selecting from a number of similarly
     * structured records. E.g. a list of users that can be choosen from a list
     *
     * The only API difference to a normal record is an additional setName( name ) method.
     */
    getAnonymousRecord(): AnonymousRecord;
    /**
     * Allows to listen for record subscriptions made by this or other clients. This
     * is useful to create "active" data providers, e.g. providers that only provide
     * data for a particular record if a user is actually interested in it
     *
     * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
     * @param   {Function} callback
     */
    listen(pattern: string, callback: ListenCallback): void;
    /**
     * Removes a listener that was previously registered with listenForSubscriptions
     *
     * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
     */
    unlisten(pattern: string): void;
    /**
     * Retrieve the current record data without subscribing to changes
     *
     * @param   {String}  name the unique name of the record
     * @param   {Function}  callback
     */
    snapshot(name: string): Promise<number>;
    snapshot(name: string, callback: (error: string | null, data: any) => void): void;
    /**
     * Allows the user to query to see whether or not the record exists.
     *
     * @param   {String}  name the unique name of the record
     * @param   {Function}  callback
     */
    has(name: string): Promise<boolean>;
    has(name: string, callback: (error: string | null, has: boolean | null) => void): void;
    /**
     * Allows the user to query for the version number of a record.
     *
     * @param   {String}  name the unique name of the record
     * @param   {Function}  callback
     */
    head(name: string): Promise<number>;
    head(name: string, callback: (error: string | null, version: number) => void): void;
    /**
     * A wrapper function around setData. The function works exactly
     * the same however when a callback is omitted a Promise will be
     * returned.
     *
     * @param {String}          recordName     the name of the record to set
     * @param {String|Object}   pathOrData     the path to set or the data to write
     * @param {Object|Function} dataOrCallback the data to write or the write acknowledgement
     *                                         callback
     * @param {Function}        callback       the callback that will be called with the result
     *                                         of the write
     * @returns {Promise} if a callback is omitted a Promise will be returned that resolves
     *                    with the result of the write
     */
    setDataWithAck(recordName: string, data: any, callback?: WriteAckCallback): Promise<string> | void;
    setDataWithAck(recordName: string, path: string, data: any, callback?: WriteAckCallback): Promise<string> | void;
    /**
     * Allows setting the data for a record without being subscribed to it. If
     * the client is subscribed to the record locally, the update will be proxied
     * through the record object like a normal call to Record.set. Otherwise a force
     * write will be performed that overwrites any remote data.
     *
     * @param {String} recordName the name of the record to write to
     * @param {String|Object} pathOrData either the path to write data to or the data to
     *                                   set the record to
     * @param {Object|Primitive|Function} dataOrCallback either the data to write to the
     *                                                   record or a callback function
     *                                                   indicating write success
     * @param {Function} callback if provided this will be called with the result of the
     *                            write
     */
    setData(recordName: string, data: object): void;
    setData(recordName: string, path: string, data: any, callback: WriteAckCallback): void;
    setData(recordName: string, pathOrData: string | object, dataOrCallback: any | WriteAckCallback, callback?: WriteAckCallback): void;
    private sendSetData(recordName, args);
    /**
     * Will be called by the client for incoming messages on the RECORD topic
     *
     * @param   {Object} message parsed and validated deepstream message
     */
    private handle(message);
    /**
     * Callback for 'deleted' and 'discard' events from a record. Removes the record from
     * the registry
     */
    private removeRecord(recordName);
    private getRecordCore(recordName);
}
