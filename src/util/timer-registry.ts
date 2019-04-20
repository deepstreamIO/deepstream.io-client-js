export interface Timeout {
    callback: Function,
    duration: number,
    context: any,
    data?: any
}

export type TimeoutRef = number

export class TimerRegistry {

    public add (timeout: Timeout): TimeoutRef {
        return setTimeout(timeout.callback.bind(timeout.context, timeout.data), timeout.duration) as unknown as TimeoutRef
    }

    public remove (timerId: TimeoutRef): boolean {
        clearTimeout(timerId)
        return true
    }

    public requestIdleCallback (callback: Function): void {
        process.nextTick(callback)
    }

}
