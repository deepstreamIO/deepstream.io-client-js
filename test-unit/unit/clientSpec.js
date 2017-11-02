'use strict'
/* global describe, it, expect, jasmine */

let proxyquire = require('proxyquire'),
  ConnectionMock = require('../mocks/message/connection-mock'),
  deepstream = proxyquire('../../src/client', { './message/connection': ConnectionMock })

describe('connects', () => {
  let client,
    stateChangeCallback = jasmine.createSpy('stateChangeCallback')

  it('creates the client', () => {
    client = deepstream('someUrl')
    expect(client.getConnectionState()).toBe('CLOSED')
    expect(client._connection.lastSendMessage).toBe(null)
  })

  it('receives a different uid for every call', () => {
    expect(client.getUid()).not.toBe(client.getUid())
  })

  it('merges options correctly', () => {
    client = deepstream('someUrl', {
      recordPersistDefault: false,
      recordDeleteTimeout: 34852
    })
    expect(client._options.recordReadTimeout).toBe(15000)
    expect(client._options.recordDeleteTimeout).toBe(34852)
  })

  it('exposes constants on deepstream', () => {
    expect(deepstream.CONSTANTS).toEqual(require('../../src/constants/constants'))
    expect(client.CONSTANTS).toEqual(require('../../src/constants/constants'))
  })

  it('exposes merge strategies on deepstream', () => {
    expect(deepstream.MERGE_STRATEGIES).toEqual(require('../../src/constants/merge-strategies'))
    expect(client.MERGE_STRATEGIES).toEqual(require('../../src/constants/merge-strategies'))
  })

  it('allows login without auth params or callback', () => {
    client._connection.lastAuthParams = undefined
    client.login()
    expect(client._connection.lastAuthParams).toEqual({})
  })

  it('allows login with just auth params', () => {
    client._connection.lastAuthParams = undefined
    const params = { foo: 'bar' }
    client.login(params)
    expect(client._connection.lastAuthParams).toEqual(params)
  })

  it('allows login with just a callback', () => {
    client._connection.lastAuthParams = undefined
    client._connection.lastAuthCallback = undefined
    const callback = () => {}
    client.login(callback)
    expect(client._connection.lastAuthParams).toEqual({})
    expect(client._connection.lastAuthCallback).toEqual(callback)
  })

  it('allows login with auth params and a callback', () => {
    client._connection.lastAuthParams = undefined
    client._connection.lastAuthCallback = undefined
    const params = { some: 'data' }
    const callback = () => {}
    client.login(params, callback)
    expect(client._connection.lastAuthParams).toEqual(params)
    expect(client._connection.lastAuthCallback).toEqual(callback)
  })
})
