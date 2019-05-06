import { Services } from '../client'
import { Options } from '../client-options'
import { EVENT } from '../constants'
import { MergeStrategy } from './merge-strategy'
import {
  TOPIC,
  RECORD_ACTIONS as RA,
  RecordMessage,
  RecordWriteMessage,
  RecordData
} from '../../binary-protocol/src/message-constants'
import { RecordServices } from './record-handler'
import { get as getPath, setValue as setPath } from './json-path'
import * as Emitter from 'component-emitter2'
import * as utils from '../util/utils'
import { StateMachine } from '../util/state-machine'
import {TimeoutId} from '../util/timeout-registry'

export type WriteAckCallback = (error: string | null, recordName: string) => void

const enum RECORD_OFFLINE_ACTIONS {
  LOAD = 'LOAD',
  LOADED = 'LOADED',
  SUBSCRIBED = 'SUBSCRIBED',
  RESUBSCRIBE = 'RESUBSCRIBE',
  RESUBSCRIBED = 'RESUBSCRIBED',
  INVALID_VERSION = 'INVALID_VERSION',
  MERGED = 'MERGED',
}

export const enum RECORD_STATE {
  INITIAL = 'INITIAL',
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
  public isReady: boolean
  public hasProvider: boolean
  public version: number | null

  public references: number
  public emitter: Emitter
  public data: RecordData
  public stateMachine: StateMachine
  public responseTimeout: TimeoutId | null
  public discardTimeout: TimeoutId | null
  public deletedTimeout: TimeoutId | null
  public deleteResponse: {
    callback?: (error: string | null) => void,
    reject?: (error: string) => void,
    resolve?: () => void
  } | null
  public pendingWrites: Array<utils.RecordSetArguments>
  public offlineLoadingAborted: boolean
  public readyTimer: number

  public readyCallbacks: Array<{ context: any, callback: Function }> = []

  constructor (public name: string, public services: Services, public options: Options, public recordServices: RecordServices, public whenComplete: (recordName: string) => void) {
    super()
    this.emitter = new Emitter()
    this.data = Object.create(null)
    this.references = 1
    this.hasProvider = false
    this.pendingWrites = []
    this.isReady = false

    this.offlineLoadingAborted = false
    this.version = null
    this.responseTimeout = null
    this.discardTimeout = null
    this.deletedTimeout = null
    this.readyTimer = -1
    this.deleteResponse = null

    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }

    this.onConnectionLost = this.onConnectionLost.bind(this)
    this.onConnectionReestablished = this.onConnectionReestablished.bind(this)

    this.stateMachine = new StateMachine(
        this.services.logger,
        {
          init: RECORD_STATE.INITIAL,
          context: this,
          onStateChanged: this.onStateChanged,
          transitions: recordStateTransitions
        }
    )

    this.recordServices.dirtyService.whenLoaded(this, this.onRecordLoadedFromStorage)
  }

  get recordState (): RECORD_STATE {
    return this.stateMachine.state
  }

  set usages (usages: number) {
    this.references = usages
    if (this.references === 1) {
      this.services.timeoutRegistry.clear(this.discardTimeout!)
      this.services.timerRegistry.remove(this.readyTimer!)
      this.stateMachine.transition(RA.SUBSCRIBE)
    }
  }

  get usages (): number {
    return this.references
  }

  private onRecordLoadedFromStorage () {
      if (this.services.connection.isConnected) {
        if (!this.recordServices.dirtyService.isDirty(this.name)) {
          this.stateMachine.transition(RA.SUBSCRIBE)
        } else {
          this.services.storage.get(this.name, (recordName, version, data) => {
            this.version = version
            this.data = data
            this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.RESUBSCRIBE)
          })
        }
      } else {
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.LOAD)
      }

      this.services.connection.onReestablished(this.onConnectionReestablished)
      this.services.connection.onLost(this.onConnectionLost)
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
    if (callback) {
      this.readyCallbacks.push({ callback, context })
    }
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

    if (this.isReady === false) {
      this.pendingWrites.push({ path, data, callback })
      return
    }

    const oldValue = this.data
    const newValue = setPath(oldValue, path || null, data)

    if (oldValue === newValue) {
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
  public subscribe (args: utils.RecordSubscribeArguments) {
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
        this.emitter.on(args.path || '', args.callback)
        args.callback(this.get(args.path))
      })
    } else {
      this.emitter.on(args.path || '', args.callback)
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
  public unsubscribe (args: utils.RecordSubscribeArguments) {
    if (args.path !== undefined && (typeof args.path !== 'string' || args.path.length === 0)) {
      throw new Error('invalid argument path')
    }
    if (args.callback !== undefined && typeof args.callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    if (this.checkDestroyed('unsubscribe')) {
      return
    }

    this.emitter.off(args.path || '', args.callback)
  }

  /**
  * Removes all change listeners and notifies the server that the client is
  * no longer interested in updates for this record
  */
  public discard (): void {
    if (this.checkDestroyed('discard')) {
      return
    }
    this.whenReadyInternal(null, () => {
      this.references--
      if (this.references <= 0) {
        this.readyTimer = this.services.timerRegistry.add({
          duration: this.options.recordReadTimeout,
          callback: this.stateMachine.transition,
          context: this.stateMachine,
          data: RA.UNSUBSCRIBE_ACK
        })
      }
    })
    this.stateMachine.transition(RA.UNSUBSCRIBE)
  }

  /**
   * Deletes the record on the server.
   */
  public delete (callback?: (error: string | null) => void): Promise<void> | void {
    if (!this.services.connection.isConnected) {
      // this.services.logger.warn({ topic: TOPIC.RECORD }, RA.DELETE, 'Deleting while offline is not supported')
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
    this.stateMachine.transition(RA.DELETE)

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

  public saveRecordToOffline (): void  {
    this.services.storage.set(this.name, this.version as number, this.data, () => {})
  }

  /**
   * Transition States
   */

  public onSubscribing (): void {
    this.recordServices.readRegistry.register(this.name, this, this.handleReadResponse)
    this.responseTimeout = this.services.timeoutRegistry.add({
      message: {
        topic: TOPIC.RECORD,
        action: RA.READ_RESPONSE,
        name: this.name
      }
    })
    this.recordServices.bulkSubscriptionService[RA.SUBSCRIBECREATEANDREAD_BULK].subscribe(this.name)
  }

  public onResubscribing (): void {
    this.services.timerRegistry.remove(this.readyTimer!)

    this.recordServices.headRegistry.register(this.name, this, this.handleHeadResponse)
    this.responseTimeout = this.services.timeoutRegistry.add({
      message: {
        topic: TOPIC.RECORD,
        action: RA.HEAD,
        name: this.name
      }
    })
    this.recordServices.bulkSubscriptionService[RA.SUBSCRIBEANDHEAD_BULK].subscribe(this.name)
  }

  public onOfflineLoading () {
    this.services.storage.get(this.name, (recordName: string, version: number, data: RecordData) => {
      if (version === -1) {
        if (this.offlineLoadingAborted) {
            // This occurred since we got a connection to the server
            // meaning we no longer care about current state currently
            this.offlineLoadingAborted = false
            return
        }
        this.data = {}
        this.version = 1
        this.recordServices.dirtyService.setDirty(this.name, true)
        this.services.storage.set(this.name, this.version, this.data, error => {
          this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.LOADED)
        })
      } else {
        this.data = data
        this.version = version
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.LOADED)
      }
    })
  }

  public abortOfflineLoading (): void {
      this.offlineLoadingAborted = true
      this.onResubscribing()
  }

  public onReady (): void {
    this.services.timeoutRegistry.clear(this.responseTimeout!)
    this.applyPendingWrites()
    this.isReady = true
    this.readyCallbacks.forEach(({ context, callback }) => {
      callback.call(context, context)
    })
  }

  public applyPendingWrites (): void {
    const writeCallbacks: Array<WriteAckCallback> = []
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

    const runFns = (err: any) => {
      for (let i = 0; i < writeCallbacks.length; i++) {
        writeCallbacks[i](err, this.name)
      }
    }

    if (utils.deepEquals(oldData, newData)) {
      runFns(null)
      return
    }

    if (this.services.connection.isConnected) {
      this.sendUpdate(null, newData, runFns)
    } else {
      runFns(EVENT.CLIENT_OFFLINE)
      this.saveUpdate()
    }
  }

  public onUnsubscribed (): void {
    if (this.services.connection.isConnected) {
      const message = {
        topic: TOPIC.RECORD,
        action: RA.UNSUBSCRIBE,
        name: this.name
      }
      this.discardTimeout = this.services.timeoutRegistry.add({ message })
      this.services.connection.sendMessage(message)
    }
    this.emit(EVENT.RECORD_DISCARDED)
    this.destroy()
  }

  public onDeleted (): void {
    this.emit(EVENT.RECORD_DELETED)
    this.destroy()
  }

  public handle (message: RecordMessage): void {
    if (message.action === RA.PATCH || message.action === RA.UPDATE || message.action === RA.ERASE) {
      if (this.stateMachine.state === RECORD_STATE.MERGING) {
        // The scenario this covers is when a read is requested because the head doesn't match
        // but an updated comes in because we subscribed. In that scenario we just ignore the update
        // and wait for the read response. Hopefully the messages don't cross on the wire in which case
        // it might result in another merge conflict.
        return
      }

      this.applyUpdate(message as RecordWriteMessage)
      return
    }

    if (message.action === RA.DELETE_SUCCESS) {
      this.services.timeoutRegistry.clear(this.deletedTimeout!)
      this.stateMachine.transition(message.action)
      if (this.deleteResponse!.callback) {
        this.deleteResponse!.callback(null)
      } else if (this.deleteResponse!.resolve) {
        this.deleteResponse!.resolve()
      }
      return
    }

    if (message.action === RA.DELETED) {
      this.stateMachine.transition(message.action)
      return
    }

    if (message.action === RA.VERSION_EXISTS) {
      // what kind of message is version exists?
      // this.recoverRecord(message)
      return
    }

    if (
      message.action === RA.MESSAGE_DENIED ||
      message.action === RA.MESSAGE_PERMISSION_ERROR
    ) {
      if (
        message.originalAction === RA.SUBSCRIBECREATEANDREAD ||
        message.originalAction === RA.SUBSCRIBEANDHEAD ||
        message.originalAction === RA.SUBSCRIBEANDREAD
      ) {
        const subscribeMsg = Object.assign({}, message, { originalAction: RA.SUBSCRIBE })
        const actionMsg = Object.assign(
          {},
          message,
          { originalAction: message.originalAction === RA.SUBSCRIBECREATEANDREAD ? RA.READ_RESPONSE : RA.HEAD_RESPONSE }
      )
        this.services.timeoutRegistry.remove(subscribeMsg)
        this.services.timeoutRegistry.remove(actionMsg)
      }

      this.emit(EVENT.RECORD_ERROR, RA[RA.MESSAGE_DENIED], RA[message.originalAction as number])

      if (message.originalAction === RA.DELETE) {
        if (this.deleteResponse!.callback) {
          this.deleteResponse!.callback(RA[RA.MESSAGE_DENIED])
        } else if (this.deleteResponse!.reject) {
          this.deleteResponse!.reject(RA[RA.MESSAGE_DENIED])
        }
      }
      return
    }

    if (
      message.action === RA.SUBSCRIPTION_HAS_PROVIDER ||
      message.action === RA.SUBSCRIPTION_HAS_NO_PROVIDER
    ) {
      this.hasProvider = message.action === RA.SUBSCRIPTION_HAS_PROVIDER
      this.emit(EVENT.RECORD_HAS_PROVIDER_CHANGED, this.hasProvider)
      return
    }
  }

  public handleReadResponse (message: any): void {
    if (this.stateMachine.state === RECORD_STATE.MERGING) {
      this.recoverRecord(message.version!, message.parsedData, message)
      this.recordServices.dirtyService.setDirty(this.name, false)
      return
    }
    this.version = message.version as number
    this.applyChange(setPath(this.data, null, message.parsedData))
    this.stateMachine.transition(RA.READ_RESPONSE)
  }

  public handleHeadResponse (message: RecordMessage): void {
    const remoteVersion = message.version!
    if (this.recordServices.dirtyService.isDirty(this.name)) {
      if (remoteVersion === -1 && this.version === 1) {
        /**
         * Record created while offline
         */
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.SUBSCRIBED)
        this.sendCreateUpdate(this.data)
      } else if (this.version === remoteVersion + 1) {
        /**
         * record updated by client while offline
        */
        this.sendUpdate(null, this.data)
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.RESUBSCRIBED)
      } else {
        /**
         * record updated by server when offline, get latest data
         */
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.INVALID_VERSION)
        this.sendRead()
        this.recordServices.readRegistry.register(this.name, this, this.handleReadResponse)
      }
    } else {
      if (remoteVersion < (this.version as number)) {
        /**
         *  deleted and created again remotely
        */
      } else if (this.version === remoteVersion) {
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.RESUBSCRIBED)
      } else {
        this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.INVALID_VERSION)
        this.sendRead()
        this.recordServices.readRegistry.register(this.name, this, this.handleReadResponse)
      }
    }
  }

  public sendRead () {
    this.services.connection.sendMessage({
      topic: TOPIC.RECORD,
      action: RA.READ,
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
        Object.assign(message, { action: RA.ERASE, path })
      } else {
        Object.assign(message, { action: RA.PATCH, path, parsedData: data })
      }
    } else {
      Object.assign(message, { action: RA.UPDATE, parsedData: data })
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
      action: RA.CREATEANDUPDATE,
      version: 1,
      parsedData: data
    })
    this.recordServices.dirtyService.setDirty(this.name, false)
  }

  /**
   * Applies incoming updates and patches to the record's dataset
   */
  public applyUpdate (message: RecordWriteMessage) {
    const version = message.version
    const data = message.parsedData

    if (this.version === null) {
      this.version = version
    } else if (this.version + 1 !== version) {
      this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.INVALID_VERSION)
      if (message.action === RA.PATCH) {
        /**
        * Request a snapshot so that a merge can be done with the read reply which contains
        * the full state of the record
        **/
        this.sendRead()
      } else {
        // @ts-ignore
        this.recoverRecord(message.version, data, message)
      }
      return
    }

    this.version = version
    let newData
    if (message.action === RA.PATCH) {
      newData = setPath(this.data, message.path as string, data)
    } else if (message.action === RA.ERASE) {
      newData = setPath(this.data, message.path as string, undefined)
    } else {
      newData = setPath(this.data, null, data)
    }
    this.applyChange(newData)
  }

  /**
   * Compares the new values for every path with the previously stored ones and
   * updates the subscribers if the value has changed
   */
  public applyChange (newData: RecordData) {
    if (this.stateMachine.inEndState) {
      return
    }

    const oldData = this.data
    this.data = newData

    const paths = this.emitter.eventNames()
    for (let i = 0; i < paths.length; i++) {
      const newValue = getPath(newData, paths[i], false)
      const oldValue = getPath(oldData, paths[i], false)

      if (newValue !== oldValue) {
        this.emitter.emit(paths[i], this.get(paths[i]))
      }
    }
  }

  /**
   * If connected sends the delete message to server, otherwise
   * we delete in local storage and transition to delete success.
   */
  private sendDelete (): void {
    this.whenReadyInternal(null, () => {
      if (this.services.connection.isConnected) {
        const message = {
          topic: TOPIC.RECORD,
          action: RA.DELETE,
          name: this.name
        }
        this.deletedTimeout = this.services.timeoutRegistry.add({
          message,
          event: EVENT.RECORD_DELETE_TIMEOUT,
          duration: this.options.recordDeleteTimeout
        })
        this.services.connection.sendMessage(message)
      } else {
        this.services.storage.delete(this.name, () => {
          this.services.timerRegistry.requestIdleCallback(() => {
            this.stateMachine.transition(RA.DELETE_SUCCESS)
          })
        })
      }
    })
  }

  /**
   * Called when a merge conflict is detected by a VERSION_EXISTS error or if an update recieved
   * is directly after the clients. If no merge strategy is configure it will emit a VERSION_EXISTS
   * error and the record will remain in an inconsistent state.
   *
   * @param   {Number} remoteVersion The remote version number
   * @param   {Object} remoteData The remote object data
   * @param   {Object} message parsed and validated deepstream message
   */
  public recoverRecord (remoteVersion: number, remoteData: RecordData, message: RecordMessage) {
    this.recordServices.mergeStrategy.merge(
      this.name,
      (this.version as number),
      this.get(),
      remoteVersion,
      remoteData,
      this.onRecordRecovered,
      this
    )
  }

  /**
 * Callback once the record merge has completed. If successful it will set the
 * record state, else emit and error and the record will remain in an
 * inconsistent state until the next update.
 */
  public onRecordRecovered (error: string | null, recordName: string, mergedData: RecordData, remoteVersion: number, remoteData: RecordData): void {
    if (error) {
      this.services.logger.error({ topic: TOPIC.RECORD }, EVENT.RECORD_VERSION_EXISTS)
    }

    this.version = remoteVersion

    const oldValue = this.data

    if (utils.deepEquals(oldValue, remoteData)) {
      return
    }

    const newValue = setPath(oldValue, null, mergedData)

    if (utils.deepEquals(mergedData, remoteData)) {
      this.applyChange(mergedData)

      // const callback = this.writeCallbacks.get(remoteVersion)
      // if (callback !== undefined) {
      //   callback(null)
      //   this.writeCallbacks.delete(remoteVersion)
      // }
    } else {
        this.applyChange(newValue)
        // this.sendUpdate(null, data, message.isWriteAck)
    }
    this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.MERGED)
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
}

const recordStateTransitions = [
    { name: RA.SUBSCRIBE, from: RECORD_STATE.INITIAL, to: RECORD_STATE.SUBSCRIBING, handler: RecordCore.prototype.onSubscribing },
    { name: RECORD_OFFLINE_ACTIONS.LOAD, from: RECORD_STATE.INITIAL, to: RECORD_STATE.LOADING_OFFLINE, handler: RecordCore.prototype.onOfflineLoading },
    { name: RECORD_OFFLINE_ACTIONS.LOADED, from: RECORD_STATE.LOADING_OFFLINE, to: RECORD_STATE.READY, handler: RecordCore.prototype.onReady },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBE, from: RECORD_STATE.LOADING_OFFLINE, to: RECORD_STATE.RESUBSCRIBING, handler: RecordCore.prototype.abortOfflineLoading },
    { name: RA.READ_RESPONSE, from: RECORD_STATE.SUBSCRIBING, to: RECORD_STATE.READY, handler: RecordCore.prototype.onReady },
    { name: RECORD_OFFLINE_ACTIONS.SUBSCRIBED, from: RECORD_STATE.RESUBSCRIBING, to: RECORD_STATE.READY },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBE, from: RECORD_STATE.INITIAL, to: RECORD_STATE.RESUBSCRIBING, handler: RecordCore.prototype.onResubscribing },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBE, from: RECORD_STATE.READY, to: RECORD_STATE.RESUBSCRIBING, handler: RecordCore.prototype.onResubscribing },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBE, from: RECORD_STATE.UNSUBSCRIBING, to: RECORD_STATE.RESUBSCRIBING, handler: RecordCore.prototype.onResubscribing },
    { name: RECORD_OFFLINE_ACTIONS.RESUBSCRIBED, from: RECORD_STATE.RESUBSCRIBING, to: RECORD_STATE.READY },
    { name: RECORD_OFFLINE_ACTIONS.INVALID_VERSION, from: RECORD_STATE.RESUBSCRIBING, to: RECORD_STATE.MERGING },
    { name: RECORD_OFFLINE_ACTIONS.MERGED, from: RECORD_STATE.MERGING, to: RECORD_STATE.READY },
    { name: RA.DELETE, from: RECORD_STATE.READY, to: RECORD_STATE.DELETING },
    { name: RA.DELETED, from: RECORD_STATE.READY, to: RECORD_STATE.DELETED, handler: RecordCore.prototype.onDeleted  },
    { name: RA.DELETE_SUCCESS, from: RECORD_STATE.DELETING, to: RECORD_STATE.DELETED, handler: RecordCore.prototype.onDeleted },
    { name: RA.UNSUBSCRIBE, from: RECORD_STATE.READY, to: RECORD_STATE.UNSUBSCRIBING },
    { name: RA.SUBSCRIBE, from: RECORD_STATE.UNSUBSCRIBING, to: RECORD_STATE.READY },
    { name: RA.UNSUBSCRIBE_ACK, from: RECORD_STATE.UNSUBSCRIBING, to: RECORD_STATE.UNSUBSCRIBED, handler: RecordCore.prototype.onUnsubscribed },
    { name: RECORD_OFFLINE_ACTIONS.INVALID_VERSION, from: RECORD_STATE.READY, to: RECORD_STATE.MERGING },
]
