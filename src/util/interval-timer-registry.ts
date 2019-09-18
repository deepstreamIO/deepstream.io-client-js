import { TimerRegistry, Timeout, TimerRef } from '../deepstream-client'

interface InternalTimeout extends Timeout {
    created: number,
}

export class IntervalTimerRegistry implements TimerRegistry  {
    private registry = new Map<number, InternalTimeout>()
    private timerIdCounter = 0
    private timerId: any

    constructor (private timerResolution: number) {
        this.timerId = setTimeout(this.triggerTimeouts.bind(this), this.timerResolution)
    }

    public close () {
        clearInterval(this.timerId)
    }

    private triggerTimeouts () {
        const now = Date.now()
        for (const [timerId, timeout] of this.registry) {
            if (now - timeout.created! > timeout.duration) {
                timeout.callback.call(timeout.context, timeout.data)
                this.registry.delete(timerId)
            }
        }
        this.timerId = setTimeout(this.triggerTimeouts.bind(this), this.timerResolution)
    }

    public has (timerId: TimerRef): boolean {
        return this.registry.has(timerId)
    }

    public add (timeout: Timeout): TimerRef {
        this.timerIdCounter++
        (timeout as InternalTimeout).created = Date.now()
        this.registry.set(this.timerIdCounter, timeout as InternalTimeout)
        return this.timerIdCounter
    }

    public remove (timerId: TimerRef): boolean {
        return this.registry.delete(timerId)
    }

    public requestIdleCallback (callback: Function): void {
        setTimeout(callback, 0)
    }
}
