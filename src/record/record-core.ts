import { Services } from '../client'
import { Options } from '../client-options'
import { EVENT } from '../constants'
import { MergeStrategy, REMOTE_WINS } from './merge-strategy'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION, RecordMessage, RecordWriteMessage } from '../../binary-protocol/src/message-constants'
import { get as getPath, setValue as setPath } from './json-path'
import * as Emitter from 'component-emitter2'
import * as utils from '../util/utils'
import { StateMachine } from '../util/state-machine'
import { Record } from './record'
import { AnonymousRecord } from './anonymous-record'
import { List } from './list'

export type WriteAckCallback = (error: string | null) => void

const enum RECORD_OFFLINE_ACTIONS {
  LOAD,
  LOADED
}

export const enum RECORD_STATE {
  INITIAL,
  SUBSCRIBING,
  LOADING_OFFLINE,
  READY,
  MERGING,
  UNSUBSCRIBING,
  UNSUBSCRIBED,
  DELETING,
  DELETED,
  ERROR
}

export class RecordCore extends Emitter {
  public name: string
  public isReady: boolean
  public hasProvider: boolean
  public version: number

  private references: number
  private services: Services
  private options: Options
  private emitter: Emitter
  private data: object
  private mergeStrategy: MergeStrategy
  private writeCallbacks: Map<number, (error: string | null) => void>
  private stateMachine: StateMachine
  private responseTimeout: number
  private discardTimeout: number
  private deletedTimeout: number
  private offlineDirty: boolean
  private whenComplete: (recordName: string) => void

  constructor (name: string, services: Services, options: Options, whenComplete: (recordName: string) => void) {
    super()
    this.services = services
    this.options = options
    this.emitter = new Emitter()
    this.data = Object.create(null)
    this.writeCallbacks = new Map()
    this.name = name
    this.whenComplete = whenComplete
    this.references = 1
    this.offlineDirty = false

    if (typeof name !== 'string' || name.length === 0) {
      throw new Error('invalid argument name')
    }

    this.setMergeStrategy(options.mergeStrategy)

    this.stateMachine = new StateMachine(
      this.services.logger,
      {
        init: RECORD_STATE.INITIAL,
        onStateChanged: (newState: string, oldState: string) => {
          this.emitter.emit(EVENT.RECORD_STATE_CHANGED, newState)
        },
        transitions: [
          { name: RECORD_ACTION.SUBSCRIBE, from: RECORD_STATE.INITIAL, to: RECORD_STATE.SUBSCRIBING, handler: this.onSubscribing.bind(this) },
          { name: RECORD_OFFLINE_ACTIONS.LOAD, from: RECORD_STATE.INITIAL, to: RECORD_STATE.LOADING_OFFLINE, handler: this.onOfflineLoading.bind(this) },
          { name: RECORD_OFFLINE_ACTIONS.LOADED, from: RECORD_STATE.LOADING_OFFLINE, to: RECORD_STATE.READY, handler: this.onReady.bind(this) },
          { name: RECORD_ACTION.READ_RESPONSE, from: RECORD_STATE.SUBSCRIBING, to: RECORD_STATE.READY, handler: this.onReady.bind(this) },
          { name: RECORD_ACTION.DELETE, from: RECORD_STATE.READY, to: RECORD_STATE.DELETING },
          { name: RECORD_ACTION.DELETED, from: RECORD_STATE.READY, to: RECORD_STATE.DELETED, handler: this.onDeleted.bind(this)  },
          { name: RECORD_ACTION.DELETE_ACK, from: RECORD_STATE.DELETING, to: RECORD_STATE.DELETED, handler: this.onDeleted.bind(this) },
          { name: RECORD_ACTION.UNSUBSCRIBE, from: RECORD_STATE.READY, to: RECORD_STATE.UNSUBSCRIBING },
          { name: RECORD_ACTION.SUBSCRIBE, from: RECORD_STATE.UNSUBSCRIBING, to: RECORD_STATE.READY },
          { name: RECORD_ACTION.UNSUBSCRIBE_ACK, from: RECORD_STATE.UNSUBSCRIBING, to: RECORD_STATE.UNSUBSCRIBED, handler: this.onUnsubscribed.bind(this) },
          { name: RECORD_ACTION.VERSION_EXISTS, from: RECORD_STATE.READY, to: RECORD_STATE.MERGING },
        ]
      }
    )

    if (this.services.connection.isConnected) {
      this.stateMachine.transition(RECORD_ACTION.SUBSCRIBE)
    } else {
      this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.LOAD)
    }
  }

  get recordState (): RECORD_STATE {
    return this.stateMachine.state
  }

  set usages (usages: number) {
    this.references++
    if (this.references === 1) {
      this.services.timerRegistry.remove(this.discardTimeout)
      this.stateMachine.transition(RECORD_ACTION.SUBSCRIBE)
    }
  }

  get usages (): number {
    return this.references
  }

  /**
 * Convenience method, similar to promises. Executes callback
 * whenever the record is ready, either immediatly or once the ready
 * event is fired
 * @param   {[Function]} callback Will be called when the record is ready
 */
  public whenReady (context: any, callback?: (context: any) => void): Promise<any> | void {
    if (this.isReady === true) {
      if (callback) {
        callback(context)
        return
      }
      return Promise.resolve(context)
    }
    if (callback) {
      this.once(EVENT.RECORD_READY, () => callback(context))
    } else {
      return new Promise((resolve, reject) => {
        this.once(EVENT.RECORD_READY, () => resolve(context))
      })
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

    if (!this.isReady) {
      // TODO
      return
    }

    const oldValue = this.data
    let newValue
    if (path === undefined) {
      newValue = data
    } else {
      newValue = setPath(oldValue, path, data)
    }

    if (oldValue === newValue) {
      if (callback) {
        this.services.timerRegistry.requestIdleCallback(() => callback(null))
      }
      return
    }

    let writeSuccess = false
    if (callback) {
      writeSuccess = true
      if (this.services.connection.isConnected) {
        this.setupWriteCallback(this.version, callback)
      } else {
        this.services.timerRegistry.requestIdleCallback(
          () => callback(EVENT.CLIENT_OFFLINE)
        )
      }
    }

    this.applyChange(newValue)

    if (this.services.connection.isConnected) {
      this.sendUpdate(path, data, writeSuccess)
    } else {
      this.saveUpdate()
    }
  }

  /**
   * Wrapper function around the record.set that returns a promise
   * if no callback is supplied.
   * @returns {Promise} if a callback is omitted a Promise is returned with the result of the write
   */
  public setWithAck (args: utils.RecordSetArguments): Promise<void> | void {
    if (!args.callback) {
      return new Promise((resolve, reject) => {
        args.callback = error => error === null ? resolve() : reject(error)
        this.set(args)
      })
    } else {
      this.set(args)
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
 */
  public get (path?: string): any {
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
      this.whenReady(() => {
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

    this.emitter.off(args.path, args.callback)
  }

  /**
  * Removes all change listeners and notifies the server that the client is
  * no longer interested in updates for this record
  */
  public discard (): void {
    if (this.checkDestroyed('discard')) {
      return
    }
    this.whenReady(this, () => {
      this.references--
      if (this.references <= 0) {
        this.discardTimeout = this.services.timerRegistry.add({
          duration: this.options.discardTimout,
          callback: this.stateMachine.transition,
          context: this.stateMachine,
          data: RECORD_ACTION.UNSUBSCRIBE_ACK
        })
      }
    })
    this.stateMachine.transition(RECORD_ACTION.UNSUBSCRIBE)
  }

  /**
 * Deletes the record on the server.
 */
  public delete (callback?: (error: string | null) => void): Promise<void> | void {
    if (this.checkDestroyed('delete')) {
      return
    }
    this.whenReady(this, () => {
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
        this.services.storage.delete(this.name, () => {
          this.services.timerRegistry.requestIdleCallback(() => {
            this.stateMachine.transition(RECORD_ACTION.DELETE_ACK)
          })
        })
      }
    })
    this.stateMachine.transition(RECORD_ACTION.DELETE)
  }

  /**
   * Set a merge strategy to resolve any merge conflicts that may occur due
   * to offline work or write conflicts. The function will be called with the
   * local record, the remote version/data and a callback to call once the merge has
   * completed or if an error occurs ( which leaves it in an inconsistent state until
   * the next update merge attempt ).
   */
  public setMergeStrategy (mergeStrategy: MergeStrategy): void {
    if (typeof mergeStrategy === 'function') {
      this.mergeStrategy = mergeStrategy
    } else {
      throw new Error('Invalid merge strategy: Must be a Function')
    }
  }

  /**
   * Transition States
   */

  private onSubscribing (): void {
    this.services.timeoutRegistry.add({
      message: {
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.SUBSCRIBE,
        name: this.name,
      }
    })
    this.responseTimeout = this.services.timeoutRegistry.add({
      message: {
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.READ_RESPONSE,
        name: this.name
      }
    })
    this.services.connection.sendMessage({
      topic: TOPIC.RECORD,
      action: RECORD_ACTION.SUBSCRIBECREATEANDREAD,
      name: this.name
    })
  }

  private onOfflineLoading (): void {
    this.services.storage.get(this.name, (recordName: string, version: number, data: any) => {
      if (this.version === -1) {
        this.data = {}
        this.version = 1
      } else {
        this.data = data
        this.version = version
      }
      this.stateMachine.transition(RECORD_OFFLINE_ACTIONS.LOADED)
    })
  }

  private onReady (): void {
    this.isReady = true
    this.emit(EVENT.RECORD_READY)
  }

  private onUnsubscribed (): void {
    if (this.services.connection.isConnected) {
      const message = {
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.UNSUBSCRIBE,
        name: this.name
      }
      this.services.timeoutRegistry.add({ message })
      this.services.connection.sendMessage(message)
    }
    this.destroy()
  }

  private onDeleted (): void {
    this.emit(EVENT.RECORD_DELETED)
    this.destroy()
  }

  public handle (message: RecordMessage) {
    if (message.action === RECORD_ACTION.READ_RESPONSE) {
      this.version = message.version as number
      this.applyChange(setPath(this.data, null, message.parsedData))
      this.stateMachine.transition(RECORD_ACTION.READ_RESPONSE)
      return
    }

    if (message.action === RECORD_ACTION.PATCH || message.action === RECORD_ACTION.UPDATE) {
      this.applyUpdate(message as RecordWriteMessage)
      return
    }

    if (
      message.action === RECORD_ACTION.DELETE_ACK ||
      message.action === RECORD_ACTION.DELETED
    ) {
      this.stateMachine.transition(RECORD_ACTION.DELETE_ACK)
      return
    }

    if (message.action === RECORD_ACTION.VERSION_EXISTS) {
      // this.recoverRecord(message)
      return
    }

    if (message.action === RECORD_ACTION.MESSAGE_DENIED) {
      // depends on action that failed.. unsubscribe if issue was read based
      return
    }

    if (message.action === RECORD_ACTION.WRITE_ACKNOWLEDGEMENT) {
      this.handleWriteAcknowledgements(message)
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

  private sendRead () {
    this.services.connection.sendMessage({
      topic: TOPIC.RECORD,
      action: RECORD_ACTION.READ,
      name: this.name
    })
  }

  private handleWriteAcknowledgements (message: RecordMessage) {
    const versions: Array<number> = message.parsedData[0]
    const error: string = message.parsedData[1]
    for (let i = 0; i < versions.length; i++) {
      const version = versions[i]
      const callback = this.writeCallbacks.get(version)
      if (callback) {
        this.writeCallbacks.delete(version)
        callback(error)
      }
    }
  }

  private saveUpdate (): void {
    if (!this.offlineDirty) {
      this.version++
      this.offlineDirty = true
    }
    this.services.storage.set(this.name, this.version, this.data, () => {})
  }

  private sendUpdate (path: string | null = null, data: any, writeSuccess: boolean) {
    this.version++

    if (data === undefined && path !== null) {
      this.services.connection.sendMessage({
        topic: TOPIC.RECORD,
        action: writeSuccess ? RECORD_ACTION.ERASE_WITH_WRITE_ACK : RECORD_ACTION.ERASE,
        name: this.name,
        path,
        version: this.version
      })
      return
    }

    if (path === null) {
      this.services.connection.sendMessage({
        topic: TOPIC.RECORD,
        action: writeSuccess ? RECORD_ACTION.UPDATE_WITH_WRITE_ACK : RECORD_ACTION.UPDATE,
        name: this.name,
        parsedData: data,
        version: this.version
      })
      return
    }

    this.services.connection.sendMessage({
      topic: TOPIC.RECORD,
      action: writeSuccess ? RECORD_ACTION.PATCH_WITH_WRITE_ACK : RECORD_ACTION.PATCH,
      name: this.name,
      path,
      parsedData: data,
      version: this.version
    })
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
      if (message.action === RECORD_ACTION.PATCH) {
        /**
        * Request a snapshot so that a merge can be done with the read reply which contains
        * the full state of the record
        **/
        this.sendRead()
      } else {
        this.recoverRecord(version, data, message)
      }
      return
    }

    this.version = version
    this.applyChange(setPath(this.data, message.path || null, data))
  }

  /**
   * Compares the new values for every path with the previously stored ones and
   * updates the subscribers if the value has changed
   */
  private applyChange (newData: any) {
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
   * Called when a merge conflict is detected by a VERSION_EXISTS error or if an update recieved
   * is directly after the clients. If no merge strategy is configure it will emit a VERSION_EXISTS
   * error and the record will remain in an inconsistent state.
   *
   * @param   {Number} remoteVersion The remote version number
   * @param   {Object} remoteData The remote object data
   * @param   {Object} message parsed and validated deepstream message
   */
  private recoverRecord (remoteVersion: number, remoteData: any, message: RecordMessage) {
    if (this.mergeStrategy) {
      this.mergeStrategy(
        this,
        remoteData,
        remoteVersion,
        this.onRecordRecovered.bind(this, remoteVersion, remoteData, message)
      )
      return
    }

    this.services.logger.error(message, EVENT.RECORD_VERSION_EXISTS, { remoteVersion, record: this })
  }

  /**
 * Callback once the record merge has completed. If successful it will set the
 * record state, else emit and error and the record will remain in an
 * inconsistent state until the next update.
 *
 * @param   {Number} remoteVersion The remote version number
 * @param   {Object} remoteData The remote object data
 * @param   {Object} message parsed and validated deepstream message
 */
  private onRecordRecovered (
    remoteVersion: number, remoteData: any, message: RecordWriteMessage, error: string | null, data: any
  ): void {
    if (error) {
      this.services.logger.error(message, EVENT.RECORD_VERSION_EXISTS)
    }

    const oldVersion = this.version
    this.version = remoteVersion

    const oldValue = this.data

    if (utils.deepEquals(oldValue, remoteData)) {
      return
    }

    const newValue = setPath(oldValue, null, data)

    if (utils.deepEquals(data, remoteData)) {
      this.applyChange(data)

      const callback = this.writeCallbacks.get(remoteVersion)
      if (callback !== undefined) {
        callback(null)
        this.writeCallbacks.delete(remoteVersion)
      }
      return
    }

    if (message.isWriteAck) {
      const callback = this.writeCallbacks.get(oldVersion)
      if (callback) {
        this.writeCallbacks.delete(remoteVersion)
        this.setupWriteCallback(this.version, callback)
      }
    }

    this.sendUpdate(null, data, message.isWriteAck)
    this.applyChange(newValue)
  }

  /**
 * A quick check that's carried out by most methods that interact with the record
 * to make sure it hasn't been destroyed yet - and to handle it gracefully if it has.
 */
  private checkDestroyed (methodName: string): boolean {
    if (this.stateMachine.inEndState) {
      this.services.logger.error(
        { topic: TOPIC.RECORD },
        EVENT.RECORD_ALREADY_DESTROYED,
        `Can't invoke '${methodName}'. Record '${this.name}' is already destroyed`
      )
      return true
    }

    return false
  }

  private setupWriteCallback (version: number, callback: WriteAckCallback) {
    this.writeCallbacks.set(this.version + 1, callback)
  }

  /**
   * Destroys the record and nulls all
   * its dependencies
   */
  private destroy () {
    this.services.timerRegistry.remove(this.deletedTimeout)
    this.services.timerRegistry.remove(this.discardTimeout)
    this.services.timerRegistry.remove(this.responseTimeout)
    this.emitter.off()
    this.isReady = false
    this.whenComplete(this.name)
  }
}
