'use strict'

const sinon = require('sinon')
const config = require('../config')
const check = require('../helper').check
const queryCallback = sinon.spy()
const subscribeCallback = sinon.spy()

module.exports = function () {
  this.When(/^the client queries for connected clients$/, (callback) => {
    global.dsClient.presence.getAll(queryCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.Then(/^the client is notified that no clients are connected$/, () => {
    sinon.assert.calledWith(queryCallback, [])
    sinon.assert.calledOnce(queryCallback)
    queryCallback.reset()
  })

  this.Then(/^the client is notified that clients "([^"]*)" are connected$/, (clients) => {
    const connected_clients = clients.split(',')
    sinon.assert.calledWith(queryCallback, connected_clients)
    sinon.assert.calledOnce(queryCallback)
    queryCallback.reset()
  })

  /**
  * Subscribes
  */
  this.When(/^the client subscribes to presence events$/, (callback) => {
    global.dsClient.presence.subscribe(subscribeCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client unsubscribes to presence events$/, (callback) => {
    global.dsClient.presence.unsubscribe(subscribeCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client is notified that client "(\w*)" logged in$/, (username) => {
    sinon.assert.calledWith(subscribeCallback, username, true)
    sinon.assert.calledOnce(subscribeCallback)
    subscribeCallback.reset()
  })

  this.When(/^the client is notified that client "(\w*)" logged out$/, (username) => {
    sinon.assert.calledWith(subscribeCallback, username, false)
    sinon.assert.calledOnce(subscribeCallback)
    subscribeCallback.reset()
  })

  this.When(/^the client is not notified that client "(\w*)" logged in$/, (username) => {
    sinon.assert.notCalled(subscribeCallback)
  })
}
