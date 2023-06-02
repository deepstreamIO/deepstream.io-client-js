import * as utils from '../util/utils'
import { EVENT, RecordMessage } from '../constants'
import { RecordCore, WriteAckCallback } from './record-core'
import { Emitter } from '../util/emitter'

type ListSubscriptionCallback = (entries: string[]) => void
type Head = {p: string, n: string}
type Node = {d: string, p: string, n: string}

export class Dequeue extends Emitter {
    public  debugId = this.record.getDebugId()
    private wrappedFunctions: Map<Function, Function> = new Map()
    private originalApplyUpdate: Function

    private beforeStructure: any
    private headPath: string = 'h'
    private emptyHead: Head = {p: '', n: ''}

    private hasAddListener: boolean = false
    private hasRemoveListener: boolean = false
    private hasMoveListener: boolean = false
    private subscriptions: utils.RecordSubscribeArguments[] = []
    private lastEntries: string[] = []
    private lastVersion: number = 0

    constructor (private record: RecordCore<Dequeue>) {
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

    public whenReady (): Promise<Dequeue>
    public whenReady (callback: ((dq: Dequeue) => void)): void
    public whenReady (callback?: ((dq: Dequeue) => void)): void | Promise<Dequeue> {
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
      // did we computed already?
      if (this.version === this.lastVersion) {
        return this.lastEntries
      }
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      let next = head.n
      const entries = []
      while(next) {
        const node = this.record.get(next) as Node
        entries.push(node.d)
        next = node.n
      }
      // memoize
      this.lastVersion = this.version
      this.lastEntries = entries

      return entries as string[]
    }

    /**
   * Returns true if the list is empty
   */
    public isEmpty (): boolean {
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      return !head.n && !head.p
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
        const errorMsg = 'entries must be an array'

        if (!(entries instanceof Array)) {
            throw new Error(errorMsg)
        }

        if (entries.length === 0) {
          this.record.set({data: {[this.headPath]: this.emptyHead}, callback})
          return
        }

        const head = {n: '0', p: `${entries.length -1}`}
        const nodes = {} as Record<string,Node>
        for (let index = 0; index < entries.length; index++) {
          nodes[index] = {
            d: entries[index],
            n: `${index + 1}`,
            p: `${index - 1}`
          }
          if (index === 0) {
            /* tslint:disable:no-string-literal */
            nodes[index]['p'] = ''
            /* tslint:enable:no-string-literal */

          }
          if (index === entries.length - 1) {
            /* tslint:disable:no-string-literal */
            nodes[index]['n'] = ''
            /* tslint:enable:no-string-literal */
          }
        }
        this.beforeChange()
        this.record.set({ data: {[this.headPath]: head, ...nodes}, callback })
        this.afterChange()
    }

    /**
     * Get last entry
     */
    public getLast () : string {
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      if (!head.p) return ''
      const node = this.record.get(head.p) as Node
      return node.d
    }

    /**
     * Get first entry
     */
    public getFirst () : string {
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      if (!head.n) return ''
      const node = this.record.get(head.n) as Node
      return node.d
    }

    /**
     * Remove last value and return it
     *
     */
    public pop () : string {
      // when the array is 1 or 2 entries its easier to just set it again to avoid complications with the head reference
      const entries = this.getEntries()
      if (entries.length < 3) {
        const pop = entries.pop() || ''
        this.setEntries(entries)
        return pop
      }
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      if (!head.p) return ''
      const last = this.record.get(head.p) as Node
      this.beforeChange()
      // update head
      this.record.set({path: `${this.headPath}.p`, data: last.p})
      // update last node
      if (last.p) this.record.set({path: `${last.p}.n`, data: ''})
      // erase node
      this.record.set({path: head.p, data: undefined})

      this.afterChange()
      return last.d
    }

    /**
     * Remove first value and return it
     */
    public shift () : string {
      // when the array is 1 or 2 entries its easier to just set it again to avoid complications with the head reference
      const entries = this.getEntries()
      if (entries.length < 3) {
        const shift = entries.shift() || ''
        this.setEntries(entries)
        return shift
      }
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      if (!head.n) return ''
      const first = this.record.get(head.n) as Node
      this.beforeChange()
      // update head
      this.record.set({path: `${this.headPath}.n`, data: first.n})
      // update first node
      if (first.n) this.record.set({path: `${first.n}.p`, data: ''})
      // erase node
      this.record.set({path: head.n, data: undefined})

      this.afterChange()
      return first.d
    }

    /**
     * Get first available key for inserting node
     */
    private getNodeKey () : string {
      const sortedKeys = Object.keys(this.record.get() as Record<string, Node>).sort((a, b) => Number(a) - Number(b))
      let key = `${sortedKeys.length}`
      for (let index = 1; index < sortedKeys.length; index++) {
        if (index !== Number(sortedKeys[index])) {
          key = `${index}`
          break
        }
      }
      return key
    }

    /**
     * Add value at first position
     *
     * @param {String} entry
     */
    public unshift (entry: string) : void {
      // check if empty
      if (this.isEmpty()) {
        this.setEntries([entry])
        return
      }
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      const key = this.getNodeKey()
      this.beforeChange()
      // set node
      this.record.set({path: key, data: {d: entry, p: '', n: head.n}})
      // update previous first node
      if (head.n) this.record.set({path: `${head.n}.p`, data: key})
      // update head
      this.record.set({path: `${this.headPath}.n`, data: key})
      this.afterChange()
    }

    /**
     * Add value at last position
     *
     * @param {String} entry
     */
    public push (entry: string) : void {
      // check if empty
      if (this.isEmpty()) {
        this.setEntries([entry])
        return
      }
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      const key = this.getNodeKey()
      this.beforeChange()
      // set node
      this.record.set({path: key, data: {d: entry, p: head.p, n: ''}})
      // update previous last node
      if (head.p) this.record.set({path: `${head.p}.n`, data: key})
      // update head
      this.record.set({path: `${this.headPath}.p`, data: key})
      this.afterChange()
    }

    /**
     * Remove a node
     */
    private removeNode (nodeKey: string, node: Node) {
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      this.beforeChange()
      // update previous and next node
      if (node.p) this.record.set({path: `${node.p}.n`, data: node.n})
      if (node.n) this.record.set({path: `${node.n}.p`, data: node.p})
      // if last node was removed update head
      if (head.p === nodeKey) {
        this.record.set({path: `${this.headPath}.p`, data: node.p})
      }
      // if first node was removed update head
      if (head.n === nodeKey) {
        this.record.set({path: `${this.headPath}.n`, data: node.n})
      }
      // erase node
      this.record.set({path: nodeKey, data: undefined})

      this.afterChange()
    }

    /**
     * Removes an entry from the list. If no index is given it will remove the first occurrence
     *
     * @param {String} entry
     * @param {Number} [index]
     */
    public removeEntry (entry: string, index?: number) {
      const head = this.record.get(this.headPath) as Head || this.emptyHead
      let next = head.n
      let position = 0
      while(next) {
        const node = this.record.get(next) as Node
        if (node.d === entry) {
          if (!index) {
            this.removeNode(next, node)
            break
          }
          if (index && index === position) {
            this.removeNode(next, node)
            break
          }
        }
        ++position
        next = node.n
      }
      if (!next) {
        // got to the end without result
        throw new Error('no entry removed')
      }
    }

  /**
   * Inserts an entry in the list. At index 0 is equivalent to unshift, at index = entries.length - 1 it will be inserted before last node, unlike push.
   *
   * @param {String} entry
   * @param {Number} [index]
   */
    public insertEntry (entry: string, index: number) {
      const hasIndex = this.hasIndex(index)

      if (index === 0) {
        this.unshift(entry)
        return
      }

      if (hasIndex) {
        const head = this.record.get(this.headPath) as Head || this.emptyHead
        let next = head.n
        let position = 0
        while(next) {
          const node = this.record.get(next) as Node
          if (index === position) {
            const key = this.getNodeKey()
            this.beforeChange()
            // set node
            this.record.set({path: key, data: {d: entry, n: next, p: node.p}})
            // update next node
            this.record.set({path: `${next}.p`, data: key})
            // update previous node
            if (node.p) this.record.set({path: `${node.p}.n`, data: key})

            this.afterChange()
            break
          }
          ++position
          next = node.n
        }

        if (!next) {
          // got to the end without inserting
          throw new Error('Index out of range')
        }
      }
    }

  /**
   * Proxies the underlying Record's subscribe method.
   */
    public subscribe (callback: ListSubscriptionCallback): void
    public subscribe (position: string, callback: ListSubscriptionCallback): void
    public subscribe (positionOrCallback?: ListSubscriptionCallback | string, callback?: ListSubscriptionCallback): void {
        const parameters = utils.normalizeArguments(arguments)

        if (parameters.path) {
          if (parameters.path === 'first') {
            parameters.path = `${this.headPath}.n`
          }
          else if (parameters.path === 'last') {
            parameters.path = `${this.headPath}.p`
          } else {
            throw new Error('Position must be "first" or "last" element')
          }
        }

        // Make sure the callback is invoked with an empty array for new records
        const listCallback = function (scope: any, cb: Function) {
          if (parameters.path) {
            if (parameters.path === `${scope.headPath}.p`) {
              cb(scope.getLast())
            }
            if (parameters.path === `${scope.headPath}.n`) {
              cb(scope.getFirst())
            }
          } else {
            cb(scope.getEntries())
          }
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
    public unsubscribe (callback: ListSubscriptionCallback): void
    public unsubscribe (position: string, callback: ListSubscriptionCallback): void
    public unsubscribe (positionOrCallback?: ListSubscriptionCallback | string, callback?: ListSubscriptionCallback): void {
      const parameters = utils.normalizeArguments(arguments)
      if (parameters.path) {
        if (parameters.path === 'first') {
          parameters.path = `${this.headPath}.n`
        }
        else if (parameters.path === 'last') {
          parameters.path = `${this.headPath}.p`
        } else {
          throw new Error('Position must be "first" or "last" element')
        }
      }

      const listenCallback = this.wrappedFunctions.get(parameters.callback)
      parameters.callback = listenCallback as (data: any) => void
      this.wrappedFunctions.delete(parameters.callback)
      this.subscriptions = this.subscriptions.filter((subscription: any) => {
        if (!parameters.callback && (subscription.path === parameters.path)) return false
        if (parameters.callback && (subscription.path === parameters.path && subscription.callback === parameters.callback)) return false
        return true
    })

      this.record.unsubscribe(parameters, this)
    }

    /**
     * Proxies the underlying Record's _update method.
     */
    private applyUpdate  (message: RecordMessage) {
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
