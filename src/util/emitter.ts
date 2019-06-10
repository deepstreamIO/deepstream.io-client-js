export class Emitter {
  private callbacks: null | Map<string, Array<Function>> = null

  /**
   * Listen on the given `event` with `fn`.
   */
  public on (event: string, fn: Function) {
    this.callbacks = this.callbacks || new Map()
    let callbacks = this.callbacks.get(event)
    if (!callbacks) {
        callbacks = [fn]
        this.callbacks.set(event, callbacks)
    } else {
        callbacks.push(fn)
    }
    return this
  }

  public once (event: string, fn: Function) {
    const on = (...args: Array<any>) => {
      this.off(event, on)
      fn.apply(this, args)
    }

    on.fn = fn
    this.on(event, on)
    return this
  }

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   */
  public off (event?: string, fn?: Function) {
    // all
    if (event === undefined && fn === undefined) {
      this.callbacks = null
    }

    if (this.callbacks === null) {
        return this
    }

    // specific event
    const callbacks = this.callbacks.get(event!)
    if (!callbacks) {
        return this
    }

    // remove all handlers
    if (fn === undefined) {
        this.callbacks.delete(event!)
        return this
    }

    // remove specific handler
    let cb
    for (let i = 0; i < callbacks.length; i++) {
      cb = callbacks[i]
      if (cb === fn || (cb as any).fn === fn) {
        callbacks.splice(i, 1)
        break
      }
    }

    // Remove event specific arrays for event types that no
    // one is subscribed for to avoid memory leak.
    if (callbacks.length === 0) {
        this.callbacks.delete(event!)
    }

    return this
  }

  public emit (event: string, ...args: Array<any>) {
    if (this.callbacks === null) {
        return this
    }

    let callbacks = this.callbacks.get(event)

    if (!callbacks || callbacks.length === 0) {
        return this
    }

    // We slice them here incase they are 'once' which would shift the array
    callbacks = callbacks.slice(0)
    callbacks.forEach(callback => callback.apply(this, args))

    return this
  }

  /**
   * Return array of callbacks for `event`.
   */
  public listeners (event: string){
    if (this.callbacks === null) {
        return []
    }
    return this.callbacks.get(event) || []
  }
  
  /**
   * Check if this emitter has `event` handlers.
   */
  public hasListeners (event: string) {
    if (this.callbacks === null) {
        return false
    }
    return this.callbacks.has(event)
  }
  
  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   */
  public eventNames () {
    if (this.callbacks === null) {
        return []
    }
    return [...this.callbacks.keys()]
  }
}
