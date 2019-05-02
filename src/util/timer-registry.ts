export interface Timeout {
    callback: Function,
    duration: number,
    context: any,
    data?: any
}

interface InternalTimeout extends Timeout {
    created: number,
}

export type TimerRef = number

export class TimerRegistry {
    private registry = new Map<number, InternalTimeout>()
    private timerIdCounter = 0;

    constructor () {
        setInterval(this.triggerTimeouts.bind(this), 50)
    }

    private triggerTimeouts () {
        const now = Date.now()
        for (const [timerId, timeout] of this.registry) {
            if (now - timeout.created! > timeout.duration) {
                timeout.callback.call(timeout.context, timeout.data)
                this.registry.delete(timerId)
            }
        }
    }

    public has (timerId: TimerRef): boolean {
        return this.registry.has(timerId)
    }

    public add (timeout: Timeout): TimerRef {
        (timeout as InternalTimeout).created = Date.now()
        this.registry.set(this.timerIdCounter++, timeout as InternalTimeout);
        return this.timerIdCounter;
    }

    public remove (timerId: TimerRef): boolean {
        return this.registry.delete(timerId)
    }

    public requestIdleCallback (callback: Function): void {
        setTimeout(callback, 0)
    }
}
