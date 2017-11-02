'use strict'

const messageBuilder = require('../../../src/message/message-builder')

const ConnectionMock = function () {
  this.lastSendMessage = null
  this.state = 'CLOSED'
}

ConnectionMock.prototype.sendMsg = function (topic, action, data) {
  this.lastSendMessage = messageBuilder.getMsg(topic, action, data)
}

ConnectionMock.prototype.send = function (message) {
  this.lastSendMessage = message
}

ConnectionMock.prototype.getState = function () {
  return this.state
}

ConnectionMock.prototype.authenticate = function (authParams, callback) {
  this.lastAuthParams = authParams
  this.lastAuthCallback = callback
}

module.exports = ConnectionMock
