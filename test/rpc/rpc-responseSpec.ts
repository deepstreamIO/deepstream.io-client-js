import { expect } from 'chai'
import * as sinon from 'sinon'
import { getServicesMock } from '../mocks'
import { EVENT } from '../../src/constants'
import { TOPIC, RPC_ACTIONS, RPCMessage } from '../../binary-protocol/src/message-constants'

import { DefaultOptions } from '../../src/client-options'
import { RPCResponse } from '../../src/rpc/rpc-response'

describe('RPC response', () => {
  let services: any
  let rpcResponse: RPCResponse
  const name = 'myRPC'
  const correlationId = 'correlationId'

  beforeEach(() => {
    services = getServicesMock()
    rpcResponse = new RPCResponse({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.REQUEST,
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

  it('doesn\'t accept automatically when autoAccept == false', () => {
    services.connectionMock
      .expects('sendMessage')
      .never()
  })

  it('sends an accept message automatically when autoAccept == true ', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.ACCEPT,
        name,
        correlationId
      })

    rpcResponse.autoAccept = true
  })

  it('sends an accept message manually', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.ACCEPT,
        name,
        correlationId
      })

    rpcResponse.accept()
  })

  it('sends the response message', () => {
    const data = { foo: 'bar'}
    const message = {
      topic: TOPIC.RPC,
      action: RPC_ACTIONS.RESPONSE,
      name,
      correlationId,
      parsedData: data
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(message)

    rpcResponse.send(data)
  })

  it('throws when trying to send a completed response', () => {
    const data = { foo: 'bar'}
    services.connectionMock
      .expects('sendMessage')
      .twice()

    rpcResponse.send(data)
    expect(rpcResponse.send.bind(rpcResponse, data)).to.throw()
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
        action: RPC_ACTIONS.REJECT,
        name,
        correlationId
      })

    rpcResponse.reject()
  })

  it('sends error message', () => {
    const error = 'error'
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RPC,
        action: RPC_ACTIONS.REQUEST_ERROR,
        name,
        correlationId,
        parsedData: error
      })

    rpcResponse.error(error)
  })

})
