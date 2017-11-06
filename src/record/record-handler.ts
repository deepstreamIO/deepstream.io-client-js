import * as utils from '../util/utils'
import { EVENT } from '../constants'
import { Services } from '../client'
import { Options } from '../client-options'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION, RecordMessage } from '../../binary-protocol/src/message-constants'
import { RecordCore, WriteAckCallback } from './record-core'
import { Record } from './record'
import { AnonymousRecord } from './anonymous-record'
import { List } from './list'
import { Listener, ListenCallback } from '../util/listener'
import * as Emitter from 'component-emitter2'

export class RecordHandler {
  private services: Services
  private emitter: Emitter
  private options: Options
  private listener: Listener
  private recordCores: Map<string, RecordCore>

  constructor (services: Services, options: Options, listener?: Listener) {
    this.services = services
    this.options = options
    this.emitter = new Emitter()
    this.listener = listener || new Listener(TOPIC.RECORD, this.services)

    this.recordCores = new Map()

    this.getRecordCore = this.getRecordCore.bind(this)
    this.services.connection.registerHandler(TOPIC.RECORD, this.handle.bind(this))
  }

  /**
 * Returns an existing record or creates a new one.
 *
 * @param   {String} name              the unique name of the record
 */
  public getRecord (name: string): Record {
    return new Record(this.getRecordCore(name))
  }

  /**
   * Returns an existing List or creates a new one. A list is a specialised
   * type of record that holds an array of recordNames.
   *
   * @param   {String} name       the unique name of the list
   */
  public getList (name: string): List {
    return new List(this.getRecordCore(name))
  }

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
  public getAnonymousRecord (): AnonymousRecord {
    return new AnonymousRecord(this.getRecordCore)
  }

  /**
   * Allows to listen for record subscriptions made by this or other clients. This
   * is useful to create "active" data providers, e.g. providers that only provide
   * data for a particular record if a user is actually interested in it
   *
   * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
   * @param   {Function} callback
   */
  public listen (pattern: string, callback: ListenCallback): void {
    this.listener.listen(pattern, callback)
  }

  /**
   * Removes a listener that was previously registered with listenForSubscriptions
   *
   * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
   */
  public unlisten (pattern: string): void {
    this.listener.unlisten(pattern)
  }

  /**
   * Retrieve the current record data without subscribing to changes
   *
   * @param   {String}  name the unique name of the record
   * @param   {Function}  callback
   */
  public snapshot (name: string, callback?: (error: string | null, data: any) => void): Promise<any> | void {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument: name')
    }

    const recordCore = this.recordCores.get(name)
    if (recordCore && recordCore.isReady) {
      if (callback) {
        callback(null, recordCore.get())
        return
      } else {
        return Promise.resolve(recordCore.get())
      }
    }
    // if (callback) {
    //   this.readRegistry.request(name, { callback })
    // } else {
    //   return new Promise((resolve, reject) => {
    //     this.readRegistry.request(name, { resolve, reject })
    //   })
    // }
  }

  /**
   * Allows the user to query to see whether or not the record exists.
   *
   * @param   {String}  name the unique name of the record
   * @param   {Function}  callback
   */
  public has (name: string, callback: (error: string | null, has: boolean) => void): Promise<boolean> | void {
    if (!callback) {
      return new Promise ((resolve, reject) => {
        this.head(name, (error: string | null, version: number) => {
          if (error) {
            resolve(version !== -1)
          } else {
            reject(error)
          }
        })
      })
    }
    this.head(name, (error: string | null, version: number) => {
      callback(error, version !== -1)
    })
  }

  /**
   * Allows the user to query for the version number of a record.
   *
   * @param   {String}  name the unique name of the record
   * @param   {Function}  callback
   */
  public head (name: string, callback: (error: string | null, version: number) => void): Promise<number> | void {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument: name')
    }

    const recordCore = this.recordCores.get(name)
    if (recordCore && recordCore.isReady) {
      if (callback) {
        callback(null, recordCore.version)
        return
      }
      return Promise.resolve(recordCore.version)
    }

    // if (callback) {
    //   this.headRegistry.request(name, { callback })
    // } else {
    //   return new Promise((resolve, reject) => {
    //     this.headRegistry.request(name, { resolve, reject })
    //   })
    // }
  }

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
  public setDataWithAck (recordName: string, path: string, data: any, callback?: WriteAckCallback): Promise<void> | void
  public setDataWithAck (recordName: string, ...rest: Array<any>): Promise<void> | void {
    const args = utils.normalizeSetArguments(arguments, 1)
    if (args.callback) {
      return new Promise((resolve, reject) => {
        args.callback = error => error === null ? resolve() : reject(error)
        this.setData(recordName, args)
      })
    }
    this.setData(recordName, args)
  }

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
  public setData (recordName: string, path: string, data?: any, callback?: WriteAckCallback): void
  public setData (recordName: string, path: string, data: any, callback?: WriteAckCallback): void
  public setData (recordName: string, args: utils.RecordSetArguments): void
  public setData (recordName: string, ...rest: Array<any>): void {
    const { path, data, callback } = utils.normalizeSetArguments(arguments, 1)

    if (!path && (data === null || typeof data !== 'object')) {
      throw new Error('invalid argument: data must be an object when no path is provided')
    }

    const recordCores = this.recordCores.get(recordName)
    if (recordCores) {
      recordCores.set({ path, data, callback })
      return
    }

    if (callback) {
      // register with write ack service
    }

    let action
    if (path) {
      action = callback ? RECORD_ACTION.CREATEANDPATCH_WITH_WRITE_ACK : RECORD_ACTION.CREATEANDPATCH
    } else {
      action = callback ? RECORD_ACTION.CREATEANDUPDATE_WITH_WRITE_ACK : RECORD_ACTION.CREATEANDUPDATE
    }

    this.services.connection.sendMessage({
      topic: TOPIC.RECORD,
      action,
      name: recordName,
      version: -1
    })
  }

  /**
   * Will be called by the client for incoming messages on the RECORD topic
   *
   * @param   {Object} message parsed and validated deepstream message
   */
  private handle (message: RecordMessage) {
    if (
      message.action === RECORD_ACTION.SUBSCRIPTION_FOR_PATTERN_FOUND ||
      message.action === RECORD_ACTION.SUBSCRIPTION_FOR_PATTERN_REMOVED
    ) {
      this.listener.handle(message)
      return
    }

    const recordCore = this.recordCores.get(message.name)
    if (recordCore) {
      recordCore.handle(message)
      return
    }

    if (message.action === RECORD_ACTION.VERSION_EXISTS) {
      // do something
      return
    }

    if (
      message.action === RECORD_ACTION.MESSAGE_DENIED ||
      message.action === RECORD_ACTION.MESSAGE_PERMISSION_ERROR
    ) {
      // do something
    }

    if (message.action === RECORD_ACTION.READ_RESPONSE) {
      // do something
    }

    if (message.action === RECORD_ACTION.HEAD_RESPONSE) {
      // do something
    }

    if (message.action === RECORD_ACTION.DELETED) {
      // do something
    }

    if (message.action === RECORD_ACTION.WRITE_ACKNOWLEDGEMENT) {
      // handle write ack
      return
    }

    if (
      message.action === RECORD_ACTION.SUBSCRIPTION_HAS_PROVIDER ||
      message.action === RECORD_ACTION.SUBSCRIPTION_HAS_NO_PROVIDER
    ) {
      // record can receive a HAS_PROVIDER after discarding the record
      return
    }

    this.services.logger.error(message, EVENT.UNSOLICITED_MESSAGE)
  }

  /**
   * Callback for 'deleted' and 'discard' events from a record. Removes the record from
   * the registry
   */
  private removeRecord (recordName: string) {
    this.recordCores.delete(recordName)
  }

  private getRecordCore (recordName: string): RecordCore {
    let recordCore = this.recordCores.get(name)
    if (!recordCore) {
      recordCore = new RecordCore(name, this.services, this.options, this.removeRecord.bind(this))
      this.recordCores.set(name, recordCore)
    }
    recordCore.usages++
    return recordCore
  }
}
