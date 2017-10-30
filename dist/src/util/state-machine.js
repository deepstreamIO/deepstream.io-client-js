"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StateMachine {
    constructor(logger, stateMachine) {
        this.inEndState = false;
        this.logger = logger;
        this.transitions = stateMachine.transitions;
        this.state = stateMachine.init;
    }
    /**
     * Try to perform a state change
     */
    transition(transitionName) {
        let transition;
        for (let i = 0; i < this.transitions.length; i++) {
            transition = this.transitions[i];
            if (transitionName === transition.name && this.state === transition.from) {
                // found transition
                this.onTransition(transition);
                this.state = transition.to;
                transition.handler.call(this);
                return;
            }
        }
        const details = JSON.stringify({ transition: transitionName, state: this.state });
        throw new Error(`Invalid state transition: ${details}`);
    }
    /**
     * Log state transitions for debugging.
     */
    // tslint:disable-next-line:no-empty
    onTransition(transition) {
    }
}
exports.StateMachine = StateMachine;
//# sourceMappingURL=state-machine.js.map