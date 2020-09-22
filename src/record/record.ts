import * as utils from '../util/utils'
import { EVENT, JSONObject, RecordData } from '../constants'
import { RecordCore, WriteAckCallback } from './record-core'
import { MergeStrategy } from './merge-strategy'
import { Emitter } from '../util/emitter'

export type SubscriptionCallback = (data: any) => void

export class Record extends Emitter  {
    public  debugId = this.record.getDebugId()
    private subscriptions: utils.RecordSubscribeArguments[] = []

    constructor (private record: RecordCore<Record>) {
        super()
        this.record.on(EVENT.RECORD_READY, this.emit.bind(this, EVENT.RECORD_READY, this), this)
        this.record.on(EVENT.RECORD_DISCARDED, this.emit.bind(this, EVENT.RECORD_DISCARDED), this)
        this.record.on(EVENT.RECORD_DELETED, this.emit.bind(this, EVENT.RECORD_DELETED), this)
        this.record.on(EVENT.RECORD_ERROR, this.emit.bind(this, EVENT.RECORD_ERROR), this)

        this.record.addReference(this)
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

    get hasProvider (): boolean {
        return this.record.hasProvider
    }

    public whenReady (): Promise<Record>
    public whenReady (callback: ((record: Record) => void)): void
    public whenReady (callback?: ((record: Record) => void)): void | Promise<Record> {
        if (callback) {
            this.record.whenReady(this, callback)
        } else {
            return this.record.whenReady(this)
        }
    }

    public get (path?: string): any {
        return this.record.get(path)
    }

    public set (data: JSONObject, callback?: WriteAckCallback): void
    public set (path: string, data: RecordData | undefined, callback?: WriteAckCallback): void
    public set (dataOrPath: string | JSONObject, dataOrCallback: WriteAckCallback | RecordData | undefined, callback?: WriteAckCallback): void {
        return this.record.set(utils.normalizeSetArguments(arguments))
    }

    public setWithAck (data: JSONObject): Promise<void>
    public setWithAck (data: JSONObject, callback: ((error: string) => void)): void
    public setWithAck (path: string, data: RecordData | undefined): Promise<void>
    public setWithAck (path: string, data: RecordData | undefined, callback: ((error: string) => void)): void
    public setWithAck (data: JSONObject, callback?: ((error: string) => void)): Promise<void> | void
    public setWithAck (pathOrData: string | JSONObject, dataOrCallback?: RecordData | ((error: string) => void) | undefined, callback?: ((error: string) => void)): Promise<void> | void {
        return this.record.setWithAck(utils.normalizeSetArguments(arguments))
    }

    /**
     * Deletes a path from the record. Equivalent to doing `record.set(path, undefined)`
     *
     * @param {String} path The path to be deleted
     */
    public erase (path: string): void {
        if (!path) {
            throw new Error('unable to erase record data without path, consider using `delete`')
        }
        this.set(path, undefined)
    }

    /**
     * Deletes a path from the record and either takes a callback that will be called when the
     * write has been done or returns a promise that will resolve when the write is done.
     */
    public eraseWithAck (path: string): Promise<void>
    public eraseWithAck (path: string, callback: ((error: string) => void)): void
    public eraseWithAck (path: string, callback?: ((error: string) => void)): Promise<void> | void {
        if (!path) {
            throw new Error('unable to erase record data without path, consider using `delete`')
        }

        if (callback) {
            this.setWithAck(path, undefined, callback)
        } else {
            return this.setWithAck(path, undefined)
        }
    }

    public subscribe (callback: SubscriptionCallback, triggerNow?: boolean): void
    public subscribe (path: string, callback: SubscriptionCallback, triggerNow?: boolean): void
    public subscribe (pathOrCallback: string | SubscriptionCallback , callbackOrTriggerNow?: SubscriptionCallback | boolean, triggerNow?: boolean): void {
        const parameters = utils.normalizeArguments(arguments)
        this.subscriptions.push(parameters)
        this.record.subscribe(parameters, this)
    }

    public unsubscribe (callback: SubscriptionCallback): void
    public unsubscribe (path: string, callback: SubscriptionCallback): void
    public unsubscribe (pathOrCallback: string | SubscriptionCallback, callback?: SubscriptionCallback): void {
        const parameters = utils.normalizeArguments(arguments)
        this.subscriptions = this.subscriptions.filter((subscription: any) => {
          if (!parameters.callback && (subscription.path === parameters.path)) return false
          if (parameters.callback && (subscription.path === parameters.path && subscription.callback === parameters.callback)) return false
          return true
        })

        this.record.unsubscribe(parameters, this)
    }

    public discard (): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.record.unsubscribe(this.subscriptions[i], this)
        }
        this.record.removeReference(this)
        this.record.removeContext(this)
    }

    public delete (callback?: (error: string | null) => void): void | Promise<void> {
        return this.record.delete(callback)
    }

    public setMergeStrategy (mergeStrategy: MergeStrategy): void {
        this.record.setMergeStrategy(mergeStrategy)
    }
}
