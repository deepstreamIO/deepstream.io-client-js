import {TOPIC, ALL_ACTIONS} from '../../binary-protocol/dist/src/message-constants'
import {Services} from "../client"
import {Options} from "../client-options"

export class BulkSubscriptionService<ACTION> {
    private subscribeNames = new Set<string>()
    private timerRef: number = -1

    constructor (public services: Services, public options: Options, private topic: TOPIC, private action: ACTION) {
    }

    subscribe (name: string) {
        if (!this.services.timerRegistry.has(this.timerRef)) {
            this.timerRef = this.services.timerRegistry.add({
                callback: this.sendMessages,
                context: this,
                duration: this.options.subscriptionInterval
            })
        }
        this.subscribeNames.add(name)
    }

    private sendMessages () {
        if (this.subscribeNames.size !== 0) {
            this.services.connection.sendMessage({
                topic: this.topic,
                action: this.action as unknown as ALL_ACTIONS,
                names: [...this.subscribeNames]
            })
            this.subscribeNames.clear()
        }
    }
}
