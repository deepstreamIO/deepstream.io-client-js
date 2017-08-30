'use strict'
/* global describe, it, expect, jasmine */

let PresenceHandler = require('../../../src/presence/presence-handler'),
  connectionMock = new (require('../../mocks/message/connection-mock'))(),
  mockClient = new (require('../../mocks/client-mock'))(),
  msg = require('../../test-helper/test-helper').msg,
  C = require('../../../src/constants/constants'),
  options = {}

describe('presence handler deprecated', () => {
  let presenceHandler,
    callback = jasmine.createSpy('presenceCallback')

  beforeEach(() => {
    connectionMock.lastSendMessage = null
    callback.calls.reset()
  })

  it('creates the presenceHandler', () => {
    presenceHandler = new PresenceHandler(options, connectionMock, mockClient)
  })

  it('subscribes to presence', () => {
    presenceHandler.subscribe(callback)
    expect(connectionMock.lastSendMessage).toBe(msg('U|S|S+'))
  })

  it('emits an error if no ack message is received for presence subscription', (done) => {
    expect(mockClient.lastError).toBe(null)
    setTimeout(() => {
      const errorParams = ['U', 'ACK_TIMEOUT', 'No ACK message received in time for S']
      expect(mockClient.lastError).toEqual(errorParams)
      mockClient.lastError = null
      done()
    }, 20)
  })

  it('notified when client logs in', () => {
    expect(callback).not.toHaveBeenCalled()
    presenceHandler._$handle({
      topic: 'U',
      action: 'PNJ',
      data: ['Homer']
    })
	    expect(callback).toHaveBeenCalledWith('Homer', true)
  })

  it('notified when client logs out', () => {
    presenceHandler._$handle({
      topic: 'U',
      action: 'PNL',
      data: ['Marge']
    })
	    expect(callback).toHaveBeenCalledWith('Marge', false)
  })

  it('queries for clients', () => {
	    presenceHandler.getAll(callback)
	    expect(connectionMock.lastSendMessage).toBe(msg('U|Q|Q+'))
  })

  it('receives data for query', () => {
	    presenceHandler._$handle({
      topic: 'U',
      action: 'Q',
      data: ['Marge', 'Homer', 'Bart']
    })
	    expect(callback).toHaveBeenCalledWith(['Marge', 'Homer', 'Bart'])
  })

  it('unsubscribes to client logins', () => {
    presenceHandler.unsubscribe(callback)
    expect(connectionMock.lastSendMessage).toBe(msg('U|US|US+'))
  })

  it('emits an error if no ack message is received for presence unsubscribes', (done) => {
    expect(mockClient.lastError).toBe(null)
    setTimeout(() => {
      const errorParams = ['U', 'ACK_TIMEOUT', 'No ACK message received in time for US']
      expect(mockClient.lastError).toEqual(errorParams)
      mockClient.lastError = null
      done()
    }, 20)
  })

  it('not notified of future actions', () => {
    expect(callback).not.toHaveBeenCalled()
    presenceHandler._$handle({
      topic: 'U',
      action: 'PNJ',
      data: ['Homer']
    })
	    expect(callback).not.toHaveBeenCalled()

	   	presenceHandler._$handle({
     topic: 'U',
     action: 'PNL',
     data: ['Homer']
   })
	    expect(callback).not.toHaveBeenCalled()

	    presenceHandler._$handle({
      topic: 'U',
      action: 'Q',
      data: ['Marge', 'Homer', 'Bart']
    })
	    expect(callback).not.toHaveBeenCalled()
  })

})
