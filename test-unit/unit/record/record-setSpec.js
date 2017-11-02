'use strict'
/* global describe, it, expect, jasmine */

let Record = require('../../../src/record/record.js'),
  MockConnection = require('../../mocks/message/connection-mock'),
  msg = require('../../test-helper/test-helper').msg,
  ClientMock = require('../../mocks/client-mock'),
  options = { recordReadAckTimeout: 100, recordReadTimeout: 200 }

describe('setting values sends the right messages to the server', () => {
  let record,
    callback = jasmine.createSpy('firstnameCallback'),
    connection = new MockConnection(),
    setCallback = jasmine.createSpy('setCallback')

  it('creates the record', () => {
    expect(connection.lastSendMessage).toBe(null)
    record = new Record('testRecord', {}, connection, options, new ClientMock())
    record._$onMessage({ topic: 'R', action: 'R', data: ['testRecord', 0, '{}'] })
    expect(record.get()).toEqual({})
    expect(connection.lastSendMessage).toBe(msg('R|CR|testRecord+'))
  })

  it('sends update messages for entire data changes', () => {
    record.set({ firstname: 'Wolfram' })
    expect(connection.lastSendMessage).toBe(msg('R|U|testRecord|1|{"firstname":"Wolfram"}+'))
  })

  it('sends update messages for path changes ', () => {
    record.set('lastname', 'Hempel')
    expect(connection.lastSendMessage).toBe(msg('R|P|testRecord|2|lastname|SHempel+'))
  })

  it('deletes value when sending undefined', () => {
    record.set('lastname', undefined)
    expect(connection.lastSendMessage).toBe(msg('R|P|testRecord|3|lastname|U+'))
    expect(record.get()).toEqual({ firstname: 'Wolfram' })
  })

  it('throws error for invalid record data', () => {
    expect(() => { record.set(undefined) }).toThrow()
  })

  it('throws error for null record data', () => {
    expect(() => { record.set(null) }).toThrow()
  })

  it('throws error for string record data', () => {
    expect(() => { record.set('Some String') }).toThrow()
  })

  it('throws error for numeric record data', () => {
    expect(() => { record.set(100.24) }).toThrow()
  })

  it('sends update messages for entire data changes with callback', () => {
    record.set({ name: 'Alex' }, setCallback)
    expect(connection.lastSendMessage).toBe(msg('R|U|testRecord|4|{"name":"Alex"}|{"writeSuccess":true}+'))
  })

  it('sends update messages for path changes with callback', () => {
    record.set('name', 'Wolfram', setCallback)
    expect(connection.lastSendMessage).toBe(msg('R|P|testRecord|5|name|SWolfram|{"writeSuccess":true}+'))
  })
})
