import * as utils from '../util/utils'
import { EVENT } from '../constants'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION, RecordMessage } from '../../binary-protocol/src/message-constants'
import { RecordCore, WriteAckCallback } from './record-core'
import { MergeStrategy } from './merge-strategy'
import * as Emitter from 'component-emitter2'

export class Record extends Emitter  {
    private record: RecordCore
    private subscriptions: Array<{ callback: Function, path: string, data: any }>

    constructor (record: RecordCore) {
        super()
        this.record = record
    }

    get name (): string {
        return this.record.name
    }

    get isReady (): boolean {
        return this.record.isReady
    }

    get version (): number {
        return this.record.version
    }

    public whenReady (callback?: ((record: Record) => void)): void | Promise<Record> {
        return this.record.whenReady(this, callback)
    }

    public get (path?: string): any {
        return this.record.get(path)
    }

    public set (data: any, callback?: WriteAckCallback): void
    public set (path: string, data: any, callback?: WriteAckCallback): void {
        return this.record.set(path, data, callback)
    }

    public setWithAck (data: any, callback?: ((error: string) => void)): Promise<void> | undefined
    public setWithAck (path: string, data: any, callback?: ((error: string) => void)): Promise<void> | undefined {
        return this.record.setWithAck(path, data, callback)
    }

    public subscribe (path: string, callback: (data: any) => void, triggerNow?: boolean)
    public subscribe (...rest) {
        const parameters = utils.normalizeArguments(rest)
        this.subscriptions.push(parameters)
        this.record.subscribe(parameters)
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

        this.record.unsubscribe(parameters)
    }

    public discard (): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.record.unsubscribe(this.subscriptions[i])
        }
        return this.record.discard()
    }

    public delete (callback?: (error: string | null) => void): void | Promise<void> {
        return this.record.delete(callback)
    }

    public setMergeStrategy (mergeStrategy: MergeStrategy): void {
        this.record.setMergeStrategy(mergeStrategy)
    }
}
