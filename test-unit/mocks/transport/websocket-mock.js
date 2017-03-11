'use strict'

let events = require('events'),
  util = require('util')

let count = -1

/**
 * @emit open
 * @emit close
 * @emit error
 * @emit message
 */
const WebsocketMock = function (url) {
  this.url = url
  this.isOpen = false
  this.lastSendMessage = null
  this.messages = []
  count++
}

util.inherits(WebsocketMock, events.EventEmitter)

WebsocketMock.prototype.onopen = function () {}
WebsocketMock.prototype.onmessage = function () {}
WebsocketMock.prototype.onclose = function () {}
WebsocketMock.prototype.onerror = function () {}

WebsocketMock.prototype.simulateOpen = function () {
  this.isOpen = true
  this.readyState = WebsocketMock.OPEN
  this.onopen()
}

WebsocketMock.prototype.close = function () {
  this.isOpen = false
  this.readyState = WebsocketMock.CLOSED
  this.onclose()
}

WebsocketMock.prototype.getCallsToOpen = function () {
  return count
}

WebsocketMock.prototype.resetCallsToOpen = function () {
  count = 0
}

WebsocketMock.prototype.send = function (msg) {
  this.messages.push(msg)
  this.lastSendMessage = msg
}

WebsocketMock.prototype.emit = function (type, data) {
  if (type === 'message') {
    this.onmessage({ data })
  }
}

module.exports = WebsocketMock
