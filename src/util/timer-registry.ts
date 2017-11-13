export interface Timeout {
    callback: Function,
    duration: number,
    context: any,
    data?: any
}

export class TimerRegistry {

    public add (timeout: Timeout): number {
        return setTimeout(
            timeout.callback.bind(timeout.context, timeout.data),
            timeout.duration
        )
    }

    public remove (timerId: number): boolean {
        clearTimeout(timerId)
        return true
    }

    public requestIdleCallback (callback: Function): void {
        process.nextTick(callback)
    }

}
