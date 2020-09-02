import * as utils from '../util/utils'
import { RecordCore, WriteAckCallback } from './record-core'
import { MergeStrategy } from './merge-strategy'
import { Emitter } from '../util/emitter'

export class AnonymousRecord extends Emitter  {
    private record: RecordCore<AnonymousRecord> | null
    private subscriptions: utils.RecordSubscribeArguments[]
    private getRecordCore: (recordName: string) => RecordCore<AnonymousRecord>

    constructor (getRecordCore: (recordName: string) => RecordCore<AnonymousRecord>) {
        super()
        this.record = null
        this.subscriptions = []
        this.getRecordCore = getRecordCore
    }

    get name (): string {
        if (!this.record) {
            return ''
        }
        return this.record.name
    }

    get isReady (): boolean {
        if (!this.record) {
            return false
        }
        return this.record.isReady
    }

    get version (): number {
        if (!this.record) {
            return -1
        }
        return this.record.version as number
    }

    public whenReady (): Promise<AnonymousRecord>
    public whenReady (callback: ((record: AnonymousRecord) => void)): void
    public whenReady (callback?: ((record: AnonymousRecord) => void)): void | Promise<AnonymousRecord> {
        if (this.record) {
            if (callback) {
                this.record.whenReady(this, callback)
            } else {
                return this.record.whenReady(this)
            }
        }
    }

    public setName (recordName: string): Promise<AnonymousRecord>
    public setName (recordName: string, callback: (record: AnonymousRecord) => void): void
    public setName (recordName: string, callback?: (record: AnonymousRecord) => void): void | Promise<AnonymousRecord> {
        if (this.name === recordName) {
            return
        }

        this.discard()

        this.record = this.getRecordCore(recordName)
        this.record.addReference(this)

        for (let i = 0; i < this.subscriptions.length; i++) {
          this.record.subscribe(this.subscriptions[i], this)
        }

        this.emit('nameChanged', recordName)

        if (callback) {
            this.record.whenReady(this, callback)
        } else {
            return this.record.whenReady(this)
        }
    }

    public get (path?: string): any {
        if (this.record) {
            return this.record.get(path)
        }
    }

    public set (data: any, callback?: WriteAckCallback): void
    public set (path: string, data: any, callback?: WriteAckCallback): void {
        if (this.record) {
            return this.record.set(utils.normalizeSetArguments(arguments))
        }
    }

    public setWithAck (data: any, callback?: ((error: string) => void)): Promise<void> | void
    public setWithAck (path: string, data: any, callback?: ((error: string) => void)): Promise<void> | void {
        if (this.record) {
            return this.record.setWithAck(utils.normalizeSetArguments(arguments))
        }
    }

    public erase (path: string): void {
        if (this.record) {
            return this.record.set(utils.normalizeSetArguments(arguments))
        }
    }

    public eraseWithAck (path: string, callback?: ((error: string) => void)): Promise<void> | void {
        if (this.record) {
            return this.record.setWithAck(utils.normalizeSetArguments(arguments))
        }
    }

    public subscribe (path: string, callback: (data: any) => void, triggerNow?: boolean) {
        const parameters = utils.normalizeArguments(arguments)
        this.subscriptions.push(parameters)
        if (this.record) {
            this.record.subscribe(parameters, this)
        }
    }

    public unsubscribe (path: string, callback: (data: any) => void) {
        const parameters = utils.normalizeArguments(arguments)

        this.subscriptions = this.subscriptions.filter(subscription => {
          if (!parameters.callback && (subscription.path === parameters.path)) return false
          if (parameters.callback && (subscription.path === parameters.path && subscription.callback === parameters.callback)) return false
          return true
        })

        if (this.record) {
            this.record.unsubscribe(parameters, this)
        }
    }

    public discard (): void {
        if (this.record) {
            for (let i = 0; i < this.subscriptions.length; i++) {
                this.record.unsubscribe(this.subscriptions[i], this)
            }
            return this.record.removeReference(this)
        }
    }

    public delete (callback?: (error: string | null) => void): void | Promise<void> {
        if (this.record) {
            return this.record.delete(callback)
        }
    }

    public setMergeStrategy (mergeStrategy: MergeStrategy): void {
        if (this.record) {
            this.record.setMergeStrategy(mergeStrategy)
        }
    }
}
