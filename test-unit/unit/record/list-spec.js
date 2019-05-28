'use strict'
/* global describe, it, expect, jasmine */

let List = require('../../../src/record/list'),
  RecordHandler = require('../../../src/record/record-handler'),
  ClientMock = require('../../mocks/client-mock'),
  ConnectionMock = require('../../mocks/message/connection-mock'),
  msg = require('../../test-helper/test-helper').msg,
  options = { recordReadAckTimeout: 100, recordReadTimeout: 200 }

describe('lists contain arrays of record names', () => {
  let list,
    recordHandler = new RecordHandler(options, new ConnectionMock(), new ClientMock()),
    readyCallback = jasmine.createSpy('ready'),
    changeCallback = jasmine.createSpy('change'),
    setCallback = jasmine.createSpy('set')

  it('creates the list', () => {
    list = new List(recordHandler, 'someList', {})
    list.subscribe(changeCallback)
    list.whenReady(readyCallback)
    expect(list.subscribe.bind(list, 'somePath', changeCallback)).toThrow()
    expect(list.getEntries).toBeDefined()
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|CR|someList+'))
    expect(readyCallback).not.toHaveBeenCalled()
  })

  it('starts with an empty array', () => {
    expect(list.getEntries()).toEqual([])
    expect(list.isEmpty()).toBe(true)
  })

  it('receives a response from the server', () => {
    recordHandler._$handle({
      topic: 'R',
      action: 'R',
      data: ['someList', 1, '["entryA","entryB"]']
    })
    expect(list.getEntries()).toEqual(['entryA', 'entryB'])
    expect(changeCallback).toHaveBeenCalledWith(['entryA', 'entryB'])
    expect(readyCallback).toHaveBeenCalled()
    expect(readyCallback).toHaveBeenCalledWith(list)
    expect(list.isEmpty()).toBe(false)
  })

  it('adds an entry to the end of list', () => {
    list.addEntry('entryC')
    expect(list.getEntries()).toEqual(['entryA', 'entryB', 'entryC'])
    expect(changeCallback).toHaveBeenCalledWith(['entryA', 'entryB', 'entryC'])
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|2|["entryA","entryB","entryC"]+'))
  })

  it('removes an entry from the list', () => {
    list.removeEntry('entryB')
    expect(list.getEntries()).toEqual(['entryA', 'entryC'])
    expect(changeCallback).toHaveBeenCalledWith(['entryA', 'entryC'])
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|3|["entryA","entryC"]+'))
  })

  it('adds an entry to the list at a explicit index', () => {
    list.addEntry('entryD', 1)
    expect(list.getEntries()).toEqual(['entryA', 'entryD', 'entryC'])
    expect(changeCallback).toHaveBeenCalledWith(['entryA', 'entryD', 'entryC'])
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|4|["entryA","entryD","entryC"]+'))
  })

  it('removes an entry to the list at a explicit index', () => {
    list.removeEntry('entryD', 1)
    expect(list.getEntries()).toEqual(['entryA', 'entryC'])
    expect(changeCallback).toHaveBeenCalledWith(['entryA', 'entryC'])
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|5|["entryA","entryC"]+'))
  })

  it('sets the entire list', () => {
    list.setEntries(['u', 'v'])
    expect(list.getEntries()).toEqual(['u', 'v'])
    expect(changeCallback).toHaveBeenCalledWith(['u', 'v'])
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|6|["u","v"]+'))
  })

  it('handles server updates', () => {
    recordHandler._$handle({
      topic: 'R',
      action: 'R',
      data: ['someList', 7, '["x","y"]']
    })
    expect(list.getEntries()).toEqual(['x', 'y'])
    expect(changeCallback).toHaveBeenCalledWith(['x', 'y'])
  })

  it('handles empty lists', () => {
    list.setEntries([])
    expect(list.getEntries()).toEqual([])
    expect(list.isEmpty()).toBe(true)
    list.addEntry('someEntry', 0)
    expect(list.getEntries()).toEqual(['someEntry'])
    expect(list.isEmpty()).toBe(false)
    list.removeEntry('someEntry', 0)
    expect(list.getEntries()).toEqual([])
    expect(list.isEmpty()).toBe(true)
  })

  it('unsubscribes', () => {
    expect(changeCallback.calls.count()).toBe(10)
    list.unsubscribe(changeCallback)
    list.setEntries(['q'])
    expect(changeCallback.calls.count()).toBe(10)
  })

  it('adding entries, methods are queued when record is not ready, correct indexes', () => {
    list._record.isReady = false
    list.setEntries(['a', 'c', 'e'])
    list.addEntry('b', 1)
    list.addEntry('d', 3)
    expect(list._queuedMethods.length).toEqual(3)
    list._record.isReady = true
    list._onReady()
    expect(list.getEntries()).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('removing entries, methods are queued when record is not ready, correct indexes', () => {
    list._record.isReady = false
    list.setEntries(['b', 'a', 'b', 'c', 'b'])
    list.removeEntry('b', 0)
    list.removeEntry('b', 3)
    expect(list._queuedMethods.length).toEqual(3)
    list._record.isReady = true
    list._onReady()
    expect(list.getEntries()).toEqual(['a', 'b', 'c'])
  })

  it('sets the entire list with callback', () => {
    expect(list.setEntriesWithAck(['u', 'v'], setCallback)).toBeUndefined()
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|18|["u","v"]|{"writeSuccess":true}+'))
  })

  it('sets the entire list with promise', () => {
    const promise = list.setEntriesWithAck(['v', 'w'])
    expect(promise instanceof Promise).toBe(true)
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|19|["v","w"]|{"writeSuccess":true}+'))
  })

  it('adds an entry to the end of list with a callback', () => {
    expect(list.addEntryWithAck('x', setCallback)).toBeUndefined()
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|20|["v","w","x"]|{"writeSuccess":true}+'))
  })

  it('adds an entry to the end of list with a promise', () => {
    const promise = list.addEntryWithAck('y')
    expect(promise instanceof Promise).toBe(true)
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|21|["v","w","x","y"]|{"writeSuccess":true}+'))
  })

  it('adds an entry to the list on an explicit index with a callback', () => {
    expect(list.addEntryWithAck('u', 0, setCallback)).toBeUndefined()
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|22|["u","v","w","x","y"]|{"writeSuccess":true}+'))
  })

  it('adds an entry to the list at an explicit index with promise', () => {
    const promise = list.addEntryWithAck('t', 0)
    expect(promise instanceof Promise).toBe(true)
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|23|["t","u","v","w","x","y"]|{"writeSuccess":true}+'))
  })

  it('removes an entry from the list with a callback', () => {
    expect(list.removeEntryWithAck('x', setCallback)).toBeUndefined()
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|24|["t","u","v","w","y"]|{"writeSuccess":true}+'))
  })

  it('removes an entry from the list with a promise', () => {
    const promise = list.removeEntryWithAck('y')
    expect(promise instanceof Promise).toBe(true)
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|25|["t","u","v","w"]|{"writeSuccess":true}+'))
  })

  it('removes an entry from the list on an explicit index with a callback', () => {
    expect(list.removeEntryWithAck('t', 0, setCallback)).toBeUndefined()
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|26|["u","v","w"]|{"writeSuccess":true}+'))
  })

  it('removes an entry from the list on an explicit index with a promise', () => {
    const promise = list.removeEntryWithAck('w', 2)
    expect(promise instanceof Promise).toBe(true)
    expect(recordHandler._connection.lastSendMessage).toBe(msg('R|U|someList|27|["u","v"]|{"writeSuccess":true}+'))
  })
})
