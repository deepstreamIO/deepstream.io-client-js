export class Emitter {
  private callbacks: null | Map<string, Array<{ fn: Function, scope: any }>> = null

  /**
   * Listen on the given `event` with `fn`.
   */
  public on (event: string, fn: Function, scope: any = this) {
    this.callbacks = this.callbacks || new Map()
    let callbacks = this.callbacks.get(event)
    if (!callbacks) {
        callbacks = [{ fn, scope }]
        this.callbacks.set(event, callbacks)
    } else {
        callbacks.push({ fn, scope })
    }
    return this
  }

  public once (event: string, fn: Function, scope: any = this) {
    const on = (...args: any[]) => {
      this.off(event, on, this)
      fn.apply(this, args)
    }

    on.fn = fn
    this.on(event, on, scope)
    return this
  }

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   */
  public off (event?: string, fn?: Function, scope?: any) {
    // all
    if (event === undefined && fn === undefined && scope === undefined) {
      this.callbacks = null
    }

    if (this.callbacks === null) {
        return this
    }

    // specific event
    let callbacks = this.callbacks.get(event!)
    if (!callbacks) {
        return this
    }

    // remove all handlers
    if (fn === undefined && scope === undefined) {
        this.callbacks.delete(event!)
        return this
    }

    // remove specific handler
    callbacks = callbacks.filter((item: any) => {
      const { fn: cb, scope: context } = item

      // handle unsubscribing from all callbacks for a given record path
      if (event !== '' && fn === undefined && scope === context) {
        return false
      }

      if (cb === fn || (cb as any).fn === fn) {
        if (scope === undefined || scope === context) {
          return false
        }
      }
      return true
    })

    if (callbacks.length === 0) {
        this.callbacks.delete(event!)
    } else {
        this.callbacks.set(event!, callbacks)
    }

    return this
  }

  public removeContext (context: any) {
    if (this.callbacks === null) {
      return
    }
    for (const [eventName, callbacks] of this.callbacks) {
      this.callbacks.set(eventName, callbacks.filter(({ scope }) => scope === context))
    }
  }

  public emit (event: string, ...args: any[]) {
    if (this.callbacks === null) {
        return this
    }

    let callbacks = this.callbacks.get(event)

    if (!callbacks || callbacks.length === 0) {
        return this
    }

    // We slice them here incase they are 'once' which would shift the array
    callbacks = callbacks.slice(0)
    callbacks.forEach(({ fn, scope }) => fn.apply(scope, args))

    return this
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
