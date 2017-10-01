'use strict'
/* global describe, it, expect, jasmine */

let proxyquire = require('proxyquire'),
  WebsocketMock = require('../../mocks/transport/websocket-mock'),
  Connection = proxyquire('../../../src/message/connection', { ws: WebsocketMock }),
  deepstream = proxyquire('../../../src/client', { './message/connection': Connection }),
  msg = require('../../test-helper/test-helper').msg

describe('connection losses are handled gracefully', () => {
  let client,
    recordA,
    recordB,
    recordC

  it('creates the client', () => {
    client = deepstream('someUrl')
    recordA = client.record.getRecord('recordA')
    expect(client._connection._endpoint.lastSendMessage).toBe(null)
    expect(client.getConnectionState()).toBe('CLOSED')
  })

  it('connects', () => {
    client._connection._endpoint.simulateOpen()
    client._connection._endpoint.emit('message', msg('C|A+'))
    recordB = client.record.getRecord('recordB')
    expect(client.getConnectionState()).toBe('AWAITING_AUTHENTICATION')
  })

  it('logs in', () => {
	    client.login({ username: 'Wolfram' })
	    recordC = client.record.getRecord('recordC')
    expect(client._connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"username":"Wolfram"}+'))
    expect(client.getConnectionState()).toBe('AUTHENTICATING')
  })

  it('opens the connection', () => {
	    client._connection._endpoint.emit('message', msg('A|A+'))
	    expect(client.getConnectionState()).toBe('OPEN')
	    expect(client._connection._endpoint.lastSendMessage).toBe(msg('R|CR|recordA+R|CR|recordB+R|CR|recordC+'))
	    expect(recordA.isReady).toBe(false)
	    expect(recordB.isReady).toBe(false)
	    expect(recordC.isReady).toBe(false)
  })

  it('receives read messages', () => {
	    client._connection._endpoint.emit('message', msg('R|R|recordA|1|{}'))
	    client._connection._endpoint.emit('message', msg('R|R|recordB|1|{}'))
	    client._connection._endpoint.emit('message', msg('R|R|recordC|1|{}'))
	    expect(recordA.isReady).toBe(true)
	    expect(recordB.isReady).toBe(true)
	    expect(recordC.isReady).toBe(true)
  })

  it('sends message on open connection', () => {
	    recordB.set('firstname', 'Wolfram')
	    expect(client._connection._endpoint.lastSendMessage).toBe(msg('R|P|recordB|2|firstname|SWolfram+'))
  })

  it('loses the connection', () => {
	    client._connection._endpoint.close()
	    expect(client.getConnectionState()).toBe('RECONNECTING')
	    recordA.set('firstname', 'Egon')
	    expect(client._connection._endpoint.lastSendMessage).toBe(msg('R|P|recordB|2|firstname|SWolfram+'))
  })

  it('re-establishes the connection', () => {
	    client._connection._endpoint.simulateOpen()
	    client._connection._endpoint.emit('message', msg('C|A+'))
	    expect(client._connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"username":"Wolfram"}+'))
	    expect(client.getConnectionState()).toBe('AUTHENTICATING')
  })

  it('resubscribes on open', () => {
    client._connection._endpoint.emit('message', msg('A|A+'))
	    expect(client.getConnectionState()).toBe('OPEN')

	    /**
	    * The first message is concatendated since the path message was queued when connection was lost
	    * and the request of recordA flushed the queue
	    */
    const sentMessages = client._connection._endpoint.messages
	    expect(sentMessages.slice(sentMessages.length - 3)).toEqual([
	    	msg('R|P|recordA|2|firstname|SEgon+R|CR|recordA+'),
	    	msg('R|CR|recordB+'),
	    	msg('R|CR|recordC+'),
	    ])
  })

  it('applies an update on resubscription read event and does not call onReady', () => {
    const onReadySpy = jasmine.createSpy('onReady')
    const onErrorSpy = jasmine.createSpy('onError')
    recordA.setMergeStrategy((record, remoteVersion, remoteData, callback) => {
      callback('Error merging')
    })
    recordA.on('ready', onReadySpy)
    client.on('error', onErrorSpy)

    client._connection._endpoint.emit('message', msg('R|R|recordA|5|{}'))

    expect(onReadySpy).not.toHaveBeenCalled()

    expect(onErrorSpy).toHaveBeenCalled()
    expect(onErrorSpy).toHaveBeenCalledWith('recordA', 'VERSION_EXISTS', 'R')
  })

  it('deletes a record', () => {
    const deletionCallback = jasmine.createSpy('deletionCallback')
    recordC.on('delete', deletionCallback)

	    recordC.delete()

	    expect(deletionCallback).not.toHaveBeenCalled()
	    expect(client._connection._endpoint.lastSendMessage).toBe(msg('R|D|recordC+'))

	    client._connection._endpoint.emit('message', msg('R|A|D|recordC'))
	    expect(deletionCallback).toHaveBeenCalled()
  })

  it('loses the connection', () => {
	    client._connection._endpoint.close()
	    expect(client.getConnectionState()).toBe('RECONNECTING')
  })

  it('re-establishes the connection', () => {
	    client._connection._endpoint.simulateOpen()
	    client._connection._endpoint.emit('message', msg('C|A+'))
	    expect(client._connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"username":"Wolfram"}+'))
	    expect(client.getConnectionState()).toBe('AUTHENTICATING')
  })

  it('resubscribes on open', () => {
    client._connection._endpoint.emit('message', msg('A|A+'))
	    expect(client.getConnectionState()).toBe('OPEN')

	    const sentMessages = client._connection._endpoint.messages
	    expect(sentMessages.slice(sentMessages.length - 2)).toEqual([
	    	msg('R|CR|recordA+'),
	    	msg('R|CR|recordB+'),
	    ])
  })
})
