export declare class StateMachine {
    state: any;
    inEndState: boolean;
    private transitions;
    private stateMachine;
    private logger;
    constructor(logger: any, stateMachine: any);
    /**
     * Try to perform a state change
     */
    transition(transitionName: any): void;
}
