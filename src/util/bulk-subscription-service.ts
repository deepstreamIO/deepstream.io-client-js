import {TOPIC, Message} from '../../binary-protocol/src/message-constants'
import {Services} from '../client'

export class BulkSubscriptionService<ACTION> {
    private subscribeNames = new Set<string>()
    private unsubscribeNames = new Set<string>()
    private timerRef: number = -1
    private correlationId: number = 0

    constructor (
        public services: Services,
        private subscriptionInterval: number,
        private topic: TOPIC,
        private subscribeBulkAction: ACTION,
        private subscribeOriginalAction: ACTION | null,
        private unsubscribeBulkAction: ACTION,
        private unsubscribeOriginalAction: ACTION | null,
        private onSubscriptionSent: (message: Message) => void = (() => {})
        ) {
        this.services.connection.onLost(this.onLost.bind(this))
    }

    public subscribe (name: string) {
        if (this.subscriptionInterval > 0 || !this.subscribeOriginalAction) {
            if (this.unsubscribeNames.has(name)) {
                this.unsubscribeNames.delete(name)
            } else {
                this.subscribeNames.add(name)
                this.registerFlush()
            }
            return
        }

        const message = {
            topic: this.topic,
            action: this.subscribeOriginalAction as any,
            name
        }
        this.services.connection.sendMessage(message)
        this.onSubscriptionSent(message)
    }

    public subscribeList (users: Array<string>) {
        users.forEach(this.subscribe.bind(this))
    }

    public unsubscribe (name: string) {
        if (this.subscriptionInterval > 0 || !this.unsubscribeOriginalAction) {
            if (this.subscribeNames.has(name)) {
                this.subscribeNames.delete(name)
            } else {
                this.unsubscribeNames.add(name)
                this.registerFlush()
            }
            return
        }

        const message = {
            topic: this.topic,
            action: this.unsubscribeOriginalAction as any,
            name
        }
        this.services.connection.sendMessage(message)
        this.onSubscriptionSent(message)
    }

    public unsubscribeList (users: Array<string>) {
        users.forEach(this.unsubscribe.bind(this))
    }

    private registerFlush () {
        if (!this.services.timerRegistry.has(this.timerRef)) {
            this.timerRef = this.services.timerRegistry.add({
                callback: this.sendMessages,
                context: this,
                duration: this.subscriptionInterval
            })
        }
    }

    private sendMessages () {
        if (!this.services.connection.isConnected) {
            this.onLost()
            return
        }

        if (this.subscribeNames.size > 0) {
            const message = {
                topic: this.topic,
                action: this.subscribeBulkAction as any,
                names: [...this.subscribeNames],
                correlationId: (this.correlationId++).toString()
            }
            this.services.connection.sendMessage(message)
            this.onSubscriptionSent(message)
            this.subscribeNames.clear()
        }

        if (this.unsubscribeNames.size  > 0) {
            const message = {
                topic: this.topic,
                action: this.unsubscribeBulkAction as any,
                names: [...this.unsubscribeNames],
                correlationId: (this.correlationId++).toString()
            }
            this.services.connection.sendMessage(message)
            this.onSubscriptionSent(message)
            this.unsubscribeNames.clear()
        }
    }

    public onLost () {
        this.services.timerRegistry.remove(this.timerRef)
        this.subscribeNames.clear()
        this.unsubscribeNames.clear()
    }
}
