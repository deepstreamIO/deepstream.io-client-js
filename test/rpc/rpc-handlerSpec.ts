import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { getServicesMock, getLastMessageSent } from '../mocks'
import { EVENT } from '../../src/constants'
import { TOPIC, RPC_ACTIONS, RPCMessage } from '../../binary-protocol/src/message-constants'

import { DefaultOptions, Options } from '../../src/client-options'
import { RPCHandler, RPCProvider } from '../../src/rpc/rpc-handler'
import { RPCResponse } from '../../src/rpc/rpc-response'
import { TimeoutRegistry } from '../../src/util/timeout-registry'

describe.only('RPC handler', () => {
  let services: any
  let rpcHandler: RPCHandler
  let handle: Function
  let rpcProviderSpy: sinon.SinonSpy
  let data: any
  const name = 'myRpc'
  const rpcAcceptTimeout = 5
  const options = Object.assign({}, DefaultOptions, { rpcAcceptTimeout })

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

    expect(promise).to.not.null
    expect(promise).to.be.a('promise')
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

  it('doesn\'t send messages and warn on auth/denied errors', () => {
    services.connectionMock
      .expects('sendMessage')
      .never()
    services.timeoutRegistryMock
      .expects('add')
      .never()
    services.loggerMock
      .expects('warn')
      .never()
    services.loggerMock
      .expects('error')
      .never()

    handle({
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.MESSAGE_PERMISSION_ERROR,
      name
    })
    handle({
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.MESSAGE_DENIED,
      name
    })
  })

  it('logs unknown correlation error when handling unknown rpc response', () => {
    const message = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.ACCEPT,
      name
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

      expect(rpcHandler.provide.bind(rpcHandler, name, rpcProviderSpy as RPCProvider)).to.throw()
    })

    it('replies requests', () => {
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

      rpcHandler.unprovide(name)
      rpcHandler.unprovide(name)
    })


  })

  describe('when making', () => {
    let rpcResponse: sinon.SinonSpy

    beforeEach(() => {
      services.timeoutRegistry = new TimeoutRegistry(services, options)
      rpcResponse = sinon.spy()
      rpcHandler.make(name, data, rpcResponse)
    })

    it('calls rpcResponse with error when request is not accepted in time', async () => {
      await BBPromise.delay(rpcAcceptTimeout * 2)
      sinon.assert.calledOnce(rpcResponse)
      sinon.assert.calledWithExactly(rpcResponse, RPC_ACTIONS[RPC_ACTIONS.ACCEPT_TIMEOUT])
    })

    it('handles the rpc response accepted message', async () => {
      handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.ACCEPT,
        name,
        correlationId: getLastMessageSent().correlationId
      })

      await BBPromise.delay(rpcAcceptTimeout * 2)
      sinon.assert.notCalled(rpcResponse)
    })

    it('handles the rpc response RESPONSE message', async () => {
      handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.RESPONSE,
        name,
        correlationId: getLastMessageSent().correlationId,
        parsedData: data
      })

      await BBPromise.delay(rpcAcceptTimeout * 2)
      sinon.assert.calledOnce(rpcResponse)
      sinon.assert.calledWithExactly(rpcResponse, null, data)
    })

    it('doesn\'t call rpc response callback twice when handling response message', async () => {
      handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.RESPONSE,
        name,
        correlationId: getLastMessageSent().correlationId,
        parsedData: data
      })
      await BBPromise.delay(rpcAcceptTimeout * 2)
      handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.RESPONSE,
        name,
        correlationId: getLastMessageSent().correlationId,
        parsedData: data
      })

      await BBPromise.delay(rpcAcceptTimeout * 2)
      sinon.assert.calledOnce(rpcResponse)
    })

    it('handles the rpc response error message', async () => {
      const error = 'ERROR'
      handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.REQUEST_ERROR,
        name,
        correlationId: getLastMessageSent().correlationId,
        parsedData: error
      })

      await BBPromise.delay(rpcAcceptTimeout * 2)
      sinon.assert.calledOnce(rpcResponse)
      sinon.assert.calledWithExactly(rpcResponse, error, error)
    })

    it('doesn\'t call rpc response callback twice when handling error message', async () => {
      handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.RESPONSE,
        name,
        correlationId: getLastMessageSent().correlationId,
        parsedData: data
      })
      await BBPromise.delay(rpcAcceptTimeout * 2)
      handle({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.RESPONSE,
        name,
        correlationId: getLastMessageSent().correlationId,
        parsedData: data
      })

      await BBPromise.delay(rpcAcceptTimeout * 2)
      sinon.assert.calledOnce(rpcResponse)
    })
  })


})


