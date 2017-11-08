import { CONNECTION_STATE } from '../constants'
import { Services, Client, EVENT } from '../client'
import { Options } from '../client-options'

/**
 * Makes sure that all functionality is resubscribed on reconnect. Subscription is called
 * when the connection drops - which seems counterintuitive, but in fact just means
 * that the re-subscription message will be added to the queue of messages that
 * need re-sending as soon as the connection is re-established.
 *
 * Resubscribe logic should only occur once per connection loss
 *
 * @param {Client} client          The deepstream client
 * @param {Function} reconnect     Function to call to allow resubscribing
 *
 * @constructor
 */
export default class ResubscribeNotifier {

    private services: Services
    private options: Options
    private resubscribe: Function
    private emitter: Emitter
    private isReconnecting: boolean

    constructor (emitter: Emitter, services: Services, options: Options, resubscribeFn: Function) {
        this.services = services
        this.options = options
        this.resubscribe = resubscribeFn
        this.onConnectionStateChanged = this.onConnectionStateChanged.bind(this)
        this.isReconnecting = false
        this.emitter = emitter
        this.emitter.on(EVENT.CONNECTION_STATE_CHANGED, this.onConnectionStateChanged)
    }

    private onConnectionStateChanged (state: CONNECTION_STATE) {
        if (state === CONNECTION_STATE.RECONNECTING) {
            this.isReconnecting = true
        } else if (state === CONNECTION_STATE.OPEN && this.isReconnecting) {
            this.isReconnecting = false
            this.resubscribe()
        }
    }
}
