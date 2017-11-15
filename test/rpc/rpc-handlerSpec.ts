import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { getServicesMock, getLastMessageSent } from '../mocks'
import { EVENT } from '../../src/constants'
import { TOPIC, RPC_ACTIONS, RPCMessage, Message } from '../../binary-protocol/src/message-constants'
import * as Emitter from 'component-emitter2'

import { DefaultOptions, Options } from '../../src/client-options'
import { RPCHandler, RPCProvider } from '../../src/rpc/rpc-handler'
import { RPCResponse } from '../../src/rpc/rpc-response'
import { TimeoutRegistry } from '../../src/util/timeout-registry'

describe('RPC handler', () => {
  let services: any
  let rpcHandler: RPCHandler
  let handle: Function
  let rpcProviderSpy: sinon.SinonSpy
  let data: any
  const name = 'myRpc'
  const rpcAcceptTimeout = 3
  const rpcResponseTimeout = 10
  const options = Object.assign({}, DefaultOptions, { rpcAcceptTimeout, rpcResponseTimeout })

  beforeEach(() => {
    services = getServicesMock()
    rpcHandler = new RPCHandler(services, options)
    handle = services.getHandle()
    rpcProviderSpy = sinon.spy()
    data = { foo: 'bar' }
  })

  afterEach(() => {
    services.connectionMock.verify()
    services.timeoutRegistryMock.verify()
    services.loggerMock.verify()
  })

  it('validates parameters on provide, unprovide and make', () => {
    expect(rpcHandler.provide.bind(rpcHandler, '', () => {})).to.throw()
    expect(rpcHandler.provide.bind(rpcHandler, 123, () => {})).to.throw()
    expect(rpcHandler.provide.bind(rpcHandler, null, () => {})).to.throw()

    expect(rpcHandler.provide.bind(rpcHandler, name, null)).to.throw()
    expect(rpcHandler.provide.bind(rpcHandler, name, 123)).to.throw()

    expect(rpcHandler.unprovide.bind(rpcHandler, '')).to.throw()
    expect(rpcHandler.unprovide.bind(rpcHandler, 123)).to.throw()
    expect(rpcHandler.unprovide.bind(rpcHandler, null)).to.throw()
    expect(rpcHandler.unprovide.bind(rpcHandler)).to.throw()

    expect(rpcHandler.make.bind(rpcHandler, '')).to.throw()
    expect(rpcHandler.make.bind(rpcHandler, 123)).to.throw()
    expect(rpcHandler.make.bind(rpcHandler, null)).to.throw()
    expect(rpcHandler.make.bind(rpcHandler, name, {}, {})).to.throw()
    expect(rpcHandler.make.bind(rpcHandler, name, {}, 123)).to.throw()
    expect(rpcHandler.make.bind(rpcHandler)).to.throw()
  })

  it('registers a provider', () => {
    const message = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.PROVIDE,
      name
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)
    services.timeoutRegistryMock
      .expects('add')
      .once()
      .withExactArgs({ message })

    rpcHandler.provide(name, rpcProviderSpy as RPCProvider)

    sinon.assert.notCalled(rpcProviderSpy)
  })

  it('reregisters a provider after a connection reconnection', () => {
    const message = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.PROVIDE,
      name
    }
    services.connectionMock
      .expects('sendMessage')
      .twice()
      .withExactArgs(message)
    services.timeoutRegistryMock
      .expects('add')
      .twice()
      .withExactArgs({ message })

    rpcHandler.provide(name, rpcProviderSpy as RPCProvider)

    services.simulateConnectionReestablished()
    sinon.assert.notCalled(rpcProviderSpy)
  })

  it('sends rpc request message on make', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.REQUEST,
        name,
        parsedData: data,
        correlationId: sinon.match.any
    })

    rpcHandler.make(name, data, () => {})
  })

  it('returns promise on make when no callback is passed', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()

    const promise = rpcHandler.make(name, data)

    expect(promise).to.be.a('promise')
  })

  it('cant\'t make requests when client is offline', async () => {
    const callback = sinon.spy()
    const promisseError = sinon.spy()
    const promisseSuccess = sinon.spy()

    services.connection.isConnected = false
    services.connectionMock
      .expects('sendMessage')
      .never()

    rpcHandler.make(name, data, callback)
    const promise = rpcHandler.make(name, data)
    promise.then(promisseSuccess).catch(promisseError)

    await BBPromise.delay(0)
    sinon.assert.calledOnce(callback)
    sinon.assert.calledWithExactly(callback, EVENT.CLIENT_OFFLINE)

    sinon.assert.notCalled(promisseSuccess)
    sinon.assert.calledOnce(promisseError)
    sinon.assert.calledWithExactly(promisseError, EVENT.CLIENT_OFFLINE)
  })

  it('doesn\'t reply rpc and sends rejection if no provider exists', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.REJECT,
        name,
        correlationId: '123'
    })
    services.timeoutRegistryMock
      .expects('add')
      .never()

    handle({
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.REQUEST,
      name,
      parsedData: data,
      correlationId: '123'
    })
  })

  it('handles ack messages', () => {
    const message = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.PROVIDE_ACK,
      name,
      isAck: true
    }
    services.timeoutRegistryMock
      .expects('remove')
      .once()
      .withExactArgs(message)

    handle(message)
  })

  it('handles permission and message denied errors for provide and unprovide', () => {
    const expectations = (message: Message) => {
      services.timeoutRegistryMock
        .expects('remove')
        .once()
        .withExactArgs(message)
      services.loggerMock
        .expects('error')
        .once()
        .withExactArgs(message)
    }
    const permissionErrProvidingMsg = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.MESSAGE_PERMISSION_ERROR,
      name,
      originalAction: RPC_ACTIONS.PROVIDE
    }
    const permissionErrUnprovidingMsg = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.MESSAGE_PERMISSION_ERROR,
      name,
      originalAction: RPC_ACTIONS.UNPROVIDE
    }
    const msgDeniedProving = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.MESSAGE_DENIED,
      name,
      originalAction: RPC_ACTIONS.PROVIDE
    }
    const msgDeniedUnproving = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.MESSAGE_DENIED,
      name,
      originalAction: RPC_ACTIONS.UNPROVIDE
    }

    expectations(permissionErrProvidingMsg)
    expectations(permissionErrUnprovidingMsg)
    expectations(msgDeniedProving)
    expectations(msgDeniedUnproving)

    handle(permissionErrProvidingMsg)
    handle(permissionErrUnprovidingMsg)
    handle(msgDeniedProving)
    handle(msgDeniedUnproving)
  })

  it('logs unknown correlation error when handling unknown rpc response', () => {
    const message = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.ACCEPT,
      name,
      correlationId: '123abc'
    }
    services.loggerMock
      .expects('error')
      .once()
      .withExactArgs(message, EVENT.UNKNOWN_CORRELATION_ID)

    handle(message)
  })

  describe('when providing', () => {
    beforeEach(() => {
      rpcHandler.provide(name, rpcProviderSpy as RPCProvider)
    })

    it('doesn\'t register provider twice', () => {
      services.connectionMock
        .expects('sendMessage')
        .never()
      services.timeoutRegistryMock
        .expects('add')
        .never()

      expect(rpcHandler.provide.bind(rpcHandler, name, rpcProviderSpy as RPCProvider))
        .to.throw(`RPC ${name} already registered`)
    })

    it('triggers rpc provider callback in a new request', () => {
      const message: RPCMessage = {
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.REQUEST,
        name,
        parsedData: data,
        correlationId: '123'
      }
      const rpcResponse = new RPCResponse(message, options, services)

      handle(message)

      sinon.assert.calledOnce(rpcProviderSpy)
      sinon.assert.calledWithExactly(rpcProviderSpy, data, rpcResponse)
    })

    it('deregisters providers', () => {
      const message = {
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.UNPROVIDE,
        name
      }
      services.connectionMock
        .expects('sendMessage')
        .once()
        .withExactArgs(message)
      services.timeoutRegistryMock
        .expects('add')
        .once()
        .withExactArgs({ message })

      rpcHandler.unprovide(name)
    })

    it('doesn\'t send deregister provider message twice', () => {
      services.connectionMock
        .expects('sendMessage')
        .once()
      services.timeoutRegistryMock
        .expects('add')
        .once()
      services.loggerMock
        .expects('warn')
        .once()

      rpcHandler.unprovide(name)
      rpcHandler.unprovide(name)
    })

  })

  describe('when making', () => {
    let rpcResponseCallback: sinon.SinonSpy
    let promise: Promise<any>
    let rpcPromiseResponseSuccess: sinon.SinonSpy
    let rpcPromiseResponseFail: sinon.SinonSpy
    let correlationIdCallbackRpc: string
    let correlationIdPromiseRpc: string

    beforeEach(() => {
      services.timeoutRegistry = new TimeoutRegistry(services, options)

      rpcResponseCallback = sinon.spy()
      rpcHandler.make(name, data, rpcResponseCallback)
      correlationIdCallbackRpc = getLastMessageSent().correlationId as string

      rpcPromiseResponseSuccess = sinon.spy()
      rpcPromiseResponseFail = sinon.spy()
      promise = rpcHandler.make(name, data)
      promise
        .then(rpcPromiseResponseSuccess)
        .catch(rpcPromiseResponseFail)
      correlationIdPromiseRpc = getLastMessageSent().correlationId as string
    })

    it('handles permission errors', async () => {
      const action = RPC_ACTIONS.MESSAGE_PERMISSION_ERROR
      const handleMessage = (correlationId: string) => handle({
        topic: TOPIC.RPC,
        action,
        name,
        originalAction: RPC_ACTIONS.REQUEST,
        correlationId
      })
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdPromiseRpc)
      await BBPromise.delay(rpcAcceptTimeout * 2)

      sinon.assert.calledOnce(rpcResponseCallback)
      sinon.assert.calledWithExactly(rpcResponseCallback, RPC_ACTIONS[action])

      sinon.assert.notCalled(rpcPromiseResponseSuccess)
      sinon.assert.calledOnce(rpcPromiseResponseFail)
      sinon.assert.calledWithExactly(rpcPromiseResponseFail, RPC_ACTIONS[action])
    })

    it('handles message denied errors', async () => {
      const action = RPC_ACTIONS.MESSAGE_DENIED
      const handleMessage = (correlationId: string) => handle({
        topic: TOPIC.RPC,
        action,
        name,
        originalAction: RPC_ACTIONS.REQUEST,
        correlationId
      })
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdPromiseRpc)
      await BBPromise.delay(rpcAcceptTimeout * 2)

      sinon.assert.calledOnce(rpcResponseCallback)
      sinon.assert.calledWithExactly(rpcResponseCallback, RPC_ACTIONS[action])

      sinon.assert.notCalled(rpcPromiseResponseSuccess)
      sinon.assert.calledOnce(rpcPromiseResponseFail)
      sinon.assert.calledWithExactly(rpcPromiseResponseFail, RPC_ACTIONS[action])
    })

    it('responds rpc with error when request is not accepted in time', async () => {
      await BBPromise.delay(rpcAcceptTimeout * 2)
      sinon.assert.calledOnce(rpcResponseCallback)
      sinon.assert.calledWithExactly(rpcResponseCallback, RPC_ACTIONS[RPC_ACTIONS.ACCEPT_TIMEOUT])

      sinon.assert.notCalled(rpcPromiseResponseSuccess)
      sinon.assert.calledOnce(rpcPromiseResponseFail)
      sinon.assert.calledWithExactly(rpcPromiseResponseFail, RPC_ACTIONS[RPC_ACTIONS.ACCEPT_TIMEOUT])
    })

    it('handles the rpc response accepted message', async () => {
      const handleMessage = (correlationId: string) => handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.ACCEPT,
        name,
        correlationId
      })
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdPromiseRpc)
      await BBPromise.delay(rpcAcceptTimeout * 2)

      sinon.assert.notCalled(rpcResponseCallback)

      sinon.assert.notCalled(rpcPromiseResponseFail)
      sinon.assert.notCalled(rpcPromiseResponseSuccess)
    })

    it('calls rpcResponse with error when response is not sent in time', async () => {
      const handleMessage = (correlationId: string) => handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.ACCEPT,
        name,
        correlationId
      })
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdPromiseRpc)
      await BBPromise.delay(rpcResponseTimeout * 2)

      sinon.assert.calledOnce(rpcResponseCallback)
      sinon.assert.calledWithExactly(rpcResponseCallback, RPC_ACTIONS[RPC_ACTIONS.RESPONSE_TIMEOUT])

      sinon.assert.notCalled(rpcPromiseResponseSuccess)
      sinon.assert.calledOnce(rpcPromiseResponseFail)
      sinon.assert.calledWithExactly(rpcPromiseResponseFail, RPC_ACTIONS[RPC_ACTIONS.RESPONSE_TIMEOUT])
    })

    it('calls rpcResponse with error when no rpc provider is returned', async () => {
      const handleMessage = (correlationId: string) => handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.ACCEPT,
        name,
        correlationId
      })
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdPromiseRpc)

      handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.NO_RPC_PROVIDER,
        name,
        correlationId: correlationIdCallbackRpc
      })

      handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.NO_RPC_PROVIDER,
        name,
        correlationId: correlationIdPromiseRpc
      })

      sinon.assert.calledOnce(rpcResponseCallback)
      sinon.assert.calledWithExactly(rpcResponseCallback, RPC_ACTIONS[RPC_ACTIONS.NO_RPC_PROVIDER])

      await BBPromise.delay(0)

      sinon.assert.notCalled(rpcPromiseResponseSuccess)
      sinon.assert.calledOnce(rpcPromiseResponseFail)
      sinon.assert.calledWithExactly(rpcPromiseResponseFail, RPC_ACTIONS[RPC_ACTIONS.NO_RPC_PROVIDER])
    })

    it('handles the rpc response RESPONSE message', async () => {
      const handleMessage = (correlationId: string) => handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.RESPONSE,
        name,
        correlationId,
        parsedData: data
      })
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdPromiseRpc)

      sinon.assert.calledOnce(rpcResponseCallback)
      sinon.assert.calledWithExactly(rpcResponseCallback, null, data)

      await BBPromise.delay(0)

      sinon.assert.notCalled(rpcPromiseResponseFail)
      sinon.assert.calledOnce(rpcPromiseResponseSuccess)
      sinon.assert.calledWithExactly(rpcPromiseResponseSuccess, data)
    })

    it('doesn\'t call rpc response callback twice when handling response message', async () => {
      const handleMessage = (correlationId: string) => handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.RESPONSE,
        name,
        correlationId,
        parsedData: data
      })
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdPromiseRpc)
      handleMessage(correlationIdPromiseRpc)
      await BBPromise.delay(rpcResponseTimeout * 2)

      sinon.assert.calledOnce(rpcResponseCallback)

      sinon.assert.notCalled(rpcPromiseResponseFail)
      sinon.assert.calledOnce(rpcPromiseResponseSuccess)
    })

    it('handles the rpc response error message', async () => {
      const error = 'ERROR'
      const handleMessage = (correlationId: string) => handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.REQUEST_ERROR,
        name,
        correlationId,
        parsedData: error
      })
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdPromiseRpc)
      await BBPromise.delay(rpcResponseTimeout * 2)

      sinon.assert.calledOnce(rpcResponseCallback)
      sinon.assert.calledWithExactly(rpcResponseCallback, error)

      sinon.assert.notCalled(rpcPromiseResponseSuccess)
      sinon.assert.calledOnce(rpcPromiseResponseFail)
      sinon.assert.calledWithExactly(rpcPromiseResponseFail, error)
    })

    it('doesn\'t call rpc response callback twice when handling error message', async () => {
      const error = 'ERROR'
      const handleMessage = (correlationId: string) => handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.REQUEST_ERROR,
        name,
        correlationId,
        parsedData: error
      })
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdCallbackRpc)
      handleMessage(correlationIdPromiseRpc)
      handleMessage(correlationIdPromiseRpc)
      await BBPromise.delay(rpcResponseTimeout * 2)

      sinon.assert.calledOnce(rpcResponseCallback)
      sinon.assert.notCalled(rpcPromiseResponseSuccess)
      sinon.assert.calledOnce(rpcPromiseResponseFail)
    })

    it.only('responds with error when onConnectionLost', async () => {
      services.simulateConnectionLost()
      await BBPromise.delay(1)

      sinon.assert.calledOnce(rpcResponseCallback)
      sinon.assert.calledWithExactly(rpcResponseCallback, EVENT.CLIENT_OFFLINE)

      sinon.assert.notCalled(rpcPromiseResponseSuccess)
      sinon.assert.calledOnce(rpcPromiseResponseFail)
      sinon.assert.calledWithExactly(rpcPromiseResponseFail, EVENT.CLIENT_OFFLINE)
    })

  })

})
