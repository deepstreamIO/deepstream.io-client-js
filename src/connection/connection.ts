import { CONNECTION_STATE, EVENT, JSONObject, TOPIC, Message, CONNECTION_ACTION, ParseResult, PARSER_ACTION, AUTH_ACTION } from '../constants'
import {
  parseData
} from '@deepstream/protobuf/dist/src/message-parser'

import { StateMachine } from '../util/state-machine'
import {Services, Socket} from '../deepstream-client'
import { Options } from '../client-options'
import * as utils from '../util/utils'
import { Emitter } from '../util/emitter'
import * as pkg from '../../package.json'

export type AuthenticationCallback = (success: boolean, clientData: JSONObject | null) => void
export type ResumeCallback = (error?: JSONObject) => void

const enum TRANSITIONS {
  INITIALISED = 'initialised',
  CONNECTED = 'connected',
  CHALLENGE = 'challenge',
  AUTHENTICATE = 'authenticate',
  RECONNECT = 'reconnect',
  CHALLENGE_ACCEPTED = 'accepted',
  CHALLENGE_DENIED = 'challenge-denied',
  CONNECTION_REDIRECTED = 'redirected',
  TOO_MANY_AUTH_ATTEMPTS = 'too-many-auth-attempts',
  CLOSE = 'close',
  CLOSED = 'closed',
  UNSUCCESFUL_LOGIN = 'unsuccesful-login',
  SUCCESFUL_LOGIN = 'succesful-login',
  ERROR = 'error',
  LOST = 'connection-lost',
  PAUSE = 'pause',
  OFFLINE = 'offline',
  RESUME = 'resume',
  EXIT_LIMBO = 'exit-limbo',
  AUTHENTICATION_TIMEOUT = 'authentication-timeout'
}

export class Connection {
  public emitter: Emitter
  public isInLimbo: boolean

  private internalEmitter: Emitter
  private stateMachine: StateMachine
  private authParams: JSONObject | null
  private clientData: JSONObject | null
  private authCallback: AuthenticationCallback | null
  private resumeCallback: ResumeCallback | null
  private readonly originalUrl: string
  private url: string
  private heartbeatIntervalTimeout: number | null
  private endpoint: Socket | null
  private handlers: Map<TOPIC, Function>

  private reconnectTimeout: number | null = null
  private reconnectionAttempt: number
  private limboTimeout: number | null

  constructor (private services: Services, private options: Options, url: string, emitter: Emitter) {
    this.authParams = null
    this.handlers = new Map()
    this.authCallback = null
    this.resumeCallback = null
    this.emitter = emitter
    this.internalEmitter = new Emitter()
    this.isInLimbo = true
    this.clientData = null
    this.heartbeatIntervalTimeout = null
    this.endpoint = null
    this.reconnectionAttempt = 0
    this.limboTimeout = null

    let isReconnecting = false
    let firstOpen = true
    this.stateMachine = new StateMachine(
      this.services.logger,
      {
        init: CONNECTION_STATE.CLOSED,
        onStateChanged: (newState: string, oldState: string) => {
          if (newState === oldState) {
            return
          }
          emitter.emit(EVENT.CONNECTION_STATE_CHANGED, newState)

          if (newState === CONNECTION_STATE.RECONNECTING) {
            this.isInLimbo = true
            isReconnecting = true

            if (oldState !== CONNECTION_STATE.CLOSED) {
              this.internalEmitter.emit(EVENT.CONNECTION_LOST)
              this.limboTimeout = this.services.timerRegistry.add({
                duration: this.options.offlineBufferTimeout,
                context: this,
                callback: () => {
                  this.isInLimbo = false
                  this.internalEmitter.emit(EVENT.EXIT_LIMBO)
                }
              })
            }
          } else if (newState === CONNECTION_STATE.OPEN && (isReconnecting || firstOpen)) {
            firstOpen = false
            this.isInLimbo = false
            this.internalEmitter.emit(EVENT.CONNECTION_REESTABLISHED)
            this.services.timerRegistry.remove(this.limboTimeout as number)
          }
        },
        transitions: [
          { name: TRANSITIONS.INITIALISED, from: CONNECTION_STATE.CLOSED, to: CONNECTION_STATE.INITIALISING },
          { name: TRANSITIONS.CONNECTED, from: CONNECTION_STATE.INITIALISING, to: CONNECTION_STATE.AWAITING_CONNECTION },
          { name: TRANSITIONS.CONNECTED, from: CONNECTION_STATE.REDIRECTING, to: CONNECTION_STATE.AWAITING_CONNECTION },
          { name: TRANSITIONS.CONNECTED, from: CONNECTION_STATE.RECONNECTING, to: CONNECTION_STATE.AWAITING_CONNECTION },
          { name: TRANSITIONS.CHALLENGE, from: CONNECTION_STATE.AWAITING_CONNECTION, to: CONNECTION_STATE.CHALLENGING },
          { name: TRANSITIONS.CONNECTION_REDIRECTED, from: CONNECTION_STATE.CHALLENGING, to: CONNECTION_STATE.REDIRECTING },
          { name: TRANSITIONS.CHALLENGE_DENIED, from: CONNECTION_STATE.CHALLENGING, to: CONNECTION_STATE.CHALLENGE_DENIED },
          { name: TRANSITIONS.CHALLENGE_ACCEPTED, from: CONNECTION_STATE.CHALLENGING, to: CONNECTION_STATE.AWAITING_AUTHENTICATION, handler: this.onAwaitingAuthentication.bind(this) },
          { name: TRANSITIONS.AUTHENTICATION_TIMEOUT, from: CONNECTION_STATE.AWAITING_CONNECTION, to: CONNECTION_STATE.AUTHENTICATION_TIMEOUT },
          { name: TRANSITIONS.AUTHENTICATION_TIMEOUT, from: CONNECTION_STATE.AWAITING_AUTHENTICATION, to: CONNECTION_STATE.AUTHENTICATION_TIMEOUT  },
          { name: TRANSITIONS.AUTHENTICATE, from: CONNECTION_STATE.AWAITING_AUTHENTICATION, to: CONNECTION_STATE.AUTHENTICATING },
          { name: TRANSITIONS.UNSUCCESFUL_LOGIN, from: CONNECTION_STATE.AUTHENTICATING, to: CONNECTION_STATE.AWAITING_AUTHENTICATION },
          { name: TRANSITIONS.SUCCESFUL_LOGIN, from: CONNECTION_STATE.AUTHENTICATING, to: CONNECTION_STATE.OPEN },
          { name: TRANSITIONS.TOO_MANY_AUTH_ATTEMPTS, from: CONNECTION_STATE.AUTHENTICATING, to: CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS },
          { name: TRANSITIONS.TOO_MANY_AUTH_ATTEMPTS, from: CONNECTION_STATE.AWAITING_AUTHENTICATION, to: CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS },
          { name: TRANSITIONS.AUTHENTICATION_TIMEOUT, from: CONNECTION_STATE.AWAITING_AUTHENTICATION, to: CONNECTION_STATE.AUTHENTICATION_TIMEOUT },
          { name: TRANSITIONS.RECONNECT, from: CONNECTION_STATE.RECONNECTING, to: CONNECTION_STATE.RECONNECTING },
          { name: TRANSITIONS.CLOSED, from: CONNECTION_STATE.CLOSING, to: CONNECTION_STATE.CLOSED },
          { name: TRANSITIONS.OFFLINE, from: CONNECTION_STATE.PAUSING, to: CONNECTION_STATE.OFFLINE },
          { name: TRANSITIONS.ERROR, to: CONNECTION_STATE.RECONNECTING },
          { name: TRANSITIONS.LOST, to: CONNECTION_STATE.RECONNECTING },
          { name: TRANSITIONS.RESUME, to: CONNECTION_STATE.RECONNECTING },
          { name: TRANSITIONS.PAUSE, to: CONNECTION_STATE.PAUSING },
          { name: TRANSITIONS.CLOSE, to: CONNECTION_STATE.CLOSING },
        ]
      }
    )
    this.stateMachine.transition(TRANSITIONS.INITIALISED)
    this.originalUrl = utils.parseUrl(url, this.options.path)
    this.url = this.originalUrl

    if (!options.lazyConnect) {
      this.createEndpoint()
    }
  }

  public get isConnected (): boolean {
    return this.stateMachine.state === CONNECTION_STATE.OPEN
  }

  public onLost (callback: Function): void {
    this.internalEmitter.on(EVENT.CONNECTION_LOST, callback)
  }

  public removeOnLost (callback: Function): void {
    this.internalEmitter.off(EVENT.CONNECTION_LOST, callback)
  }

  public onReestablished (callback: Function): void {
    this.internalEmitter.on(EVENT.CONNECTION_REESTABLISHED, callback)
  }

  public removeOnReestablished (callback: Function): void {
    this.internalEmitter.off(EVENT.CONNECTION_REESTABLISHED, callback)
  }

  public onExitLimbo (callback: Function): void {
    this.internalEmitter.on(EVENT.EXIT_LIMBO, callback)
  }

  public registerHandler (topic: TOPIC, callback: Function): void {
    this.handlers.set(topic, callback)
  }

  public sendMessage (message: Message): void {
    if (!this.isOpen()) {
      this.services.logger.error(message, EVENT.IS_CLOSED)
      return
    }
    if (this.endpoint) {
      this.endpoint.sendParsedMessage(message)
    }
  }

  /**
   * Sends the specified authentication parameters
   * to the server. Can be called up to <maxAuthAttempts>
   * times for the same connection.
   *
   * @param   {Object}   authParams A map of user defined auth parameters.
   *                E.g. { username:<String>, password:<String> }
   * @param   {Function} callback   A callback that will be invoked with the authenticationr result
   */
  public authenticate (authCallback: AuthenticationCallback): void
  public authenticate (authParms: JSONObject | null, callback: AuthenticationCallback): void
  public authenticate (authParamsOrCallback?: JSONObject | AuthenticationCallback | null, callback?: AuthenticationCallback | null): void {
    if (
      authParamsOrCallback &&
      typeof authParamsOrCallback !== 'object' &&
      typeof authParamsOrCallback !== 'function'
    ) {
      throw new Error('invalid argument authParamsOrCallback')
    }
    if (callback && typeof callback !== 'function') {
      throw new Error('invalid argument callback')
    }

    if (
      this.stateMachine.state === CONNECTION_STATE.CHALLENGE_DENIED ||
      this.stateMachine.state === CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS ||
      this.stateMachine.state === CONNECTION_STATE.AUTHENTICATION_TIMEOUT
    ) {
      this.services.logger.error({ topic: TOPIC.CONNECTION }, EVENT.IS_CLOSED)
      return
    }

    if (authParamsOrCallback) {
      // @ts-ignore
      this.authParams = typeof authParamsOrCallback === 'object' ? authParamsOrCallback : {}
    }

    if (authParamsOrCallback && typeof authParamsOrCallback === 'function') {
      this.authCallback = authParamsOrCallback as AuthenticationCallback
    } else if (callback) {
      this.authCallback = callback
    } else {
      this.authCallback = () => {}
    }

    // if (this.stateMachine.state === CONNECTION_STATE.CLOSED && !this.endpoint) {
    //   this.createEndpoint()
    //   return
    // }

    if (this.stateMachine.state === CONNECTION_STATE.AWAITING_AUTHENTICATION && this.authParams) {
      this.sendAuthParams()
    }

    if (!this.endpoint) {
      this.createEndpoint()
    }
  }

  /*
  * Returns the current connection state.
  */
  public getConnectionState (): CONNECTION_STATE {
    return this.stateMachine.state
  }

  private isOpen (): boolean {
    const connState = this.getConnectionState()
    return connState !== CONNECTION_STATE.CLOSED
      && connState !== CONNECTION_STATE.ERROR
      && connState !== CONNECTION_STATE.CLOSING
  }

  /**
   * Closes the connection. Using this method
   * will prevent the client from reconnecting.
   */
  public close (): void {
    this.services.timerRegistry.remove(this.heartbeatIntervalTimeout!)
    this.sendMessage({
      topic: TOPIC.CONNECTION,
      action: CONNECTION_ACTION.CLOSING
    })
    this.stateMachine.transition(TRANSITIONS.CLOSE)
  }

  public pause (): void {
    this.stateMachine.transition(TRANSITIONS.PAUSE)
    this.services.timerRegistry.remove(this.heartbeatIntervalTimeout!)
    if (this.endpoint) {
      this.endpoint.close()
    }
  }

  public resume (callback: ResumeCallback): void {
    this.stateMachine.transition(TRANSITIONS.RESUME)
    this.resumeCallback = callback
    this.tryReconnect()
  }

  /**
   * Creates the endpoint to connect to using the url deepstream
   * was initialised with.
   */
  private createEndpoint (): void {
    this.endpoint = this.services.socketFactory(this.url, this.options.socketOptions, this.options.heartbeatInterval)

    this.endpoint.onopened = this.onOpen.bind(this)
    this.endpoint.onerror = this.onError.bind(this)
    this.endpoint.onclosed = this.onClose.bind(this)
    this.endpoint.onparsedmessages = this.onMessages.bind(this)
  }

  /********************************
  ****** Endpoint Callbacks ******
  /********************************/

  /**
  * Will be invoked once the connection is established. The client
  * can't send messages yet, and needs to get a connection ACK or REDIRECT
  * from the server before authenticating
  */
  private onOpen (): void {
    this.clearReconnect()
    this.checkHeartBeat()
    this.stateMachine.transition(TRANSITIONS.CONNECTED)
    this.sendMessage({
      topic: TOPIC.CONNECTION,
      action: CONNECTION_ACTION.CHALLENGE,
      url: this.originalUrl,
      protocolVersion: '0.1a',
      sdkVersion: pkg.version,
      sdkType: 'javascript'
    })
    this.stateMachine.transition(TRANSITIONS.CHALLENGE)
  }

  /**
   * Callback for generic connection errors. Forwards
   * the error to the client.
   *
   * The connection is considered broken once this method has been
   * invoked.
   */
  private onError (error: any) {
    /*
     * If the implementation isn't listening on the error event this will throw
     * an error. So let's defer it to allow the reconnection to kick in.
     */
    setTimeout(() => {
      let msg
      if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
        msg = `Can't connect! Deepstream server unreachable on ${this.originalUrl}`
      } else {
        msg = error
      }
      this.services.logger.error({ topic: TOPIC.CONNECTION }, EVENT.CONNECTION_ERROR, msg)
    }, 1)

    this.services.timerRegistry.remove(this.heartbeatIntervalTimeout!)
    this.stateMachine.transition(TRANSITIONS.ERROR)
    this.tryReconnect()
  }

  /**
   * Callback when the connection closes. This might have been a deliberate
   * close triggered by the client or the result of the connection getting
   * lost.
   *
   * In the latter case the client will try to reconnect using the configured
   * strategy.
   */
  private onClose (): void {
    this.services.timerRegistry.remove(this.heartbeatIntervalTimeout!)

    if (this.stateMachine.state === CONNECTION_STATE.REDIRECTING) {
      this.createEndpoint()
      return
    }

    if (
      this.stateMachine.state === CONNECTION_STATE.CHALLENGE_DENIED ||
      this.stateMachine.state === CONNECTION_STATE.TOO_MANY_AUTH_ATTEMPTS ||
      this.stateMachine.state === CONNECTION_STATE.AUTHENTICATION_TIMEOUT
    ) {
      return
    }

    if (this.stateMachine.state === CONNECTION_STATE.CLOSING) {
      this.stateMachine.transition(TRANSITIONS.CLOSED)
      return
    }

    if (this.stateMachine.state === CONNECTION_STATE.PAUSING) {
      this.stateMachine.transition(TRANSITIONS.OFFLINE)
      return
    }

    this.stateMachine.transition(TRANSITIONS.LOST)
    this.tryReconnect()
  }

  /**
   * Callback for messages received on the connection.
   */
  private onMessages (parseResults: ParseResult[]): void {
    parseResults.forEach(parseResult => {
      if (parseResult.parseError) {
        this.services.logger.error(
          { topic: TOPIC.PARSER },
          parseResult.action,
          parseResult.raw && parseResult.raw.toString()
        )
        return
      }
      const message: any = parseResult
      const res = parseData(message)
      if (res !== true) {
        this.services.logger.error({ topic: TOPIC.PARSER }, PARSER_ACTION.INVALID_MESSAGE, res)
      }
      if (message === null) {
        return
      }
      if (message.topic === TOPIC.CONNECTION) {
        this.handleConnectionResponse(message)
        return
      }
      if (message.topic === TOPIC.AUTH) {
        this.handleAuthResponse(message)
        return
      }
      const handler = this.handlers.get(message.topic)
      if (!handler) {
        // this should never happen
        return
      }
      handler(message)
    })
  }

  /**
  * Sends authentication params to the server. Please note, this
  * doesn't use the queued message mechanism, but rather sends the message directly
  */
  private sendAuthParams (): void {
    this.stateMachine.transition(TRANSITIONS.AUTHENTICATE)
    this.sendMessage({
      topic: TOPIC.AUTH,
      action: AUTH_ACTION.REQUEST,
      parsedData: this.authParams
    })
  }

  /**
  * Ensures that a heartbeat was not missed more than once, otherwise it considers the connection
  * to have been lost and closes it for reconnection.
  */
  private checkHeartBeat (): void {
    const heartBeatTolerance = this.options.heartbeatInterval * 2

    if (!this.endpoint) {
      return
    }

    if (this.endpoint.getTimeSinceLastMessage() > heartBeatTolerance) {
      this.services.timerRegistry.remove(this.heartbeatIntervalTimeout!)
      this.services.logger.error({ topic: TOPIC.CONNECTION }, EVENT.HEARTBEAT_TIMEOUT)
      this.endpoint.close()
      return
    }

    this.heartbeatIntervalTimeout = this.services.timerRegistry.add({
      duration: this.options.heartbeatInterval,
      callback: this.checkHeartBeat,
      context: this
    })
  }

 /**
 * If the connection drops or is closed in error this
 * method schedules increasing reconnection intervals
 *
 * If the number of failed reconnection attempts exceeds
 * options.maxReconnectAttempts the connection is closed
 */
  private tryReconnect (): void {
   if (this.reconnectTimeout !== null) {
      return
    }
   if (this.reconnectionAttempt < this.options.maxReconnectAttempts) {
      this.stateMachine.transition(TRANSITIONS.RECONNECT)
      this.reconnectTimeout = this.services.timerRegistry.add({
        callback: this.tryOpen,
        context: this,
        duration: Math.min(
            this.options.maxReconnectInterval,
            this.options.reconnectIntervalIncrement * this.reconnectionAttempt
        )
      })
      this.reconnectionAttempt++
      return
    }

   this.emitter.emit(EVENT[EVENT.MAX_RECONNECTION_ATTEMPTS_REACHED], this.reconnectionAttempt)
   this.clearReconnect()
   this.close()
  }

  /**
   * Attempts to open a errourosly closed connection
   */
  private tryOpen (): void {
    if (this.stateMachine.state !== CONNECTION_STATE.REDIRECTING) {
      this.url = this.originalUrl
    }
    this.createEndpoint()
    this.reconnectTimeout = null
  }

  /**
   * Stops all further reconnection attempts,
   * either because the connection is open again
   * or because the maximal number of reconnection
   * attempts has been exceeded
   */
  private clearReconnect (): void {
    this.services.timerRegistry.remove(this.reconnectTimeout!)
    this.reconnectTimeout = null
    this.reconnectionAttempt = 0
  }

  /**
   * The connection response will indicate whether the deepstream connection
   * can be used or if it should be forwarded to another instance. This
   * allows us to introduce load-balancing if needed.
   *
   * If authentication parameters are already provided this will kick of
   * authentication immediately. The actual 'open' event won't be emitted
   * by the client until the authentication is successful.
   *
   * If a challenge is recieved, the user will send the url to the server
   * in response to get the appropriate redirect. If the URL is invalid the
   * server will respond with a REJECTION resulting in the client connection
   * being permanently closed.
   *
   * If a redirect is recieved, this connection is closed and updated with
   * a connection to the url supplied in the message.
   */
  private handleConnectionResponse (message: Message): void {
    if (message.action === CONNECTION_ACTION.ACCEPT) {
      this.stateMachine.transition(TRANSITIONS.CHALLENGE_ACCEPTED)
      return
    }

    if (message.action === CONNECTION_ACTION.REJECT) {
      this.stateMachine.transition(TRANSITIONS.CHALLENGE_DENIED)
      if (this.endpoint) {
        this.endpoint.close()
      }
      return
    }

    if (message.action === CONNECTION_ACTION.REDIRECT) {
      this.url = message.url as string
      this.stateMachine.transition(TRANSITIONS.CONNECTION_REDIRECTED)
      if (this.endpoint) {
        this.endpoint.close()
      }
      return
    }

    if (message.action === CONNECTION_ACTION.AUTHENTICATION_TIMEOUT) {
      this.stateMachine.transition(TRANSITIONS.AUTHENTICATION_TIMEOUT)
      this.services.logger.error(message)
    }
  }

  /**
   * Callback for messages received for the AUTH topic. If
   * the authentication was successful this method will
   * open the connection and send all messages that the client
   * tried to send so far.
   */
  private handleAuthResponse (message: Message): void {
    if (message.action === AUTH_ACTION.TOO_MANY_AUTH_ATTEMPTS) {
      this.stateMachine.transition(TRANSITIONS.TOO_MANY_AUTH_ATTEMPTS)
      this.services.logger.error(message)
      return
    }

    if (message.action === AUTH_ACTION.AUTH_UNSUCCESSFUL) {
      this.stateMachine.transition(TRANSITIONS.UNSUCCESFUL_LOGIN)
      this.onAuthUnSuccessful()
      return
    }

    if (message.action === AUTH_ACTION.AUTH_SUCCESSFUL) {
      this.stateMachine.transition(TRANSITIONS.SUCCESFUL_LOGIN)
      this.onAuthSuccessful(message.parsedData)
      return
    }
  }

  private onAwaitingAuthentication (): void {
    if (this.authParams) {
      this.sendAuthParams()
    }
  }

  private onAuthSuccessful (clientData: any): void {
    this.updateClientData(clientData)
    if (this.resumeCallback) {
      this.resumeCallback()
      this.resumeCallback = null
    }
    if (this.authCallback === null) {
      return
    }

    this.authCallback(true, this.clientData)
    this.authCallback = null
  }

  private onAuthUnSuccessful (): void {
    const reason = { reason: EVENT[EVENT.INVALID_AUTHENTICATION_DETAILS] }
    if (this.resumeCallback) {
      this.resumeCallback(reason)
      this.resumeCallback = null
    }
    if (this.authCallback === null) {
      this.emitter.emit(EVENT.REAUTHENTICATION_FAILURE, reason)
      return
    }

    this.authCallback(false, reason)
    this.authCallback = null
  }

  private updateClientData (data: any) {
    const newClientData = data || null
    if (
      this.clientData === null &&
      (newClientData === null || Object.keys(newClientData).length === 0)
    ) {
      return
    }

    if (!utils.deepEquals(this.clientData, data)) {
      this.emitter.emit(EVENT.CLIENT_DATA_CHANGED, Object.assign({}, newClientData))
      this.clientData = newClientData
    }
  }
}
