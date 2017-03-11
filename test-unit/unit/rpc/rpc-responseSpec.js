'use strict'
/* global describe, it, expect, jasmine */

let RpcResponse = require('../../../src/rpc/rpc-response'),
  connectionMock = new (require('../../mocks/message/connection-mock'))(),
  msg = require('../../test-helper/test-helper').msg

describe('sends the correct response messages - happy path', () => {
  let response

  it('creates the response object', () => {
    response = new RpcResponse(connectionMock, 'addTwo', '123')
    expect(response.send).toBeDefined()
  })

  it('sends an ack message automatically', (done) => {
    setTimeout(() => {
      expect(connectionMock.lastSendMessage).toBe(msg('P|A|REQ|addTwo|123+'))
      done()
    }, 10)
  })

  it('sends the response', () => {
    response.send(14)
    expect(connectionMock.lastSendMessage).toBe(msg('P|RES|addTwo|123|N14+'))
  })
})

describe('sends the correct response messages - ack behaviour', () => {
  let response

  it('creates the response object', () => {
    response = new RpcResponse(connectionMock, 'addTwo', '123')
    response.autoAck = false
    expect(response.send).toBeDefined()
  })

  it('doesn\'t send ack if autoAck == false', (done) => {
    connectionMock.lastSendMessage = null

    setTimeout(() => {
      expect(connectionMock.lastSendMessage).toBe(null)
      done()
    }, 10)
  })

  it('sends ack message', () => {
    response.ack()
    expect(connectionMock.lastSendMessage).toBe(msg('P|A|REQ|addTwo|123+'))
  })

  it('doesn\'t send multiple ack messages', () => {
    connectionMock.lastSendMessage = null
    response.ack()
    expect(connectionMock.lastSendMessage).toBe(null)
  })

})

describe('sends the correct response messages - reject behaviour', () => {
  let response

  it('creates the response object', () => {
    response = new RpcResponse(connectionMock, 'addTwo', '123')
    expect(response.send).toBeDefined()
  })

  it('rejects messages', () => {
    response.reject()
    expect(connectionMock.lastSendMessage).toBe(msg('P|REJ|addTwo|123+'))
  })

  it('throws an error when trying to send a completed response', () => {
    expect(() => { response.send('bla') }).toThrow()
  })
})

describe('sends the correct response messages - error behaviour', () => {
  let response

  it('creates the response object', () => {
    response = new RpcResponse(connectionMock, 'addTwo', '123')
    expect(response.send).toBeDefined()
  })

  it('errors messages', () => {
    response.error('Error Message')
    expect(connectionMock.lastSendMessage).toBe(msg('P|E|Error Message|addTwo|123+'))
  })

  it('throws an error when trying to send a completed response', () => {
    expect(() => { response.send('bla') }).toThrow()
  })
})
