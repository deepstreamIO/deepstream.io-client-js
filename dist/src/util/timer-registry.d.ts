export interface Timeout {
    callback: Function;
    duration: number;
    context: any;
    data: object;
}
export declare class TimerRegistry {
    add(timeout: Timeout): number;
    remove(timerId: number): boolean;
}
