import * as utils from '../util/utils'
import { EVENT } from '../constants'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION, RecordMessage } from '../../binary-protocol/src/message-constants'
import { RecordCore, WriteAckCallback } from './record-core'
import { MergeStrategy } from './merge-strategy'
import * as Emitter from 'component-emitter2'

export class AnonymousRecord extends Emitter  {
    private record: RecordCore | null
    private subscriptions: Array<{ callback: Function, path: string, data: any }>
    private getRecordCore: (recordName: string) => RecordCore

    constructor (getRecordCore: (recordName: string) => RecordCore) {
        super()
        this.record = null
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
        return this.record.version
    }

    public whenReady (callback?: ((record: AnonymousRecord) => void)): void | Promise<AnonymousRecord> {
        if (this.record) {
            return this.record.whenReady(this, callback)
        }
    }

    public setName (recordName: string, callback: (record: AnonymousRecord) => void): void | Promise<AnonymousRecord> {
        if (this.name === recordName) {
            return
        }

        this.discard()

        this.record = this.getRecordCore(recordName)

        for (let i = 0; i < this.subscriptions.length; i++) {
          this.record.subscribe(this.subscriptions[i])
        }

        this.emit('nameChanged', recordName)
        return this.record.whenReady(callback)
    }

    public get (path?: string): any {
        if (this.record) {
            return this.record.get(path)
        }
    }

    public set (data: any, callback?: WriteAckCallback): void
    public set (path: string, data: any, callback?: WriteAckCallback): void {
        if (this.record) {
            return this.record.set(path, data, callback)
        }
    }

    public setWithAck (data: any, callback?: ((error: string) => void)): Promise<void> | undefined
    public setWithAck (path: string, data: any, callback?: ((error: string) => void)): Promise<void> | undefined {
        if (this.record) {
            return this.record.setWithAck(path, data, callback)
        }
    }

    public subscribe (path: string, callback: (data: any) => void, triggerNow?: boolean)
    public subscribe (...rest) {
        const parameters = utils.normalizeArguments(rest)
        this.subscriptions.push(parameters)
        if (this.record) {
            this.record.subscribe(parameters)
        }
    }

    public unsubscribe (path: string, callback: (data: any) => void)
    public unsubscribe (...rest) {
        const parameters = utils.normalizeArguments(rest)

        this.subscriptions = this.subscriptions.filter(subscription => {
            if (
                subscription.path !== parameters.path ||
                subscription.callback !== parameters.callback
            ) {
              return true
            }
        })

        if (this.record) {
            this.record.unsubscribe(parameters)
        }
    }

    public discard (): void {
        if (this.record) {
            for (let i = 0; i < this.subscriptions.length; i++) {
                this.record.unsubscribe(this.subscriptions[i])
            }
            return this.record.discard()
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
