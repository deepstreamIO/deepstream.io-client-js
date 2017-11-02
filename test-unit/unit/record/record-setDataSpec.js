'use strict'
/* global describe, it, expect, jasmine */

let RecordHandler = require('../../../src/record/record-handler'),
  ClientMock = require('../../mocks/client-mock'),
  ConnectionMock = require('../../mocks/message/connection-mock'),
  msg = require('../../test-helper/test-helper').msg,
  options = {}

describe('RecordHandler.setData', () => {

  let recordHandler,
    recordA,
    onDiscard = jasmine.createSpy('onDiscard'),
    connection = new ConnectionMock(),
    client = new ClientMock(),
    setCallback = jasmine.createSpy('setCallback')

  it('creates the RecordHandler', () => {
    recordHandler = new RecordHandler(options, connection, client)
    expect(typeof recordHandler.setData).toBe('function')
  })

  it('sends update messages for entire data changes', () => {
    recordHandler.setData('testRecord', { firstname: 'Wolfram' })
    expect(connection.lastSendMessage).toBe(msg('R|CU|testRecord|-1|{"firstname":"Wolfram"}|{}+'))
  })

  it('sends update messages for path changes ', () => {
    recordHandler.setData('testRecord', 'lastname', 'Hempel')
    expect(connection.lastSendMessage).toBe(msg('R|CU|testRecord|-1|lastname|SHempel|{}+'))
  })

  it('deletes value when sending undefined', () => {
    recordHandler.setData('testRecord', 'lastname', undefined)
    expect(connection.lastSendMessage).toBe(msg('R|CU|testRecord|-1|lastname|U|{}+'))
  })

  it('throws error for too few arguments', () => {
    expect(() => { recordHandler.setData() }).toThrow()
    expect(() => { recordHandler.setData('testRecord').toThrow() }).toThrow()
  })

  it('throws error for invalid record name', () => {
    expect(() => { recordHandler.setData(undefined, { some: 'data' }) }).toThrow()
    expect(() => { recordHandler.setData(null, { some: 'data' }) }).toThrow()
    expect(() => { recordHandler.setData(123, { some: 'data' }) }).toThrow()
    expect(() => { recordHandler.setData({}, { some: 'data' }) }).toThrow()
  })

  it('throws error for undefined record data with no path', () => {
    expect(() => { recordHandler.setData('testRecord', undefined) }).toThrow()
    expect(() => { recordHandler.setData('testRecord', undefined, () => {}) }).toThrow()
  })

  it('throws error for null record data with no path', () => {
    expect(() => { recordHandler.setData('testRecord', null) }).toThrow()
    expect(() => { recordHandler.setData('testRecord', null, () => {}) }).toThrow()
  })

  it('throws error for an empty path', () => {
    expect(() => { recordHandler.setData('testRecord', '', 'data') }).toThrow()
  })

  it('throws error for string record data', () => {
    expect(() => { recordHandler.setData('testRecord', 'Some String') }).toThrow()
  })

  it('throws error for numeric record data', () => {
    expect(() => { recordHandler.setData('testRecord', 100.24) }).toThrow()
  })

  it('throws error for invalid callback', () => {
    expect(() => { recordHandler.setData('testRecord', {}, { not: 'func' }) }).toThrow()
    expect(() => { recordHandler.setData('testRecord', 'path', 'val', { not: 'func' }) }).toThrow()
  })

  it('sends update messages for entire data changes with callback', () => {
    recordHandler.setData('testRecord', { name: 'Alex' }, setCallback)
    expect(connection.lastSendMessage).toBe(
      msg('R|CU|testRecord|-1|{"name":"Alex"}|{"writeSuccess":true}+')
    )
  })

  it('sends update messages for path changes with callback', () => {
    recordHandler.setData('testRecord', 'name', 'Wolfram', setCallback)
    expect(connection.lastSendMessage).toBe(
      msg('R|CU|testRecord|-1|name|SWolfram|{"writeSuccess":true}+')
    )
  })
})
