import { Services, offlineStoreWriteResponse } from '../deepstream-client'
import { Options } from '../client-options'
import { EVENT, RecordData, TOPIC, RecordMessage, RecordWriteMessage, RECORD_ACTION } from '../constants'
import { MergeStrategy } from './merge-strategy'
import { RecordServices } from './record-handler'
import { get as getPath, setValue as setPath } from './json-path'
import { Emitter } from '../util/emitter'
import * as utils from '../util/utils'
import { StateMachine } from '../util/state-machine'
import {TimeoutId} from '../util/timeout-registry'

export type WriteAckCallback = (error: null | string, recordName: string) => void

const enum RECORD_OFFLINE_ACTIONS {
  LOADED = 'LOADED',
  SUBSCRIBED = 'SUBSCRIBED',
  RESUBSCRIBE = 'RESUBSCRIBE',
  RESUBSCRIBED = 'RESUBSCRIBED',
  INVALID_VERSION = 'INVALID_VERSION',
  MERGED = 'MERGED',
  UNSUBSCRIBE_FOR_REAL = 'UNSUBSCRIBE_FOR_REAL'
}

export const enum RECORD_STATE {
  SUBSCRIBING = 'SUBSCRIBING',
  RESUBSCRIBING = 'RESUBSCRIBING',
  LOADING_OFFLINE = 'LOADING_OFFLINE',
  READY = 'READY',
  MERGING = 'MERGING',
  UNSUBSCRIBING = 'UNSUBSCRIBING',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  DELETING = 'DELETING',
  DELETED = 'DELETED',
  ERROR = 'ERROR'
}

export class RecordCore<Context = null> extends Emitter {
  public isReady: boolean = false
  public hasProvider: boolean = false
  public version: number | null = null

  public references: Set<any> = new Set()
  public emitter: Emitter = new Emitter()
  public data: RecordData = Object.create(null)
  public stateMachine: StateMachine
  public responseTimeout: TimeoutId | null = null
  public discardTimeout: TimeoutId | null = null
  public deletedTimeout: TimeoutId | null = null
  public deleteResponse: {
    callback?: (error: string | null) => void,
    reject?: (error: string) => void,
    resolve?: () => void
  } | null = null
  public pendingWrites: utils.RecordSetArguments[] = []
  private readyTimer: number = -1
  private recordReadOnlyMode = this.options.recordReadOnlyMode && this.options.recordPrefixWriteWhitelist.every(prefix => !this.name.startsWith(prefix))

  public readyCallbacks: Array<{ context: any, callback: Function }> = []

  constructor (public name: string, public services: Services, public options: Options, public recordServices: RecordServices, public whenComplete: (recordName: string) => void) {
    super()

    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }

    this.onConnectionLost = this.onConnectionLost.bind(this)
    this.onConnectionReestablished = this.onConnectionReestablished.bind(this)

    this.stateMachine = new StateMachine(
        this.services.logger,
        {
          init: RECORD_STATE.LOADING_OFFLINE,
          context: this,
          onStateChanged: this.onStateChanged,
          transitions: recordStateTransitions
        }
    )

    this.recordServices.dirtyService.whenLoaded(this, this.onDirtyServiceLoaded)
  }

  get recordState (): RECORD_STATE {
    return this.stateMachine.state
  }

  public addReference (ref: any) {
    if (this.references.size === 0 && this.isReady) {
      this.services.timeoutRegistry.clear(this.discardTimeout!)
      this.services.timerRegistry.remove(this.readyTimer!)
      this.readyTimer = -1
      this.stateMachine.transition(RECORD_ACTION.SUBSCRIBE)
    }
    this.references.add(ref)
  }

  /**
  * Removes all change listeners and notifies the server that the client is
  * no longer interested in updates for this record
  */
 public removeReference (ref: any): void {
  if (this.checkDestroyed('discard')) {
    return
  }

  this.whenReadyInternal(ref, () => {
    this.references.delete(ref)
    if (this.references.size === 0 && this.readyTimer === -1) {
      this.readyTimer = this.services.timerRegistry.add({
        duration: this.options.recordDiscardTimeout,
        callback: this.stateMachine.transition,
        context: this.stateMachine,
        data: RECORD_OFFLINE_ACTIONS.UNSUBSCRIBE_FOR_REAL
      })
      this.stateMachine.transition(RECORD_ACTION.UNSUBSCRIBE)
    }
  })
}

  private onDirtyServiceLoaded () {
    this.services.storage.get(this.name, (recordName, version, data) => {
      this.services.connection.onReestablished(this.onConnectionReestablished)
      this.services.connection.onLost(this.onConnectionLost)

      if (!this.services.connection.isConnected) {
        if (version === -1) {
          if (this.recordReadOnlyMode) {
            return
          }
          this.version = this.options.initialRecordVersion
          this.data = Object.create(null)
          // We do this sync in order to avoid the possibility of a race condition
          // where connection is established while we are saving. We could introduce
          // another transition but its probably overkill since we only set this
          // in order to allow the possibility of this record being retrieved in the
          // future to know its been created
          this.recordServices.dirtyService.setDirty(this.name, true)
          this.services.storage.set(this.name, this.version, this.data, error => {})
        } else {
          this.version = version
          this.data = data
        }
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.LOADED)
        return
      }

      if (version === -1 && !this.recordServices.dirtyService.isDirty(this.name)) {
        /**
         * Record has never been created before
         */
        this.stateMachine.transition(RECORD_ACTION.SUBSCRIBECREATEANDREAD)
      } else {
        this.version = version
        this.data = data
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.RESUBSCRIBE)
      }
    })
  }

  public onStateChanged (newState: string, oldState: string) {
    this.emitter.emit(EVENT.RECORD_STATE_CHANGED, newState)
  }

  /**
   * Convenience method, similar to promises. Executes callback
   * whenever the record is ready, either immediately or once the ready
   * event is fired
   */
  public whenReady (context: Context): Promise<Context>
  public whenReady (context: Context, callback: (context: Context) => void): void
  public whenReady (context: Context, callback?: (context: Context) => void | undefined): Promise<Context> | void {
    if (callback) {
      this.whenReadyInternal(context, (realContext: Context | null) => {
        callback(realContext!)
      })
      return
    }

    return new Promise<Context>(resolve => this.whenReadyInternal(context, () => resolve(context)))
  }

  /**
 */
  public whenReadyInternal (context: Context | null, callback: (context: Context | null) => void): void {
    if (this.isReady === true) {
      callback(context)
      return
    }
    this.readyCallbacks.push({ callback, context })
  }

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
  public set ({ path, data, callback }: utils.RecordSetArguments): void {
    if (!path && (data === null || typeof data !== 'object')) {
      throw new Error('invalid arguments, scalar values cannot be set without path')
    }

    if (this.checkDestroyed('set')) {
      return
    }

    if (this.recordReadOnlyMode) {
      this.services.logger.error(
        { topic: TOPIC.RECORD }, EVENT.RECORD_READ_ONLY_MODE, 'Attempting to set data when in readonly mode, ignoring'
      )
      return
    }

    if (this.isReady === false) {
      this.pendingWrites.push({ path, data, callback })
      return
    }

    const oldValue = this.data
    const newValue = setPath(oldValue, path || null, data)

    if (utils.deepEquals(oldValue, newValue)) {
      if (callback) {
        this.services.timerRegistry.requestIdleCallback(() => callback(null, this.name))
      }
      return
    }

    this.applyChange(newValue)

    if (this.services.connection.isConnected) {
      this.sendUpdate(path, data, callback)
    } else {
      if (callback) {
        callback(EVENT.CLIENT_OFFLINE, this.name)
      }
      this.saveUpdate()
    }
  }

  /**
   * Wrapper function around the record.set that returns a promise
   * if no callback is supplied.
   * @returns {Promise} if a callback is omitted a Promise is returned with the result of the write
   */
  public setWithAck (args: utils.RecordSetArguments): Promise<void> | void {
    if (args.callback) {
      this.set(args)
      return
    }

    return new Promise((resolve, reject) => {
      args.callback = error => error === null ? resolve() : reject(error)
      this.set(args)
    })
  }

  /**
 * Returns a copy of either the entire dataset of the record
 * or - if called with a path - the value of that path within
 * the record's dataset.
 *
 * Returning a copy rather than the actual value helps to prevent
 * the record getting out of sync due to unintentional changes to
 * its data
 */
  public get (path?: string): RecordData {
    return getPath(this.data, path || null, this.options.recordDeepCopy)
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
 */
  public subscribe (args: utils.RecordSubscribeArguments, context?: any) {
    if (args.path !== undefined && (typeof args.path !== 'string' || args.path.length === 0)) {
      throw new Error('invalid argument path')
    }
    if (typeof args.callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    if (this.checkDestroyed('subscribe')) {
      return
    }

    if (args.triggerNow) {
      this.whenReadyInternal(null, () => {
        this.emitter.on(args.path || '', args.callback, context)
        args.callback(this.get(args.path))
      })
    } else {
      this.emitter.on(args.path || '', args.callback, context)
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
   * @param   {String}           path  A JSON path
   * @param   {Function}         callback     The callback method. Please note, if a bound
   *                                          method was passed to subscribe, the same method
   *                                          must be passed to unsubscribe as well.
   */
  public unsubscribe (args: utils.RecordSubscribeArguments, context?: any) {
    if (args.path !== undefined && (typeof args.path !== 'string' || args.path.length === 0)) {
      throw new Error('invalid argument path')
    }
    if (args.callback !== undefined && typeof args.callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    if (this.checkDestroyed('unsubscribe')) {
      return
    }

    this.emitter.off(args.path || '', args.callback, context)
  }

  /**
   * Deletes the record on the server.
   */
  public delete (callback?: (error: string | null) => void): Promise<void> | void {
    if (!this.services.connection.isConnected) {
      // this.services.logger.warn({ topic: TOPIC.RECORD }, RECORD_ACTION.DELETE, 'Deleting while offline is not supported')
      if (callback) {
        this.services.timerRegistry.requestIdleCallback(() => {
          callback('Deleting while offline is not supported')
        })
        return
      }
      return Promise.reject('Deleting while offline is not supported')
    }

    if (this.checkDestroyed('delete')) {
      return
    }
    this.stateMachine.transition(RECORD_ACTION.DELETE)

    if (callback && typeof callback === 'function') {
      this.deleteResponse = { callback }
      this.sendDelete()
    } else {
      return new Promise((resolve: () => void,  reject: (error: string) => void) => {
        this.deleteResponse = { resolve, reject }
        this.sendDelete()
      })
    }
  }

  /**
   * Set a merge strategy to resolve any merge conflicts that may occur due
   * to offline work or write conflicts. The function will be called with the
   * local record, the remote version/data and a callback to call once the merge has
   * completed or if an error occurs ( which leaves it in an inconsistent state until
   * the next update merge attempt ).
   */
  public setMergeStrategy (mergeStrategy: MergeStrategy): void {
    this.recordServices.mergeStrategy.setMergeStrategyByName(this.name, mergeStrategy)
  }

  public saveRecordToOffline (callback: offlineStoreWriteResponse = () => {}): void  {
    this.services.storage.set(this.name, this.version as number, this.data, callback)
  }

  /**
   * Transition States
   */

  public onSubscribing (): void {
    this.recordServices.readRegistry.register(this.name, this, this.handleReadResponse)
    this.responseTimeout = this.services.timeoutRegistry.add({
      message: {
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.READ_RESPONSE,
        name: this.name
      }
    })
    if (this.recordReadOnlyMode) {
      this.recordServices.bulkSubscriptionService[RECORD_ACTION.SUBSCRIBEANDREAD].subscribe(this.name)
    } else {
      this.recordServices.bulkSubscriptionService[RECORD_ACTION.SUBSCRIBECREATEANDREAD].subscribe(this.name)
    }
  }

  public onResubscribing (): void {
    this.services.timerRegistry.remove(this.readyTimer!)

    this.recordServices.headRegistry.register(this.name, this, this.handleHeadResponse)
    this.responseTimeout = this.services.timeoutRegistry.add({
      message: {
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.HEAD,
        name: this.name
      }
    })
    this.recordServices.bulkSubscriptionService[RECORD_ACTION.SUBSCRIBEANDHEAD].subscribe(this.name)
  }

  public onReady (): void {
    this.services.timeoutRegistry.clear(this.responseTimeout!)
    this.applyPendingWrites()
    this.isReady = true

    // We temporarily reset the data in order to allow the change callback
    // to trigger all the subscriptions on the first response.
    this.applyChange(this.data, true, false)

    this.readyCallbacks.forEach(({ context, callback }) => {
      callback.call(context, context)
    })
    this.readyCallbacks = []
  }

  private applyPendingWrites (): void {
    const writeCallbacks: WriteAckCallback[] = []
    const oldData = this.data
    let newData = oldData
    for (let i = 0; i < this.pendingWrites.length; i++) {
      const { callback, path, data } = this.pendingWrites[i]
      if (callback) {
        writeCallbacks.push(callback)
      }
      newData = setPath(newData, path || null, data)
    }
    this.pendingWrites = []

    this.applyChange(newData)

    let runFns

    if (writeCallbacks.length !== 0) {
      runFns = (err: any) => {
        for (let i = 0; i < writeCallbacks.length; i++) {
          writeCallbacks[i](err, this.name)
        }
      }
    }

    if (utils.deepEquals(oldData, newData)) {
      if (runFns) {
        runFns(null)
      }
      return
    }

    if (this.services.connection.isConnected) {
      this.sendUpdate(null, newData, runFns)
    } else {
      if (runFns) {
        runFns(EVENT.CLIENT_OFFLINE)
      }
      this.saveUpdate()
    }
  }

  public onUnsubscribed (): void {
    if (this.services.connection.isConnected) {
      // TODO: Remove the discard concept from an individual record into bulk
      // this.recordServices.bulkSubscriptionService[RA.SUBSCRIBEANDHEAD].unsubscribe(this.name)

      const message = {
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.UNSUBSCRIBE,
        names: [this.name],
        correlationId: this.name
      }
      this.discardTimeout = this.services.timeoutRegistry.add({ message })
      this.services.connection.sendMessage(message)
    }
    this.emit(EVENT.RECORD_DISCARDED)
    this.saveRecordToOffline(() => this.destroy())
  }

  public onDeleted (): void {
    this.services.storage.delete(this.name, () => {})
    this.emit(EVENT.RECORD_DELETED)
    this.destroy()
  }

  public handle (message: RecordMessage): void {
    if (message.action === RECORD_ACTION.PATCH || message.action === RECORD_ACTION.UPDATE || message.action === RECORD_ACTION.ERASE) {
      if (this.stateMachine.state === RECORD_STATE.MERGING) {
        // The scenario this covers is when a read is requested because the head doesn't match
        // but an update comes in because we subscribed. In that scenario we just ignore the update
        // and wait for the read response. Hopefully the messages don't cross on the wire in which case
        // it might result in another merge conflict.
        return
      }
      this.applyUpdate(message as RecordWriteMessage)
      return
    }

    if (message.action === RECORD_ACTION.DELETE_SUCCESS) {
      this.services.timeoutRegistry.clear(this.deletedTimeout!)
      this.stateMachine.transition(RECORD_ACTION.DELETE_SUCCESS)
      if (this.deleteResponse!.callback) {
        this.deleteResponse!.callback(null)
      } else if (this.deleteResponse!.resolve) {
        this.deleteResponse!.resolve()
      }
      return
    }

    if (message.action === RECORD_ACTION.DELETED) {
      this.stateMachine.transition(RECORD_ACTION.DELETED)
      return
    }

    if (message.action === RECORD_ACTION.VERSION_EXISTS) {
      this.recoverRecordFromMessage(message as RecordWriteMessage)
      return
    }

    if (
      message.action === RECORD_ACTION.MESSAGE_DENIED ||
      message.action === RECORD_ACTION.MESSAGE_PERMISSION_ERROR
    ) {
      if (
        message.originalAction === RECORD_ACTION.SUBSCRIBECREATEANDREAD ||
        message.originalAction === RECORD_ACTION.SUBSCRIBEANDHEAD ||
        message.originalAction === RECORD_ACTION.SUBSCRIBEANDREAD
      ) {
        const subscribeMsg = { ...message, originalAction: RECORD_ACTION.SUBSCRIBE }
        const actionMsg = {
          ...message,
          originalAction: message.originalAction === RECORD_ACTION.SUBSCRIBECREATEANDREAD ? RECORD_ACTION.READ_RESPONSE : RECORD_ACTION.HEAD_RESPONSE
        }
        this.services.timeoutRegistry.remove(subscribeMsg) // TODO: This doesn't contain correlationIds
        this.services.timeoutRegistry.remove(actionMsg)
      }

      // handle message denied on record set with ack
      if (message.originalAction === RECORD_ACTION.PATCH) {
        if (message.correlationId) {
          this.recordServices.writeAckService.recieve(message)
          return
        }
      }

      this.emit(EVENT.RECORD_ERROR, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED], RECORD_ACTION[message.originalAction as number])

      if (message.originalAction === RECORD_ACTION.DELETE) {
        if (this.deleteResponse!.callback) {
          this.deleteResponse!.callback(RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED])
        } else if (this.deleteResponse!.reject) {
          this.deleteResponse!.reject(RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED])
        }
      }
      return
    }

    if (
      message.action === RECORD_ACTION.SUBSCRIPTION_HAS_PROVIDER ||
      message.action === RECORD_ACTION.SUBSCRIPTION_HAS_NO_PROVIDER
    ) {
      this.hasProvider = message.action === RECORD_ACTION.SUBSCRIPTION_HAS_PROVIDER
      this.emit(EVENT.RECORD_HAS_PROVIDER_CHANGED, this.hasProvider)
      return
    }
  }

  public handleReadResponse (message: any): void {
    if (this.stateMachine.state === RECORD_STATE.MERGING) {
      this.recoverRecordFromMessage(message)
      this.recordServices.dirtyService.setDirty(this.name, false)
      return
    }
    this.version = message.version
    this.data = message.parsedData

    this.stateMachine.transition(RECORD_ACTION.READ_RESPONSE)
  }

  public handleHeadResponse (message: RecordMessage): void {
    const remoteVersion = message.version!
    if (this.recordServices.dirtyService.isDirty(this.name)) {
      if (remoteVersion === -1 && this.version === this.options.initialRecordVersion) {
        /**
         * Record created while offline
         */
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.SUBSCRIBED)
        this.sendCreateUpdate(this.data)
      } else if (this.version === remoteVersion + 1) {
        /**
         * record updated by client while offline
        */
       this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.RESUBSCRIBED)
       this.sendUpdate(null, this.data)
      } else {
        /**
         * record updated by server when offline, get latest data
         */
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.INVALID_VERSION)
        if (remoteVersion !== -1) {
          /**
           * A read with version -1 would result in a read error
           */
          this.sendRead()
          this.recordServices.readRegistry.register(this.name, this, this.handleReadResponse)
        } else {
          this.recoverRecordDeletedRemotely()
        }
      }
    } else {
       if (this.version === remoteVersion) {
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.RESUBSCRIBED)
      } else {
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.INVALID_VERSION)
        if (remoteVersion < (this.version as number)) {
         /**
          *  deleted and created again remotely, up to merge conflict I guess
          */
         this.recoverRecordDeletedRemotely()
        } else {
          this.sendRead()
          this.recordServices.readRegistry.register(this.name, this, this.handleReadResponse)
        }
      }
    }
  }

  public sendRead () {
    this.services.connection.sendMessage({
      topic: TOPIC.RECORD,
      action: RECORD_ACTION.READ,
      name: this.name
    })
  }

  public saveUpdate (): void {
    if (!this.recordServices.dirtyService.isDirty(this.name)) {
      (this.version as number)++
      this.recordServices.dirtyService.setDirty(this.name, true)
    }
    this.saveRecordToOffline()
  }

  public sendUpdate (path: string | null = null, data: RecordData, callback?: WriteAckCallback) {
    if (this.recordReadOnlyMode) {
      this.services.logger.error(
        { topic: TOPIC.RECORD }, EVENT.RECORD_READ_ONLY_MODE, 'Attempting to send updated data, ignoring'
      )
      return
    }

    if (this.recordServices.dirtyService.isDirty(this.name)) {
      this.recordServices.dirtyService.setDirty(this.name, false)
    } else {
      (this.version as number)++
    }

    const message = {
      topic: TOPIC.RECORD,
      version: this.version,
      name: this.name
    }

    if (path) {
      if (data === undefined) {
        Object.assign(message, { action: RECORD_ACTION.ERASE, path })
      } else {
        Object.assign(message, { action: RECORD_ACTION.PATCH, path, parsedData: data })
      }
    } else {
      Object.assign(message, { action: RECORD_ACTION.UPDATE, parsedData: data })
    }
    if (callback) {
      this.recordServices.writeAckService.send(message as RecordWriteMessage, callback)
    } else {
      this.services.connection.sendMessage(message as RecordWriteMessage)
    }
  }

  public sendCreateUpdate (data: RecordData) {
    this.services.connection.sendMessage({
      name: this.name,
      topic: TOPIC.RECORD,
      action: RECORD_ACTION.CREATEANDUPDATE,
      version: this.options.initialRecordVersion,
      parsedData: data
    })
    this.recordServices.dirtyService.setDirty(this.name, false)
  }

  /**
   * Applies incoming updates and patches to the record's dataset
   */
  public applyUpdate (message: RecordWriteMessage) {
    const version = message.version
    const data = message.parsedData as RecordData

    if (this.version === null) {
      this.version = version
    } else if (this.version + 1 !== version) {
      this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.INVALID_VERSION)
      if (message.action === RECORD_ACTION.PATCH) {
        /**
        * Request a snapshot so that a merge can be done with the read reply which contains
        * the full state of the record
        **/
        this.sendRead()
        this.recordServices.readRegistry.register(this.name, this, this.handleReadResponse)
      } else {
        this.recoverRecordFromMessage(message)
      }
      return
    }

    this.version = version
    let newData
    if (message.action === RECORD_ACTION.PATCH) {
      newData = setPath(this.data, message.path as string, data)
    } else if (message.action === RECORD_ACTION.ERASE) {
      newData = setPath(this.data, message.path as string, undefined)
    } else {
      newData = data
    }

    this.applyChange(newData)
  }

  /**
   * Compares the new values for every path with the previously stored ones and
   * updates the subscribers if the value has changed
   */
  public applyChange (newData: RecordData, force: boolean = false, save: boolean = true) {
    if (this.stateMachine.inEndState) {
      return
    }

    const oldData = this.data
    this.data = newData

    if (this.options.saveUpdatesOffline && save) {
      this.saveRecordToOffline()
    }

    const paths = this.emitter.eventNames()
    for (let i = 0; i < paths.length; i++) {
      const newValue = getPath(newData, paths[i], false)
      const oldValue = getPath(oldData, paths[i], false)

      if (!utils.deepEquals(newValue, oldValue) || (force && newValue)) {
        this.emitter.emit(paths[i], this.get(paths[i]))
      }
    }
  }

  /**
   */
  private sendDelete (): void {
    this.whenReadyInternal(null, () => {
      this.services.storage.delete(this.name, () => {
        if (this.services.connection.isConnected) {
          const message = {
            topic: TOPIC.RECORD,
            action: RECORD_ACTION.DELETE,
            name: this.name
          }
          this.deletedTimeout = this.services.timeoutRegistry.add({
            message,
            event: EVENT.RECORD_DELETE_TIMEOUT,
            duration: this.options.recordDeleteTimeout
          })
          this.services.connection.sendMessage(message)
        } else {
          this.stateMachine.transition(RECORD_ACTION.DELETE_SUCCESS)
        }
      })
    })
  }

  public recoverRecordFromMessage (message: RecordWriteMessage) {
    this.recordServices.mergeStrategy.merge(
      message,
      (this.version as number),
      this.get(),
      this.onRecordRecovered,
      this,
    )
  }

  public recoverRecordDeletedRemotely () {
    this.recordServices.mergeStrategy.merge(
      {
        name: this.name,
        version: -1,
        parsedData: null
      } as RecordMessage,
      (this.version as number),
      this.get(),
      this.onRecordRecovered,
      this
    )
  }

  /**
 * Callback once the record merge has completed. If successful it will set the
 * record state, else emit and error and the record will remain in an
 * inconsistent state until the next update.
 */
  public onRecordRecovered (error: string | null, recordMessage: RecordMessage, mergedData: RecordData): void {
    const { version: remoteVersion, parsedData: remoteData } = recordMessage

    if (error) {
      this.services.logger.error({ topic: TOPIC.RECORD }, EVENT.RECORD_VERSION_EXISTS)
      if (recordMessage.correlationId) {
        this.recordServices.writeAckService.recieve({ ...recordMessage, reason: error  })
      }
      return
    }

    if (mergedData === null) {
      if (remoteVersion === -1) {
        this.services.storage.delete(this.name, () => {})
        this.stateMachine.transition(RECORD_ACTION.DELETED)
      } else {
        this.stateMachine.transition(RECORD_ACTION.DELETE)
      }
      return
    }

    this.version = remoteVersion!
    const oldValue = this.data

    if (utils.deepEquals(oldValue, remoteData)) {
      if (this.stateMachine.state === RECORD_STATE.MERGING) {
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.MERGED)
      }
      return
    }

    if (this.stateMachine.state !== RECORD_STATE.MERGING) {
      this.services.logger.warn({
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.VERSION_EXISTS
      })
      return
    }

    const newValue = mergedData
    this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.MERGED)

    let runFns
    const writeCallbacks: WriteAckCallback[] = this.pendingWrites
      .map(({ callback }) => callback!)
      .filter(callback => callback !== undefined)
    if (writeCallbacks.length !== 0) {
      runFns = (err: any) => {
        writeCallbacks.forEach(callback => callback!(err, this.name))
      }
    }
    this.pendingWrites = []

    if (utils.deepEquals(mergedData, remoteData)) {
      this.applyChange(mergedData)
      if (runFns) {
        runFns(null)
      }
      return
    }

    if (this.recordReadOnlyMode) {
      this.services.logger.error(
        { topic: TOPIC.RECORD }, EVENT.RECORD_READ_ONLY_MODE, 'Attempting to set data after merge when in readonly mode, ignoring'
      )
      return
    }

    this.applyChange(newValue)
    this.sendUpdate(null, this.data, runFns)
  }

  /**
 * A quick check that's carried out by most methods that interact with the record
 * to make sure it hasn't been destroyed yet - and to handle it gracefully if it has.
 */
  public checkDestroyed (methodName: string): boolean {
    if (this.stateMachine.inEndState) {
      this.services.logger.error(
        { topic: TOPIC.RECORD },
        EVENT.RECORD_ALREADY_DESTROYED,
        { methodName }
      )
      return true
    }

    return false
  }

  /**
   * Destroys the record and nulls all
   * its dependencies
   */
  public destroy () {
    this.services.timerRegistry.remove(this.readyTimer)

    this.services.timeoutRegistry.clear(this.responseTimeout!)
    this.services.timeoutRegistry.clear(this.deletedTimeout!)
    this.services.timeoutRegistry.clear(this.discardTimeout!)
    this.services.connection.removeOnReestablished(this.onConnectionReestablished)
    this.services.connection.removeOnLost(this.onConnectionLost)
    this.emitter.off()
    this.isReady = false
    this.whenComplete(this.name)
  }

  public onConnectionReestablished (): void {
    this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.RESUBSCRIBE)
  }

  public onConnectionLost (): void {
    this.saveRecordToOffline()
  }

  public getDebugId (): string | null {
    if (this.options.debug) {
      return utils.getUid()
    }
    return null
  }
}

const recordStateTransitions = [
    { name: RECORD_ACTION.SUBSCRIBECREATEANDREAD, from: RECORD_STATE.LOADING_OFFLINE, to: RECORD_STATE.SUBSCRIBING, handler: RecordCore.prototype.onSubscribing },
    { name: RECORD_OFFLINE_ACTIONS.LOADED, from: RECORD_STATE.LOADING_OFFLINE, to: RECORD_STATE.READY, handler: RecordCore.prototype.onReady },
    { name: RECORD_ACTION.READ_RESPONSE, from: RECORD_STATE.SUBSCRIBING, to: RECORD_STATE.READY, handler: RecordCore.prototype.onReady },
    { name: RECORD_OFFLINE_ACTIONS.SUBSCRIBED, from: RECORD_STATE.RESUBSCRIBING, to: RECORD_STATE.READY, handler: RecordCore.prototype.onReady },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBE, from: RECORD_STATE.LOADING_OFFLINE, to: RECORD_STATE.RESUBSCRIBING, handler: RecordCore.prototype.onResubscribing },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBE, from: RECORD_STATE.READY, to: RECORD_STATE.RESUBSCRIBING, handler: RecordCore.prototype.onResubscribing },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBE, from: RECORD_STATE.RESUBSCRIBING, to: RECORD_STATE.RESUBSCRIBING, handler: RecordCore.prototype.onResubscribing },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBE, from: RECORD_STATE.SUBSCRIBING, to: RECORD_STATE.SUBSCRIBING, handler: RecordCore.prototype.onSubscribing  },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBE, from: RECORD_STATE.UNSUBSCRIBING, to: RECORD_STATE.UNSUBSCRIBING },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBED, from: RECORD_STATE.RESUBSCRIBING, to: RECORD_STATE.READY, handler: RecordCore.prototype.onReady},
    { name: RECORD_OFFLINE_ACTIONS.INVALID_VERSION, from: RECORD_STATE.RESUBSCRIBING, to: RECORD_STATE.MERGING },
    { name: RECORD_OFFLINE_ACTIONS.MERGED, from: RECORD_STATE.MERGING, to: RECORD_STATE.READY, handler: RecordCore.prototype.onReady },
    { name: RECORD_ACTION.DELETED, from: RECORD_STATE.MERGING, to: RECORD_STATE.DELETED, handler: RecordCore.prototype.onDeleted },
    { name: RECORD_ACTION.DELETE, from: RECORD_STATE.MERGING, to: RECORD_STATE.DELETING },
    { name: RECORD_ACTION.DELETE, from: RECORD_STATE.READY, to: RECORD_STATE.DELETING },
    { name: RECORD_ACTION.DELETED, from: RECORD_STATE.READY, to: RECORD_STATE.DELETED, handler: RecordCore.prototype.onDeleted },
    { name: RECORD_ACTION.DELETED, from: RECORD_OFFLINE_ACTIONS.UNSUBSCRIBE_FOR_REAL, to: RECORD_STATE.DELETED, handler: RecordCore.prototype.onDeleted },
    { name: RECORD_ACTION.DELETED, from: RECORD_STATE.UNSUBSCRIBING, to: RECORD_STATE.DELETED, handler: RecordCore.prototype.onDeleted },
    { name: RECORD_ACTION.DELETE_SUCCESS, from: RECORD_STATE.DELETING, to: RECORD_STATE.DELETED, handler: RecordCore.prototype.onDeleted },
    { name: RECORD_ACTION.UNSUBSCRIBE, from: RECORD_STATE.READY, to: RECORD_STATE.UNSUBSCRIBING },
    { name: RECORD_ACTION.SUBSCRIBE, from: RECORD_STATE.UNSUBSCRIBING, to: RECORD_STATE.READY },
    { name: RECORD_OFFLINE_ACTIONS.UNSUBSCRIBE_FOR_REAL, from: RECORD_STATE.UNSUBSCRIBING, to: RECORD_STATE.UNSUBSCRIBED, handler: RecordCore.prototype.onUnsubscribed },
    { name: RECORD_OFFLINE_ACTIONS.INVALID_VERSION, from: RECORD_STATE.READY, to: RECORD_STATE.MERGING },
]
