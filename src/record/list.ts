import * as utils from '../util/utils'
import { EVENT, RecordMessage } from '../constants'
import { RecordCore, WriteAckCallback } from './record-core'
import { Emitter } from '../util/emitter'

export class List extends Emitter {
    public  debugId = this.record.getDebugId()
    private wrappedFunctions: Map<Function, Function> = new Map()
    private originalApplyUpdate: Function
    private beforeStructure: any

    private hasAddListener: boolean = false
    private hasRemoveListener: boolean = false
    private hasMoveListener: boolean = false
    private subscriptions: utils.RecordSubscribeArguments[] = []

    constructor (private record: RecordCore<List>) {
        super()
        this.originalApplyUpdate = this.record.applyUpdate.bind(this.record)
        this.record.applyUpdate = this.applyUpdate.bind(this)
        this.record.addReference(this)
        this.record.on('discard', () => this.emit('discard', this), this)
        this.record.on('delete', () => this.emit('delete', this), this)
        this.record.on('error', (...args: any[]) => this.emit('error', ...args), this)
    }

    get name (): string {
        return this.record.name
    }

    get isReady (): boolean {
        return this.record.isReady
    }

    get version (): number {
        return this.record.version as number
    }

    public whenReady (): Promise<List>
    public whenReady (callback: ((list: List) => void)): void
    public whenReady (callback?: ((list: List) => void)): void | Promise<List> {
        if (callback) {
            this.record.whenReady(this, callback)
        } else {
            return this.record.whenReady(this)
        }
    }

    public discard (): void {
      this.destroy()
      this.record.removeReference(this)
    }

    public delete (callback: (error: string | null) => void): void
    public delete (): Promise<void>
    public delete (callback?: (error: string | null) => void): void | Promise<void> {
      this.destroy()
      return this.record.delete(callback)
    }

    /**
     * Returns the array of list entries or an
     * empty array if the list hasn't been populated yet.
     */
    public getEntries (): string[] {
        const entries = this.record.get()

        if (!(entries instanceof Array)) {
            return []
        }

        return entries as string[]
    }

    /**
   * Returns true if the list is empty
   */
    public isEmpty (): boolean {
        return this.getEntries().length === 0
    }

    /**
    * Updates the list with a new set of entries
    */
    public setEntriesWithAck (entries: string[]): Promise<void>
    public setEntriesWithAck (entries: string[], callback: WriteAckCallback): void
    public setEntriesWithAck (entries: string[], callback?: WriteAckCallback): Promise<void> | void {
        if (!callback) {
            return new Promise(( resolve, reject ) => {
                this.setEntries(entries, (error: string | null) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve()
                    }
                })
            })
        }
        this.setEntries(entries, callback)
    }

    /**
    * Updates the list with a new set of entries
    */
    public setEntries (entries: string[], callback?: WriteAckCallback) {
        const errorMsg = 'entries must be an array of record names'
        let i

        if (!(entries instanceof Array)) {
            throw new Error(errorMsg)
        }

        for (i = 0; i < entries.length; i++) {
            if (typeof entries[i] !== 'string') {
                throw new Error(errorMsg)
            }
        }

        this.beforeChange()
        this.record.set({ data: entries, callback })
        this.afterChange()
    }

    /**
     * Removes an entry from the list
     *
     * @param {String} entry
     * @param {Number} [index]
     */
    public removeEntry (entry: string, index?: number, callback?: WriteAckCallback) {
        // @ts-ignore
        const currentEntries: string[] = this.record.get()
        const hasIndex = this.hasIndex(index)
        const entries: string[] = []
        let i

        for (i = 0; i < currentEntries.length; i++) {
            if (currentEntries[i] !== entry || (hasIndex && index !== i)) {
                entries.push(currentEntries[i])
            }
        }
        this.beforeChange()
        this.record.set({ data: entries, callback })
        this.afterChange()
    }

    /**
   * Adds an entry to the list
   *
   * @param {String} entry
   * @param {Number} [index]
   */
    public addEntry (entry: string, index?: number, callback?: WriteAckCallback) {
        if (typeof entry !== 'string') {
            throw new Error('Entry must be a recordName')
        }

        const hasIndex = this.hasIndex(index)
        const entries = this.getEntries()
        if (hasIndex) {
            entries.splice(index as number, 0, entry)
        } else {
            entries.push(entry)
        }
        this.beforeChange()
        this.record.set({ data: entries, callback })
        this.afterChange()
    }

    /**
   * Proxies the underlying Record's subscribe method. Makes sure
   * that no path is provided
   */
    public subscribe (callback: (entries: string[]) => void) {
        const parameters = utils.normalizeArguments(arguments)

        if (parameters.path) {
            throw new Error('path is not supported for List.subscribe')
        }

        // Make sure the callback is invoked with an empty array for new records
        const listCallback = function (scope: any, cb: Function) {
            cb(scope.getEntries())
        }.bind(this, this, parameters.callback)

        /**
        * Adding a property onto a function directly is terrible practice,
        * and we will change this as soon as we have a more seperate approach
        * of creating lists that doesn't have records default state.
        *
        * The reason we are holding a referencing to wrapped array is so that
        * on unsubscribe it can provide a reference to the actual method the
        * record is subscribed too.
        **/
        this.wrappedFunctions.set(parameters.callback, listCallback)
        parameters.callback = listCallback

        this.subscriptions.push(parameters)
        this.record.subscribe(parameters, this)
    }

    /**
   * Proxies the underlying Record's unsubscribe method. Makes sure
   * that no path is provided
   */
    public unsubscribe (callback: (entries: string[]) => void) {
        const parameters = utils.normalizeArguments(arguments)

        if (parameters.path) {
            throw new Error('path is not supported for List.unsubscribe')
        }

        const listenCallback = this.wrappedFunctions.get(parameters.callback)
        parameters.callback = listenCallback as (data: any) => void
        this.wrappedFunctions.delete(parameters.callback)
        this.subscriptions = this.subscriptions.filter((subscription: any) => {
          if (parameters.callback && parameters.callback !== subscription.callback) return true
          return false
        })

        this.record.unsubscribe(parameters, this)
    }

/**
 * Proxies the underlying Record's _update method. Set's
 * data to an empty array if no data is provided.
 */
private applyUpdate  (message: RecordMessage) {
    if (!(message.parsedData instanceof Array)) {
        message.parsedData = []
    }

    this.beforeChange()
    this.originalApplyUpdate(message)
    this.afterChange()
  }

  /**
   * Validates that the index provided is within the current set of entries.
   */
  private hasIndex (index?: number) {
    let hasIndex = false
    const entries = this.getEntries()
    if (index !== undefined) {
      if (isNaN(index)) {
        throw new Error('Index must be a number')
      }
      if (index !== entries.length && (index >= entries.length || index < 0)) {
        throw new Error('Index must be within current entries')
      }
      hasIndex = true
    }
    return hasIndex
  }

  /**
   * Establishes the current structure of the list, provided the client has attached any
   * add / move / remove listener
   *
   * This will be called before any change to the list, regardsless if the change was triggered
   * by an incoming message from the server or by the client
   */
  private beforeChange (): void {
    this.hasAddListener = this.hasListeners(EVENT.ENTRY_ADDED_EVENT)
    this.hasRemoveListener = this.hasListeners(EVENT.ENTRY_REMOVED_EVENT)
    this.hasMoveListener = this.hasListeners(EVENT.ENTRY_MOVED_EVENT)

    if (this.hasAddListener || this.hasRemoveListener || this.hasMoveListener) {
      this.beforeStructure = this.getStructure()
    } else {
      this.beforeStructure = null
    }
  }

  /**
   * Compares the structure of the list after a change to its previous structure and notifies
   * any add / move / remove listener. Won't do anything if no listeners are attached.
   */
  private afterChange (): void {
    if (this.beforeStructure === null) {
      return
    }

    const after = this.getStructure()
    const before = this.beforeStructure
    let entry
    let i

    if (this.hasRemoveListener) {
      for (entry in before) {
        for (i = 0; i < before[entry].length; i++) {
          if (after[entry] === undefined || after[entry][i] === undefined) {
            this.emit(EVENT.ENTRY_REMOVED_EVENT, entry, before[entry][i])
          }
        }
      }
    }

    if (this.hasAddListener || this.hasMoveListener) {
      for (entry in after) {
        if (before[entry] === undefined) {
          for (i = 0; i < after[entry].length; i++) {
            this.emit(EVENT.ENTRY_ADDED_EVENT, entry, after[entry][i])
          }
        } else {
          for (i = 0; i < after[entry].length; i++) {
            if (before[entry][i] !== after[entry][i]) {
              if (before[entry][i] === undefined) {
                this.emit(EVENT.ENTRY_ADDED_EVENT, entry, after[entry][i])
              } else {
                this.emit(EVENT.ENTRY_MOVED_EVENT, entry, after[entry][i])
              }
            }
          }
        }
      }
    }
  }

  /**
   * Iterates through the list and creates a map with the entry as a key
   * and an array of its position(s) within the list as a value, e.g.
   *
   * {
   *   'recordA': [ 0, 3 ],
   *   'recordB': [ 1 ],
   *   'recordC': [ 2 ]
   * }
   */
  private getStructure (): any {
    const structure: any = {}
    let i
    const entries = this.getEntries()

    for (i = 0; i < entries.length; i++) {
      if (structure[entries[i]] === undefined) {
        structure[entries[i]] = [i]
      } else {
        structure[entries[i]].push(i)
      }
    }

    return structure
  }

  private destroy () {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.record.unsubscribe(this.subscriptions[i], this)
    }
    this.wrappedFunctions.clear()
    this.record.removeContext(this)
  }

}
