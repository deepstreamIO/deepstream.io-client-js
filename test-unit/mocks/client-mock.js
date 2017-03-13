'use strict'

const Emitter = require('component-emitter2')
const AckTimeoutRegistry = require('../../src/utils/ack-timeout-registry')

const ClientMock = function (options) {
  this.uid = 1
  this.lastError = null

  this.connectionState = 'OPEN'
  this.on('connectionStateChanged', (connectionState) => {
    this.connectionState = connectionState
  })

  this.options = { subscriptionTimeout: 5 } || options
}

Emitter(ClientMock.prototype)

ClientMock.prototype.getUid = function () {
  return this.uid.toString()
}

ClientMock.prototype.getConnectionState = function () {
  return this.connectionState
}

ClientMock.prototype._$getAckTimeoutRegistry = function () {
  return new AckTimeoutRegistry(this, this.options)
}

ClientMock.prototype._$onError = function (topic, event, msg) {
  this.lastError = [topic, event, msg]
}

ClientMock.prototype._$onMessage = function (msg) {

}

module.exports = ClientMock
