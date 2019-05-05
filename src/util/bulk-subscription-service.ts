import {TOPIC, ALL_ACTIONS} from '../../binary-protocol/dist/src/message-constants'
import {Services} from "../client"

export class BulkSubscriptionService<ACTION> {
    private subscribeNames = new Set<string>()
    private timerRef: number = -1

    constructor (public services: Services, private subscriptionInterval: number, private topic: TOPIC, private action: ACTION, private originalAction: ACTION) {
    }

    public subscribe (name: string) {
        if (this.subscriptionInterval === 0) {
            this.services.connection.sendMessage({
                topic: this.topic,
                action: this.originalAction as unknown as ALL_ACTIONS,
                name
            })
            return
        }

        if (!this.services.timerRegistry.has(this.timerRef)) {
            this.subscribeNames.add(name)
            this.timerRef = this.services.timerRegistry.add({
                callback: this.sendMessages,
                context: this,
                duration: this.subscriptionInterval
            })
        }
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
