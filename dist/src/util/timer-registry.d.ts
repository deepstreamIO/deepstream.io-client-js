export interface Timeout {
    callback: Function;
    duration: number;
    context: any;
    data?: any;
}
export declare class TimerRegistry {
    add(timeout: Timeout): number;
    remove(timerId: number): boolean;
    requestIdleCallback(callback: Function): void;
}
