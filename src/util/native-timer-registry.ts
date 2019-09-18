import { TimerRegistry, TimerRef, Timeout } from '../deepstream-client'

export class NativeTimerRegistry implements TimerRegistry {
    private registry = new Set<number>()

    public close () {
        this.registry.forEach(clearTimeout)
        this.registry.clear()
    }

    public has (timerId: TimerRef): boolean {
        return this.registry.has(timerId)
    }

    public add (timeout: Timeout): TimerRef {
        const id = setTimeout(() => {
            this.remove(id)
            timeout.callback.call(timeout.context, timeout.data)
        }, timeout.duration) as never as number
        this.registry.add(id)
        return id
    }

    public remove (timerId: TimerRef): boolean {
        clearTimeout(timerId)
        return this.registry.delete(timerId)
    }

    public requestIdleCallback (callback: Function): void {
        setTimeout(callback, 0)
    }
}
