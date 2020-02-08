import { expect } from 'chai'
import { getServicesMock } from '../test/mocks'

import { DefaultOptions } from '../client-options'
import { RPCResponse } from './rpc-response'
import { TOPIC, RPC_ACTION } from '../constants'
import { PromiseDelay } from '../util/utils'

describe('RPC response', () => {
  let services: any
  let rpcResponse: RPCResponse
  const name = 'myRPC'
  const correlationId = 'correlationId'

  beforeEach(() => {
    services = getServicesMock()
    rpcResponse = new RPCResponse({
        topic: TOPIC.RPC,
        action: RPC_ACTION.REQUEST,
        name,
        correlationId
      },
      DefaultOptions,
      services
    )
    rpcResponse.autoAccept = false
  })

  afterEach(() => {
    services.connectionMock.verify()
  })

  it('doesn\'t accept automatically when autoAccept == false', async () => {
    services.connectionMock
      .expects('sendMessage')
      .never()

    await PromiseDelay(2)
  })

  it('sends an accept message automatically when autoAccept == true ', async () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTION.ACCEPT,
        name,
        correlationId
      })

    rpcResponse.autoAccept = true

    await PromiseDelay(2)
  })

  it('sends an accept message manually', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTION.ACCEPT,
        name,
        correlationId
      })

    rpcResponse.accept()
  })

  it('sends the response message but accepts the rpc before when it is not accepted yet', () => {
    const data = { foo: 'bar'}
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTION.ACCEPT,
        name,
        correlationId
      })
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTION.RESPONSE,
        name,
        correlationId,
        parsedData: data
      })

    rpcResponse.send(data)
  })

  it('throws when trying to send a completed response', () => {
    const data = { foo: 'bar'}
    /**
     * 1st call: accept message
     * 2nd call: response message
     */
    services.connectionMock
      .expects('sendMessage')
      .twice()

    rpcResponse.send(data)
    expect(rpcResponse.send.bind(rpcResponse, data)).to.throw(`Rpc ${name} already completed`)
  })

  it('doesn\'t send multiple accept messages', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()

    rpcResponse.accept()
    rpcResponse.accept()
  })

  it('sends reject message', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTION.REJECT,
        name,
        correlationId
      })

    rpcResponse.reject()
  })

  it('doesn\'t send reject message twice and throws error', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()

    rpcResponse.reject()
    expect(rpcResponse.reject.bind(rpcResponse)).to.throw(`Rpc ${name} already completed`)
  })

  it('sends error message', () => {
    const error = 'error'
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTION.REQUEST_ERROR,
        name,
        correlationId,
        parsedData: error
      })

    rpcResponse.error(error)
  })

  it('doesn\'t send error message twice and throws error', () => {
    const error = 'error'

    services.connectionMock
      .expects('sendMessage')
      .once()

    rpcResponse.error(error)
    expect(rpcResponse.error.bind(rpcResponse, error)).to.throw(`Rpc ${name} already completed`)
  })
})
