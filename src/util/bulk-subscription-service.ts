import {Services} from '../deepstream-client'
import { TOPIC, Message } from '../constants'

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
        private unsubscribeBulkAction: ACTION,
        private onSubscriptionSent: (message: Message) => void = (() => {})
        ) {
        this.services.connection.onLost(this.onLost.bind(this))
    }

    public subscribe (name: string) {
        if (this.subscriptionInterval > 0) {
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
            action: this.subscribeBulkAction as any,
            names: [name],
            correlationId: (this.correlationId++).toString()
        }
        this.services.connection.sendMessage(message)
        this.onSubscriptionSent(message)
    }

    public subscribeList (users: string[]) {
        users.forEach(this.subscribe.bind(this))
    }

    public unsubscribe (name: string) {
        if (this.subscriptionInterval > 0) {
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
            action: this.unsubscribeBulkAction as any,
            names: [name],
            correlationId: (this.correlationId++).toString()
        }
        this.services.connection.sendMessage(message)
        this.onSubscriptionSent(message)
    }

    public unsubscribeList (users: string[]) {
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
        this.correlationId = 0
        this.services.timerRegistry.remove(this.timerRef)
        this.subscribeNames.clear()
        this.unsubscribeNames.clear()
    }
}
