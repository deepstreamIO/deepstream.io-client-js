export declare class StateMachine {
    private transitions;
    private logger;
    state: any;
    inEndState: boolean;
    constructor(logger: any, stateMachine: any);
    /**
     * Try to perform a state change
     */
    transition(transitionName: string): void;
    /**
     * Log state transitions for debugging.
     */
    private onTransition(transition);
}
