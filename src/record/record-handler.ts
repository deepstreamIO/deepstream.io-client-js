import * as utils from '../util/utils'
import { EVENT } from '../constants'
import { Services } from '../client'
import { Options } from '../client-options'
import {
  TOPIC,
  RecordMessage,
  ListenMessage,
  RecordData,
  RecordPathData,
  RECORD_ACTIONS as RA,
  Message,
} from '../../binary-protocol/src/message-constants'
import { isWriteAck } from '../../binary-protocol/src/utils'
import { RecordCore, WriteAckCallback } from './record-core'
import { Record } from './record'
import { AnonymousRecord } from './anonymous-record'
import { List } from './list'
import { Listener, ListenCallback } from '../util/listener'
import { SingleNotifier } from './single-notifier'
import { WriteAcknowledgementService } from './write-ack-service'
import { DirtyService } from './dirty-service'
import { MergeStrategyService } from './merge-strategy-service'
import { MergeStrategy } from './merge-strategy'
import {BulkSubscriptionService} from '../util/bulk-subscription-service'

export interface RecordServices {
  bulkSubscriptionService: { [index in RA]: BulkSubscriptionService<RA> }
  writeAckService: WriteAcknowledgementService
  readRegistry: SingleNotifier<RecordMessage>,
  headRegistry: SingleNotifier<RecordMessage>,
  dirtyService: DirtyService,
  mergeStrategy: MergeStrategyService
}

export class RecordHandler {
  private services: Services
  private options: Options
  private listener: Listener
  private recordCores: Map<string, RecordCore>
  private recordServices: RecordServices
  private dirtyService: DirtyService

  constructor (services: Services, options: Options, recordServices?: RecordServices, listener?: Listener) {
    this.services = services
    this.options = options
    this.listener = listener || new Listener(TOPIC.RECORD, this.services)

    this.recordCores = new Map()

    this.recordServices = recordServices || {
      bulkSubscriptionService: {
        [RA.SUBSCRIBECREATEANDREAD_BULK]: this.getBulkSubscriptionService(RA.SUBSCRIBECREATEANDREAD_BULK, RA.SUBSCRIBECREATEANDREAD),
        [RA.SUBSCRIBEANDHEAD_BULK]: this.getBulkSubscriptionService(RA.SUBSCRIBEANDHEAD_BULK, RA.SUBSCRIBEANDHEAD),
        [RA.SUBSCRIBEANDREAD_BULK]: this.getBulkSubscriptionService(RA.SUBSCRIBEANDREAD_BULK, RA.SUBSCRIBEANDREAD),
      },
      writeAckService: new WriteAcknowledgementService(services),
      readRegistry: new SingleNotifier(services, RA.READ, options.recordReadTimeout),
      headRegistry: new SingleNotifier(services, RA.HEAD, options.recordReadTimeout),
      dirtyService: new DirtyService(services.storage, options.dirtyStorageName),
      mergeStrategy: new MergeStrategyService(services, options.mergeStrategy)
    } as RecordServices
    this.dirtyService = this.recordServices.dirtyService

    this.sendUpdatedData = this.sendUpdatedData.bind(this)
    this.onRecordUpdated = this.onRecordUpdated.bind(this)
    this.onMergeCompleted = this.onMergeCompleted.bind(this)
    this.getRecordCore = this.getRecordCore.bind(this)
    this.removeRecord = this.removeRecord.bind(this)
    this.onBulkSubscriptionSent = this.onBulkSubscriptionSent.bind(this)
    this.services.connection.registerHandler(TOPIC.RECORD, this.handle.bind(this))
    this.services.connection.onReestablished(this.syncDirtyRecords.bind(this))

    if (this.services.connection.isConnected) {
      this.syncDirtyRecords()
    }
  }

  /**
   * Returns all the available data-sync names.
   *
   * Please note: Lists, AnonymousRecords and Records are all essentially
   * the same thing within the SDK, so this array will contain a list of
   * everything.
   *
   * Due to how records work as well even after a discard this list will
   * take a while to update. This is intentional as their is an option for
   * how long a record will survive before being discarded! You can change that
   * via the `recordDiscardTimeout: milliseconds` option.
   */
  public names (): Array<string> {
    return [...this.recordCores.keys()]
  }

  public setMergeStrategy (recordName: string, mergeStrategy: MergeStrategy): void {
    if (typeof mergeStrategy === 'function') {
      this.recordServices.mergeStrategy.setMergeStrategyByName(recordName, mergeStrategy)
    } else {
      throw new Error('Invalid merge strategy: Must be a Function')
    }
  }

  public setMergeStrategyRegExp (regexp: RegExp, mergeStrategy: MergeStrategy): void {
    if (typeof mergeStrategy === 'function') {
      this.recordServices.mergeStrategy.setMergeStrategyByPattern(regexp, mergeStrategy)
    } else {
      throw new Error('Invalid merge strategy: Must be a Function')
    }
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
  public snapshot (name: string): Promise<RecordData>
  public snapshot (name: string, callback: (error: string | null, data: RecordData) => void): void
  public snapshot (name: string, callback?: (error: string | null, data: RecordData) => void): void | Promise<RecordData> {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument: name')
    }
    if (callback !== undefined && typeof callback !== 'function') {
      throw new Error('invalid argument: callback')
    }

    const recordCore = this.recordCores.get(name)
    if (recordCore) {
      if (callback) {
        recordCore.whenReady(null, () => {
          callback(null, recordCore.get())
        })
      } else {
        return new Promise((resolve, reject) => {
          recordCore.whenReady(null, () => {
            resolve(recordCore.get())
          })
        })
      }
      return
    }

    if (callback) {
      this.recordServices.readRegistry.request(name, callback)
    } else {
      return new Promise((resolve, reject) => {
        this.recordServices.readRegistry.request(name, (error, data) => error ? reject(error) : resolve(data))
      })
    }
  }

  /**
   * Allows the user to query to see whether or not the record exists.
   *
   * @param   {String}  name the unique name of the record
   * @param   {Function}  callback
   */
  public has (name: string): Promise<boolean>
  public has (name: string, callback: (error: string | null, has: boolean | null) => void): void
  public has (name: string, callback?: (error: string | null, has: boolean | null) => void): Promise<boolean> | void {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument: name')
    }
    if (callback !== undefined && typeof callback !== 'function') {
      throw new Error('invalid argument: callback')
    }

    let cb
    if (!callback) {
      return new Promise ((resolve, reject) => {
        cb = (error: string | null, version: number) => error ? reject(error) : resolve(version !== -1)
        this.head(name, cb)
      })
    }
    cb = (error: string | null, version: number) => error ? callback(error, null) : callback(null, version !== -1)
    this.head(name, cb)
  }

  /**
   * Allows the user to query for the version number of a record.
   *
   * @param   {String}  name the unique name of the record
   * @param   {Function}  callback
   */
  public head (name: string): Promise<number>
  public head (name: string, callback: (error: string | null, version: number) => void): void
  public head (name: string, callback?: (error: string | null, version: number) => void): void | Promise<number> {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument: name')
    }
    if (callback !== undefined && typeof callback !== 'function') {
      throw new Error('invalid argument: callback')
    }

    const recordCore = this.recordCores.get(name)
    if (recordCore) {
      if (callback) {
        recordCore.whenReady(null, () => {
          callback(null, recordCore.version as number)
        })
      } else {
        return new Promise((resolve, reject) => {
          recordCore.whenReady(null, () => {
            resolve(recordCore.version as number)
          })
        })
      }
      return
    }

    if (callback) {
      this.recordServices.headRegistry.request(name, callback)
    } else {
      return new Promise((resolve, reject) => {
        this.recordServices.headRegistry.request(name, (error, data) => error ? reject(error) : resolve(data))
      })
    }
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
  public setDataWithAck (recordName: string, data: RecordData | undefined, callback?: WriteAckCallback): Promise<string | void> | void
  public setDataWithAck (recordName: string, path: string, data: RecordData | undefined, callback?: WriteAckCallback): Promise<string | void> | void
  public setDataWithAck (recordName: string, ...rest: Array<any>): Promise<string | void> | void {
    const args = utils.normalizeSetArguments(arguments, 1)
    if (!args.callback) {
      return new Promise((resolve, reject) => {
        args.callback = error => error === null ? resolve() : reject(error)
        this.sendSetData(recordName, -1, args)
      })
    }
    this.sendSetData(recordName, -1, args)
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
  public setData (recordName: string, data: RecordData): void
  public setData (recordName: string, path: string, data: RecordPathData | undefined, callback: WriteAckCallback): void
  public setData (recordName: string, pathOrData: string | RecordData, dataOrCallback: RecordPathData | WriteAckCallback | undefined, callback?: WriteAckCallback): void
  public setData (recordName: string): void {
    const args = utils.normalizeSetArguments(arguments, 1)
    this.sendSetData(recordName, -1, args)
  }

  public delete (recordName: string, callback?: (error: string | null) => void): void | Promise<void> {
    // TODO: Use a delete service to make the logic in record core and here common
  }

  private sendSetData (recordName: string, version: number, args: utils.RecordSetArguments): void {
    const { path, data, callback } = args
    if (!recordName || typeof recordName !== 'string' || recordName.length === 0) {
      throw new Error('invalid argument: recordName must be an non empty string')
    }
    if (!path && (data === null || typeof data !== 'object')) {
      throw new Error('invalid argument: data must be an object when no path is provided')
    }

    const recordCores = this.recordCores.get(recordName)
    if (recordCores) {
      recordCores.set({ path, data, callback })
      return
    }

    let action
    if (path) {
      if (data === undefined) {
        action = RA.ERASE
      } else {
        action = RA.CREATEANDPATCH
      }
    } else {
      action = RA.CREATEANDUPDATE
    }

    const message = {
      topic: TOPIC.RECORD,
      action,
      name: recordName,
      path,
      version,
      parsedData: data
    }

    if (callback) {
      this.recordServices.writeAckService.send(message, callback)
    } else {
      this.services.connection.sendMessage(message)
    }
  }

  public saveToOfflineStorage () {
    this.recordCores.forEach(recordCore => recordCore.saveRecordToOffline())
  }

  public clearOfflineStorage (): Promise<void>
  public clearOfflineStorage (callback: (error: string | null) => void): void
  public clearOfflineStorage (callback?: (error: string | null) => void): Promise<void> | void {
    if (callback) {
      this.services.storage.reset(callback)
    } else {
      return new Promise((resolve, reject) => {
        this.services.storage.reset(error => error ? reject(error) : resolve())
      })
    }
  }

  /**
   * Will be called by the client for incoming messages on the RECORD topic
   *
   * @param   {Object} message parsed and validated deepstream message
   */
  private handle (message: RecordMessage) {
    if (message.isAck) {
      this.services.timeoutRegistry.remove(message)
      return
    }

    if (
      message.action === RA.SUBSCRIPTION_FOR_PATTERN_FOUND ||
      message.action === RA.SUBSCRIPTION_FOR_PATTERN_REMOVED ||
      message.action === RA.LISTEN ||
      message.action === RA.UNLISTEN
    ) {
      this.listener.handle(message as ListenMessage)
      return
    }

    if (isWriteAck(message.action) || isWriteAck(message.originalAction as RA)) {
      this.recordServices.writeAckService.recieve(message)
      return
    }

    if (message.action === RA.READ_RESPONSE || message.originalAction === RA.READ) {
      if (message.isError) {
        this.recordServices.readRegistry.recieve(message, RA[message.action])
      } else {
        this.recordServices.readRegistry.recieve(message, null, message.parsedData)
      }
      return
    }

    if (
      message.action === RA.HEAD_RESPONSE ||
      message.originalAction === RA.HEAD
    ) {
      if (message.isError) {
        this.recordServices.headRegistry.recieve(message, RA[message.action])
      } else {
        this.recordServices.headRegistry.recieve(message, null, message.version)
      }
    }

    const recordCore = this.recordCores.get(message.name)
    if (recordCore) {
      recordCore.handle(message)
      return
    }

    if (
      message.action === RA.VERSION_EXISTS
    ) {
      return
    }

    if (
      message.action === RA.SUBSCRIPTION_HAS_PROVIDER ||
      message.action === RA.SUBSCRIPTION_HAS_NO_PROVIDER
    ) {
      // record can receive a HAS_PROVIDER after discarding the record
      return
    }

    if (message.isError) {
      this.services.logger.error(message)
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

  private getRecordCore (recordName: string): RecordCore<any> {
    let recordCore = this.recordCores.get(recordName)
    if (!recordCore) {
      recordCore = new RecordCore(recordName, this.services, this.options, this.recordServices, this.removeRecord)
      this.recordCores.set(recordName, recordCore)
    }
    return recordCore
  }

  private syncDirtyRecords () {
    this.dirtyService.whenLoaded(this, this._syncDirtyRecords)
  }

  // TODO: Expose issues here, as there isn't a reason why a record core needs to exist in
  // order to sync up
  private _syncDirtyRecords () {
    const dirtyRecords = this.dirtyService.getAll()
    for (const recordName in dirtyRecords) {
      const recordCore = this.recordCores.get(recordName)
      if (recordCore && recordCore.references.size > 0) {
        // if it isn't zero.. problem.
        continue
      }
      this.services.storage.get(recordName, this.sendUpdatedData)
    }
  }

  private sendUpdatedData (recordName: string, version: number, data: RecordData) {
    this.sendSetData(recordName, version, { data, callback: this.onRecordUpdated })
  }

  private onRecordUpdated (error: string | null, recordName: string) {
    if (!error) {
      this.dirtyService.setDirty(recordName, false)
    }
  }

  /**
  * Callback once the record merge has completed. If successful it will set the
  * record state, else emit and error and the record will remain in an
  * inconsistent state until the next update.
  */
  // private onMergeConflict (message: RecordWriteMessage): void {
  //   this.services.storage.get(message.name, (recordName: string, version: number, data: RecordData) => {
  //     this.recordServices.mergeStrategy.merge(
  //       message.name,
  //       version,
  //       data,
  //       message.version,
  //       message.parsedData,
  //       this.onMergeCompleted
  //     )
  //   })
  // }

  private onMergeCompleted (error: string | null, recordName: string, mergeData: RecordData, remoteVersion: number, remoteData: RecordData) {
    this.sendSetData(recordName, remoteVersion + 1, { data: mergeData })
  }

  private getBulkSubscriptionService (bulkSubscribe: RA, subscribe: RA) {
    return new BulkSubscriptionService<RA>(this.services, this.options.subscriptionInterval, TOPIC.RECORD,
        bulkSubscribe, subscribe, RA.UNSUBSCRIBE_BULK, RA.UNSUBSCRIBE, this.onBulkSubscriptionSent)
  }

  private onBulkSubscriptionSent (message: Message) {
    if (!message.names) {
      this.services.timeoutRegistry.add({ message })
    }
  }

}
