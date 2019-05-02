
export class StateMachine {
  public state: any
  public inEndState: boolean

  private transitions: any
  private context: any

  constructor (logger: any, private stateMachine: any) {
    this.inEndState = false
    this.transitions = stateMachine.transitions
    this.state = stateMachine.init
    this.context = stateMachine.context;
  }

  /**
   * Try to perform a state change
   */
  public transition (transitionName: any): void {
    let transition
    for (let i = 0; i < this.transitions.length; i++) {
      transition = this.transitions[i]
      if (transitionName === transition.name && (this.state === transition.from || transition.from === undefined)) {
        const oldState = this.state
        this.state = transition.to
        if (this.stateMachine.onStateChanged) {
          this.stateMachine.onStateChanged.call(this.context, this.state, oldState)
        }
        if (transition.handler) {
          transition.handler.call(this.context)
        }
        return
      }
    }
    const details = JSON.stringify({ transition: transitionName, state: this.state })
    throw new Error(`Invalid state transition: ${details}`)
  }

}
