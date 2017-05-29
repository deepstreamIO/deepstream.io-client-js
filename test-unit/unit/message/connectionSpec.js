'use strict'
/* global describe, it, expect, jasmine */


let proxyquire = require('proxyquire').noCallThru(),
  C = require('../../../src/constants/constants'),
  WebsocketMock = require('../../mocks/transport/websocket-mock'),
  Connection = proxyquire('../../../src/message/connection', { ws: WebsocketMock }),
  clientMock = new (require('../../mocks/client-mock'))(),
  msg = require('../../test-helper/test-helper').msg,
  url = 'somehost:4444',
  options = {
    maxMessagesPerPacket: 100,
    timeBetweenSendingQueuedPackages: 10
  },
  clientConnectionStateChangeCount

clientMock.on('connectionStateChanged', () => {
  clientConnectionStateChangeCount++
})

/** ***************************************
* CONNECTIVITY
*****************************************/
describe('connects - happy path', () => {

  let connection,
    authCallback = jasmine.createSpy('authCallback')

  it('creates the connection', () => {
    clientConnectionStateChangeCount = 0

    connection = new Connection(clientMock, url, options)
    expect(connection.getState()).toBe('CLOSED')
  })

  it('awaits connection ack when opened', () => {
    expect(clientConnectionStateChangeCount).toBe(0)
    connection._endpoint.simulateOpen()
    expect(clientConnectionStateChangeCount).toBe(1)
  })

  it('when it recieves connection ack switches to awaiting authentication', () => {
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
    expect(clientConnectionStateChangeCount).toBe(2)
  })

  it('sends auth parameters', () => {
    expect(connection._endpoint.lastSendMessage).toBe(null)
    connection.authenticate({ user: 'Wolfram' }, authCallback)
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
    expect(connection.getState()).toBe('AUTHENTICATING')
    expect(clientConnectionStateChangeCount).toBe(3)
    expect(authCallback).not.toHaveBeenCalled()
  })

  it('processes the authentication response', () => {
    connection._endpoint.emit('message', msg('A|A+'))
    expect(connection.getState()).toBe('OPEN')
    expect(authCallback).toHaveBeenCalledWith(true, null)
    expect(clientConnectionStateChangeCount).toBe(4)
  })

  it('sends individual messages', (done) => {
    connection.sendMsg('R', 'S', ['test1'])
    setTimeout(() => {
      expect(connection._endpoint.lastSendMessage).toBe(msg('R|S|test1+'))
      done()
    }, 10)
  })

  it('closes the connection', () => {
    expect(connection._endpoint.isOpen).toBe(true)
    connection.close()
    expect(connection._endpoint.isOpen).toBe(false)
    expect(connection.getState()).toBe('CLOSED')
    expect(clientConnectionStateChangeCount).toBe(5)
  })
})

/** ***************************************
* CONNECTIVITY
*****************************************/
describe('connects - heartbeats', () => {

  let connection,
    authCallback = jasmine.createSpy('authCallback')

  beforeEach(() => {
    connection = new Connection(clientMock, url, {
      heartbeatInterval: 50
    })
    connection._endpoint.simulateOpen()
    connection._endpoint.emit('message', msg('C|A+'))
  })

  afterEach(() => {
    connection.close()
  })

  it('when it recieves a ping responds with a pong', () => {
    connection._endpoint.emit('message', msg('C|PI+'))
    expect(connection._endpoint.lastSendMessage).toBe(msg('C|PO+'))
  })

  it('when it misses one heart beat nothing happens', (done) => {
    setTimeout(() => {
      expect(connection._endpoint.lastSendMessage).toBe(null)
      expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
      done()
    }, 75)
  })

  it('when it misses two heart beats it closes connection', (done) => {
    setTimeout(() => {
      expect(connection._endpoint.lastSendMessage).toBe(null)
      expect(connection.getState()).toBe('CLOSED')
      expect(clientMock.lastError).toEqual(['C', 'connectionError', 'heartbeat not received in the last 100 milliseconds'])
      done()
    }, 200)
  })
})

/** ***************************************
* REDIRECT
*****************************************/
describe('connects - redirect', () => {

  let connection,
    authCallback = jasmine.createSpy('authCallback'),
    options = {
      reconnectIntervalIncrement: 10,
      maxReconnectAttempts: 5
    }

  it('creates the connection', () => {
    clientConnectionStateChangeCount = 0

    connection = new Connection(clientMock, url, options)
    expect(connection.getState()).toBe('CLOSED')

    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
    expect(clientConnectionStateChangeCount).toBe(1)
  })

  it('recieves a connection challenge and responds with url', () => {
    connection._endpoint.emit('message', msg('C|CH+'))
    expect(connection.getState()).toBe('CHALLENGING')
    expect(connection._endpoint.lastSendMessage).toBe(msg('C|CHR|ws://somehost:4444+'))
    expect(clientConnectionStateChangeCount).toBe(2)
  })

  it('gets a redirect when it responds with a valid url', () => {
    connection._endpoint.emit('message', msg('C|RED|someotherhost:5050+'))
    connection._endpoint.simulateOpen()

    expect(connection.getState()).toBe('AWAITING_CONNECTION')
    expect(clientConnectionStateChangeCount).toBe(3)
  })

  it('creates connection to new url', () => {
    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
    expect(clientConnectionStateChangeCount).toBe(4)
  })

  it('recieves a connection ack from new url', () => {
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
    expect(clientConnectionStateChangeCount).toBe(5)
    expect(connection._endpoint.url).toBe('someotherhost:5050')
  })

  it('connects to the original url after it loses the connection', () => {
    connection._endpoint.close()

    setTimeout(() => {
      expect(connection.getState()).toBe('RECONNECTING')
      connection._endpoint.simulateOpen()
      expect(connection._endpoint.url).toBe('ws://somehost:4444')
    })
  })
})

describe('connects - redirect rejection', () => {

  let connection,
    authCallback = jasmine.createSpy('authCallback'),
    options = {
      reconnectIntervalIncrement: 10,
      maxReconnectAttempts: 5
    }

  it('creates the connection', () => {
    clientConnectionStateChangeCount = 0

    connection = new Connection(clientMock, url, options)
    expect(connection.getState()).toBe('CLOSED')

    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
    expect(clientConnectionStateChangeCount).toBe(1)
  })

  xit('recieves a connection challenge and responds with invalid url', () => {
    connection._endpoint.emit('message', msg('C|CH+'))
    expect(connection.getState()).toBe('CHALLENGING')
    expect(connection._endpoint.lastSendMessage).toBe(msg('C|CHR|ws://somehost:4444+'))
    expect(clientConnectionStateChangeCount).toBe(2)
  })

  xit('gets a reject and closes connection', () => {
    connection._endpoint.emit('message', msg('C|CH+'))
    expect(connection.getState()).toBe('CHALLENGING')
    expect(clientConnectionStateChangeCount).toBe(3)

    connection._endpoint.emit('message', msg('C|REJ+'))
    expect(connection.getState()).toBe('CLOSED')
    expect(clientConnectionStateChangeCount).toBe(4)
  })

  xit('can longer attempt to authenticate user', () => {
    connection.authenticate({})
    expect(clientMock.lastError).toEqual(['X', 'IS_CLOSED', 'this client\'s connection was closed'])
  })
})

/** ***************************************
* BUFFERING
*****************************************/
describe('buffers messages whilst connection is closed', () => {
  let connection

  it('creates the connection', () => {
    connection = new Connection(clientMock, url, options)
    expect(connection.getState()).toBe('CLOSED')
    expect(connection._endpoint.lastSendMessage).toBe(null)
  })

  it('tries to send messages whilst connection is closed', (done) => {
    expect(connection._endpoint.lastSendMessage).toBe(null)
    connection.sendMsg('R', 'S', ['rec1'])
    setTimeout(() => {
      expect(connection._endpoint.lastSendMessage).toBe(null)
      done()
    }, 10)
  })

  it('tries to send messages whilst awaiting connection ack', (done) => {
    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
    connection.sendMsg('R', 'S', ['rec2'])
    setTimeout(() => {
      expect(connection._endpoint.lastSendMessage).toBe(null)
      done()
    }, 10)
  })

  it('tries to send messages whilst awaiting authentication', (done) => {
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
    connection.sendMsg('R', 'S', ['rec3'])
    setTimeout(() => {
      expect(connection._endpoint.lastSendMessage).toBe(null)
      done()
    }, 10)
  })

  it('tries to send messages whilst authenticating', (done) => {
    connection.authenticate({ user: 'Wolfram' }, () => {})
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
    expect(connection.getState()).toBe('AUTHENTICATING')
    connection.sendMsg('R', 'S', ['rec4'])
    setTimeout(() => {
      expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
      done()
    }, 10)
  })

  it('tries to send messages whilst authenticating', (done) => {
    connection._endpoint.emit('message', msg('A|A'))
    expect(connection.getState()).toBe('OPEN')

    setTimeout(() => {
      const expected = msg('R|S|rec1', 'R|S|rec2', 'R|S|rec3', 'R|S|rec4+')
      expect(connection._endpoint.lastSendMessage).toBe(expected)
      done()
    }, 10)
  })
})

/** ***************************************
* AUTHENTICATION
*****************************************/
describe('connection handles auth rejections', () => {
  let connection,
    authCallback = jasmine.createSpy('invalid auth callback')

  it('creates the connection', () => {
    connection = new Connection(clientMock, url, options)
    expect(connection.getState()).toBe('CLOSED')
    expect(connection._endpoint.lastSendMessage).toBe(null)
  })

  it('opens the connection', () => {
    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
  })

  it('sends auth parameters on connection ack', () => {
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection._endpoint.lastSendMessage).toBe(null)
    connection.authenticate({ user: 'Wolfram' }, authCallback)
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
    expect(connection.getState()).toBe('AUTHENTICATING')
    expect(authCallback).not.toHaveBeenCalled()
  })

  it('receives auth rejection message', () => {
    connection._endpoint.emit('message', msg('A|E|INVALID_AUTH_DATA|Sunknown user+'))
    expect(authCallback).toHaveBeenCalledWith(false, 'unknown user')
    expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
  })

  it('sends different auth parameters', () => {
    connection.authenticate({ user: 'Egon' }, authCallback)
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Egon"}+'))
    expect(connection.getState()).toBe('AUTHENTICATING')
  })

  it('receives auth ack message', () => {
    connection._endpoint.emit('message', msg('A|A+'))
    expect(authCallback).toHaveBeenCalledWith(true, null)
    expect(connection.getState()).toBe('OPEN')
  })

  it('closes the connection, and then tries to authenticate again sends new credentials', (done) => {
    clientMock.once('connectionStateChanged', (connectionState) => {
      if (connectionState !== 'CLOSED') return
      connection.authenticate({ user: 'John' }, authCallback)

      connection._endpoint.simulateOpen()
      connection._endpoint.emit('message', msg('C|A+'))

      expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"John"}+'))
      expect(connection.getState()).toBe('AUTHENTICATING')
      done()
    })
    connection.close()
  })

})

describe('connection auth with bad login data', () => {
  let connection,
    authCallback = jasmine.createSpy('invalid auth callback')

  it('creates the connection', () => {
    connection = new Connection(clientMock, url, options)
    expect(connection.getState()).toBe('CLOSED')
    expect(connection._endpoint.lastSendMessage).toBe(null)
  })

  it('opens the connection', () => {
    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
  })

  it('sends auth parameters on connection ack', () => {
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection._endpoint.lastSendMessage).toBe(null)
    connection.authenticate(new String('Bad Auth'), authCallback)
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|"Bad Auth"+'))
    expect(connection.getState()).toBe('AUTHENTICATING')
    expect(authCallback).not.toHaveBeenCalled()
  })

  it('receives auth parse error', () => {
    connection._endpoint.emit('message', msg('A|E|INVALID_AUTH_MSG|invalid authentication message+'))
    expect(authCallback).toHaveBeenCalledWith(false, 'invalid authentication message')
    expect(connection._deliberateClose).toBe(true)
  })

  it('reopens the connection', () => {
    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
    connection._endpoint.emit('message', msg('C|A+'))
  })

  it('sends auth parameters on connection ack', () => {
    authCallback = jasmine.createSpy('invalid auth callback')
    connection._endpoint.lastSendMessage = null
    connection.authenticate('Bad Auth', authCallback)
    expect(connection._endpoint.lastSendMessage).toBe(null)
    expect(clientMock.lastError).toEqual(['X', 'INVALID_AUTH_MSG', 'authParams is not an object'])
  })
})

/** ***************************************
* Login With Return Data
*****************************************/
describe('connection handles data associated with login', () => {
  let connection,
    authCallback = jasmine.createSpy('login with return data')

  it('creates the connection', () => {
    connection = new Connection(clientMock, url, options)
    expect(connection.getState()).toBe('CLOSED')
    expect(connection._endpoint.lastSendMessage).toBe(null)
  })

  it('opens the connection', () => {
    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
  })

  it('sends auth parameters', () => {
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection._endpoint.lastSendMessage).toBe(null)
    connection.authenticate({ user: 'Wolfram' }, authCallback)
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
    expect(connection.getState()).toBe('AUTHENTICATING')
    expect(authCallback).not.toHaveBeenCalled()
  })

  it('receives auth ack message', () => {
    connection._endpoint.emit('message', msg('A|A|O{"id":12345}+'))
    expect(authCallback).toHaveBeenCalledWith(true, { id: 12345 })
    expect(connection.getState()).toBe('OPEN')
  })
})

/** ***************************************
* RECONNECTING
*****************************************/
describe('reach the max reconnect attempts and consider the maxReconnectInterval', () => {
  let connection,
    authCallback = jasmine.createSpy('invalid auth callback'),
    options = {
      reconnectIntervalIncrement: 50,
      maxReconnectAttempts: 3,
      maxReconnectInterval: 50
    }

  it('creates the connection', () => {
    connection = new Connection(clientMock, url, options)
    connection._endpoint.resetCallsToOpen()
    expect(connection._endpoint.url).toBe('ws://somehost:4444')
    expect(connection.getState()).toBe('CLOSED')
    expect(connection._endpoint.lastSendMessage).toBe(null)
  })

  it('opens the connection', () => {
    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
  })

  it('recieves connection ack', () => {
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
  })

  it('loses the connection', (done) => {
    expect(connection._endpoint.getCallsToOpen()).toBe(0)
    connection._endpoint.close()
    expect(connection.getState()).toBe('RECONNECTING')
    expect(connection._endpoint.getCallsToOpen()).toBe(0)

    clientMock.on(C.EVENT.MAX_RECONNECTION_ATTEMPTS_REACHED, () => {
      process.nextTick(done)
    })

    function checkForXinTime(amount, timeout) {
      setTimeout(() => {
        connection._endpoint.close()
        expect(connection._endpoint.getCallsToOpen()).toBe(amount)
      }, timeout)
    }

    checkForXinTime(1, 0)
    checkForXinTime(1, 25)
    checkForXinTime(2, 75)
    checkForXinTime(3, 175)
  })
})

describe('tries to reconnect if the connection drops unexpectedly', () => {
  let connection,
    authCallback = jasmine.createSpy('invalid auth callback'),
    options = { reconnectIntervalIncrement: 10, maxReconnectAttempts: 5 }

  it('creates the connection', () => {
    connection = new Connection(clientMock, url, options)
    connection._endpoint.resetCallsToOpen()
    expect(connection._endpoint.url).toBe('ws://somehost:4444')
    expect(connection.getState()).toBe('CLOSED')
    expect(connection._endpoint.lastSendMessage).toBe(null)
  })

  it('opens the connection', () => {
    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
  })

  it('recieves connection ack', () => {
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
  })

  it('loses the connection', (done) => {
    expect(connection._endpoint.getCallsToOpen()).toBe(0)
    connection._endpoint.close()
    expect(connection.getState()).toBe('RECONNECTING')
    expect(connection._endpoint.getCallsToOpen()).toBe(0)

    setTimeout(() => {
      expect(connection._endpoint.getCallsToOpen()).toBe(1)
    }, 1)

    setTimeout(() => {
      connection._endpoint.close()
      expect(connection._endpoint.getCallsToOpen()).toBe(1)
    }, 50)

    setTimeout(() => {
      expect(connection._endpoint.getCallsToOpen()).toBe(2)
      done()
    }, 100)
  })

  it('re-establishes the connection', (done) => {
    expect(connection.getState()).toBe('RECONNECTING')
    expect(connection._endpoint.getCallsToOpen()).toBe(2)
    expect(connection._endpoint.url).toBe('ws://somehost:4444')
    connection._endpoint.simulateOpen()
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
    setTimeout(() => {
      expect(connection._endpoint.getCallsToOpen()).toBe(2)
      done()
    }, 40)
  })

  it('sends auth parameters', () => {
    expect(connection._endpoint.lastSendMessage).toBe(null)
    connection.authenticate({ user: 'Wolfram' }, authCallback)
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
    expect(connection.getState()).toBe('AUTHENTICATING')
  })

  it('receives auth ack message', () => {
    connection._endpoint.emit('message', msg('A|A+'))
    expect(connection.getState()).toBe('OPEN')
  })

  it('loses an authenticated connection', (done) => {
    connection._endpoint.lastSendMessage = null
    connection._endpoint.close()
    expect(connection.getState()).toBe('RECONNECTING')
    expect(connection._endpoint.lastSendMessage).toBe(null)
    setTimeout(done, 10)
  })

  it('reconnects', (done) => {
    expect(connection.getState()).toBe('RECONNECTING')
    connection._endpoint.simulateOpen()
    connection._endpoint.emit('message', msg('C|A+'))
    setTimeout(done, 10)
  })

  it('sends auth message again', () => {
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
    expect(connection.getState()).toBe('AUTHENTICATING')
  })

  it('receives auth ack message', () => {
    connection._endpoint.emit('message', msg('A|A+'))
    expect(connection.getState()).toBe('OPEN')
  })
})

/** ***************************************
* SPLITTING PACKETS
*****************************************/
describe('splits messages into smaller packets', () => {
  let connection,
    options = {
      maxMessagesPerPacket: 5,
      timeBetweenSendingQueuedPackages: 10
    },
    sendMessages = function (connection, from, to) {
      for (from; from < to; from++) {
        connection.sendMsg('E', 'EVT', ['w', from])
      }
    }

  it('creates the connection', () => {
    connection = new Connection(clientMock, url, options)
    expect(connection.getState()).toBe('CLOSED')
    expect(connection._endpoint.lastSendMessage).toBe(null)
  })

  it('opens the connection', () => {
    connection._endpoint.simulateOpen()
    expect(connection.getState()).toBe('AWAITING_CONNECTION')
  })

  it('recieves connection ack', () => {
    connection._endpoint.emit('message', msg('C|A+'))
    expect(connection.getState()).toBe('AWAITING_AUTHENTICATION')
  })

  it('sends auth parameters', () => {
    expect(connection._endpoint.lastSendMessage).toBe(null)
    connection.authenticate({ user: 'Wolfram' }, () => {})
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
    expect(connection.getState()).toBe('AUTHENTICATING')
  })

  it('receives auth ack message', () => {
    connection._endpoint.emit('message', msg('A|A+'))
    expect(connection.getState()).toBe('OPEN')
  })

  it('sends individual messages straight away', () => {
    expect(connection._endpoint.lastSendMessage).toBe(msg('A|REQ|{"user":"Wolfram"}+'))
    sendMessages(connection, 0, 1)
    expect(connection._endpoint.lastSendMessage).toBe(msg('E|EVT|w|0+'))
  })

  it('sends messages less than maxMessagesPerPacket straight away', () => {
    sendMessages(connection, 1, 3)
    expect(connection._endpoint.lastSendMessage).toBe(msg('E|EVT|w|2+'))
  })

  xit('buffers messages greater than maxMessagesPerPacket', () => {
    sendMessages(connection, 4, 8)
    expect(connection._endpoint.lastSendMessage).toBe(msg('E|EVT|w|4+'))
  })

  xit('sends messages that are buffered when currentPacketMessageCount exceeds maxMessagesPerPacket', (done) => {
    const expectedMessage = msg('E|EVT|w|5+E|EVT|w|6+E|EVT|w|7+')

    setTimeout(() => {
      expect(connection._endpoint.lastSendMessage).toBe(expectedMessage)
      done()
    }, 100)
  })

  xit('sends buffered messages that are buffered when messageQueue exceeds maxMessagesPerPacket', (done) => {
    sendMessages(connection, 9, 17)

    let expectedMessages = [
        msg('E|EVT|w|10+E|EVT|w|11+E|EVT|w|12+E|EVT|w|13+E|EVT|w|14+'),
        msg('E|EVT|w|15+E|EVT|w|16+')
      ],
      currentlyExpectedMessage = 0

    setInterval(() => {
      if (connection._endpoint.lastSendMessage === expectedMessages[currentlyExpectedMessage]) {
        currentlyExpectedMessage++
      }
      if (currentlyExpectedMessage === expectedMessages.length) {
        done()
      }
    }, 1)
  })
})
