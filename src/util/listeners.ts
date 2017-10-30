import { TOPIC, EVENT_ACTION, RECORD_ACTION, EVENT } from '../constants'
import { Services } from '../client'

export interface ListenResponse {
    accept: () => void
    reject: (reason?: string) => void
    onStop: (subscriptionName: string) => void
}

export type ListenCallback = (subscriptionName: string, listenResponse: ListenResponse) => void

export class Listener {
    private topic: TOPIC
    // private actions: EVENT_ACTION | RECORD_ACTION
    private services: Services
    private listeners: Map<string, ListenCallback>

    constructor (topic: TOPIC, services: Services) {
        this.topic = topic
        this.services = services
        this.listeners = new Map<string, ListenCallback>()

        // if (topic === TOPIC.RECORD) {
        //     this.actions = RECORD_ACTION
        // } else if (topic === TOPIC.EVENT) {
        //     this.actions = EVENT_ACTION
        // }
    }

    public listen (pattern: string, callback: ListenCallback): void {
        this.listeners.set(pattern, callback)
    }

    public unlisten (pattern: string): void {
        this.listeners.delete(pattern)
    }
}
