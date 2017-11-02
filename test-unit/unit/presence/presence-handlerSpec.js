'use strict'
/* global describe, it, expect, jasmine */

let PresenceHandler = require('../../../src/presence/presence-handler'),
  connectionMock = new (require('../../mocks/message/connection-mock'))(),
  mockClient = new (require('../../mocks/client-mock'))(),
  msg = require('../../test-helper/test-helper').msg,
  C = require('../../../src/constants/constants'),
  options = {}

describe('presence handler', () => {
  let presenceHandler,
    callback = jasmine.createSpy('presenceCallback')

  beforeEach(() => {
    connectionMock.lastSendMessage = null
    callback.calls.reset()
  })

  it('creates the presenceHandler', () => {
    presenceHandler = new PresenceHandler(options, connectionMock, mockClient)
  })

  it('subscribes to presence with user a', (done) => {
    presenceHandler.subscribe('userA', callback)
    setTimeout(() => {
      expect(connectionMock.lastSendMessage).toBe(msg('U|S|1|["userA"]+'))
      done()
    }, 1)
  })

  it('subscribes to presence with user b', (done) => {
    presenceHandler.subscribe('userB', callback)
    setTimeout(() => {
      expect(connectionMock.lastSendMessage).toBe(msg('U|S|2|["userB"]+'))
      done()
    }, 1)
  })

  it('emits an error if no ack message is received for userB presence subscription', (done) => {
    expect(mockClient.lastError).toBe(null)
    setTimeout(() => {
      const errorParams = ['U', 'ACK_TIMEOUT', 'No ACK message received in time for 2']
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
      data: ['userA']
    })
	  expect(callback).toHaveBeenCalledWith(true, 'userA')
  })

  it('notified when client logs out', () => {
    presenceHandler._$handle({
      topic: 'U',
      action: 'PNL',
      data: ['userB']
    })
	 expect(callback).toHaveBeenCalledWith(false, 'userB')
  })

  it('queries for clients', () => {
	    presenceHandler.getAll(['userA','userB'], callback)
	    expect(connectionMock.lastSendMessage).toBe(msg('U|Q|3|["userA","userB"]+'))
  })

  it('receives data for query', () => {
    presenceHandler._$handle({
      topic: 'U',
      action: 'Q',
      data: [3, '{"userA": true, "userB": false }']
    })
	 expect(callback).toHaveBeenCalledWith({'userA': true, 'userB': false })
  })

  it('unsubscribes to client logins', (done) => {
    presenceHandler.unsubscribe('userA', callback)
        setTimeout(() => {
    expect(connectionMock.lastSendMessage).toBe(msg('U|US|4|["userA"]+'))
      done()
    }, 1)
  })

  it('emits an error if no ack message is received for presence unsubscribes', (done) => {
    expect(mockClient.lastError).toBe(null)
    setTimeout(() => {
      const errorParams = ['U', 'ACK_TIMEOUT', 'No ACK message received in time for 4']
      expect(mockClient.lastError).toEqual(errorParams)
      mockClient.lastError = null
      done()
    }, 20)
  })

  xit('receives ack for unsubscribe', () => {
    presenceHandler._$handle({
      topic: 'U',
      action: 'A',
      data: ['US']
    })
    expect(connectionMock.lastSendMessage).toBeNull()
  }).pend('Throws unsolicitated error message since timeout has been cleared')

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
      data: [1, {'userA': true, 'userB': false }]
    })
	    expect(callback).not.toHaveBeenCalled()
  })

})
