import * as utils from '../util/utils'
import { EVENT } from '../constants'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION, RecordMessage } from '../../binary-protocol/src/message-constants'
import { RecordCore, WriteAckCallback } from './record-core'
import { MergeStrategy } from './merge-strategy'
import * as Emitter from 'component-emitter2'

export class AnonymousRecord extends Emitter  {
    private record: RecordCore | null
    private subscriptions: Array<utils.RecordSubscribeArguments>
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
            return this.record.set(utils.normalizeSetArguments(arguments))
        }
    }

    public setWithAck (data: any, callback?: ((error: string) => void)): Promise<void> | void
    public setWithAck (path: string, data: any, callback?: ((error: string) => void)): Promise<void> | void {
        if (this.record) {
            return this.record.setWithAck(utils.normalizeSetArguments(arguments))
        }
    }

    public subscribe (path: string, callback: (data: any) => void, triggerNow?: boolean) {
        const parameters = utils.normalizeArguments(arguments)
        this.subscriptions.push(parameters)
        if (this.record) {
            this.record.subscribe(parameters)
        }
    }

    public unsubscribe (path: string, callback: (data: any) => void) {
        const parameters = utils.normalizeArguments(arguments)

        this.subscriptions = this.subscriptions.filter(subscription => {
            return (
                subscription.path !== parameters.path ||
                subscription.callback !== parameters.callback
            )
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
