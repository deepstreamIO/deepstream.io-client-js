'use strict'
/* global describe, it, expect, jasmine */

let EventHandler = require('../../../src/event/event-handler'),
  connectionMock = new (require('../../mocks/message/connection-mock'))(),
  mockClient = new (require('../../mocks/client-mock'))(),
  msg = require('../../test-helper/test-helper').msg,
  options = {}

describe('event handler', () => {
  let eventHandler,
    callback = jasmine.createSpy('eventCallback')

  it('creates the eventHandler', () => {
    eventHandler = new EventHandler(options, connectionMock, mockClient)
    expect(eventHandler.emit).toBeDefined()
  })

  it('emits an event it has no listeners for', () => {
    expect(connectionMock.lastSendMessage).toBe(null)
    eventHandler.emit('myEvent', 6)
    expect(connectionMock.lastSendMessage).toBe(msg('E|EVT|myEvent|N6+'))
  })

  it('subscribes to an event', () => {
	    eventHandler.subscribe('myEvent', callback)
	    expect(connectionMock.lastSendMessage).toBe(msg('E|S|myEvent+'))
  })

  it('emits an error if no ack message is received for the subscribe', (done) => {
    expect(mockClient.lastError).toBe(null)
    setTimeout(() => {
      const errorParams = ['E', 'ACK_TIMEOUT', 'No ACK message received in time for myEvent']
      expect(mockClient.lastError).toEqual(errorParams)
      mockClient.lastError = null
      done()
    }, 20)
  })

  it('notifies local listeners for local events', () => {
    expect(callback).not.toHaveBeenCalled()
	    eventHandler.emit('myEvent', 8)
	    expect(callback).toHaveBeenCalledWith(8)
  })

  it('notifies local listeners for remote events', () => {
    eventHandler._$handle({
      topic: 'EVENT',
      action: 'EVT',
      data: ['myEvent', 'N23']
    })

	    expect(callback).toHaveBeenCalledWith(23)
  })

  it('notifies local listeners for remote events without data', () => {
    eventHandler._$handle({
      topic: 'EVENT',
      action: 'EVT',
      data: ['myEvent']
    })

	    expect(callback).toHaveBeenCalledWith()
  })

  it('emits error if event data is not typed', () => {
    eventHandler._$handle({
      topic: 'EVENT',
      action: 'EVT',
      data: ['myEvent', 'notTypes']
    })

    const errorParams = ['X', 'MESSAGE_PARSE_ERROR', 'UNKNOWN_TYPE (notTypes)']
    expect(mockClient.lastError).toEqual(errorParams)
    mockClient.lastError = null
  })

  it('removes local listeners', () => {
    eventHandler.unsubscribe('myEvent', callback)
    eventHandler.emit('myEvent', 11)
    expect(callback).toHaveBeenCalledWith()
  })

  it('emits an error if no ack message is received for the unsubscribe', (done) => {
    expect(mockClient.lastError).toBe(null)
    setTimeout(() => {
      const errorParams = ['E', 'ACK_TIMEOUT', 'No ACK message received in time for myEvent']
      expect(mockClient.lastError).toEqual(errorParams)
      mockClient.lastError = null
      done()
    }, 20)
  })

  it('emits an error event for unsolicited event messages', () => {
    eventHandler._$handle({
      topic: 'EVENT',
      action: 'L',
      data: ['myEvent']
    })

    const errorParams = ['E', 'UNSOLICITED_MESSAGE', 'myEvent']
    expect(mockClient.lastError).toEqual(errorParams)
    mockClient.lastError = null
  })
})
