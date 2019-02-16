export interface Timeout {
    callback: Function,
    duration: number,
    context: any,
    data?: any
}

export class TimerRegistry {

    public add (timeout: Timeout): number {
        return setTimeout(timeout.callback.bind(timeout.context, timeout.data), timeout.duration) as unknown as number
    }

    public remove (timerId: number): boolean {
        // @ts-ignore
        clearTimeout(timerId)
        return true
    }

    public requestIdleCallback (callback: Function): void {
        process.nextTick(callback)
    }

}
