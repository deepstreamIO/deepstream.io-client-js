'use strict'
/* global describe, it, expect, jasmine */


let RecordHandler = require('../../../src/record/record-handler'),
  ClientMock = require('../../mocks/client-mock'),
  ConnectionMock = require('../../mocks/message/connection-mock'),
  msg = require('../../test-helper/test-helper').msg,
  options = {}

describe('record handler returns the right list', () => {

  let recordHandler,
    listA,
    listA2,
    onDiscard = jasmine.createSpy('onDiscard'),
    connection = new ConnectionMock(),
    client = new ClientMock()

  it('creates the RecordHandler', () => {
    recordHandler = new RecordHandler(options, connection, client)
    expect(typeof recordHandler.getList).toBe('function')
  })

  it('retrieves listA', () => {
    expect(connection.lastSendMessage).toBe(null)
    listA = recordHandler.getList('listA')
    listA.on('discard', onDiscard)

    expect(connection.lastSendMessage).toBe(msg('R|CR|listA+'))
  })

  it('retrieves listA again', () => {
    connection.lastSendMessage = null

    listA2 = recordHandler.getList('listA')
    expect(listA).toBe(listA2)

    expect(connection.lastSendMessage).toBe(null)
  })

  it('initialises listA', () => {
    expect(listA.isReady).toBe(false)
    recordHandler._$handle({
      topic: 'R',
      action: 'R',
      data: ['listA', 0, '{}']
    })
    expect(listA.isReady).toBe(true)
  })

  it('discards listA', () => {
    listA.discard()
    listA2.discard()

    expect(onDiscard).not.toHaveBeenCalled()
    expect(listA.isDestroyed).toBe(false)
    expect(connection.lastSendMessage).toBe(msg('R|US|listA+'))
  })

  it('returns a new listA and resubscribes', () => {
    expect(recordHandler.getList('listA')).not.toBe(listA)
    expect(listA.isDestroyed).toBe(false)
    expect(connection.lastSendMessage).toBe(msg('R|CR|listA+'))
  })

  it('has destroyed listA when discard ack is received', () => {
    recordHandler._$handle({
      topic: 'R',
      action: 'A',
      data: ['US', 'listA']
    })
    expect(onDiscard).toHaveBeenCalled()
    expect(listA.isDestroyed).toBe(true)
  })
})
