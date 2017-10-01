'use strict'

const cucumber = require('cucumber')
const Before = cucumber.Before
const After = cucumber.After
const Given = cucumber.Given
const When = cucumber.When
const Then = cucumber.Then

const sinon = require('sinon')
const config = require('../config')
const check = require('../helper').check
const queryCallback = sinon.spy()
const subscribeCallback = sinon.spy()

  When(/^the client queries for connected clients$/, (callback) => {
    global.dsClient.presence.getAll(queryCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client queries if "([^"]*)" are online$/, (users, callback) => {
    global.dsClient.presence.getAll(users.split(','), queryCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  Then(/^the client is notified that no clients are connected$/, () => {
    sinon.assert.calledWith(queryCallback, [])
    sinon.assert.calledOnce(queryCallback)
    queryCallback.reset()
  })

  Then(/^the client is notified with '(.*)'$/, (users) => {
    sinon.assert.calledWith(queryCallback, JSON.parse(users))
    sinon.assert.calledOnce(queryCallback)
    queryCallback.reset()
  })

  Then(/^the client is notified that clients "([^"]*)" are connected$/, (clients) => {
    const connected_clients = clients.split(',')
    sinon.assert.calledWith(queryCallback, connected_clients)
    sinon.assert.calledOnce(queryCallback)
    queryCallback.reset()
  })

  /**
  * Subscribes
  */
  When(/^the client subscribes to all presence events$/, (callback) => {
    global.dsClient.presence.subscribe(subscribeCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client unsubscribes to all presence events$/, (callback) => {
    global.dsClient.presence.unsubscribe(subscribeCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client subscribes to presence events for "([^"]*)"$/, (usernames, callback) => {
    usernames.split(',').forEach(username =>
      global.dsClient.presence.subscribe(username, subscribeCallback)
    )
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client unsubscribes to presence events for "([^"]*)"$/, (usernames, callback) => {
    usernames.split(',').forEach(username =>
      global.dsClient.presence.unsubscribe(username, subscribeCallback)
    )
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client is notified that client "(\w*)" logged in$/, (username) => {
    try {
      sinon.assert.calledWith(subscribeCallback, true, username)
    } catch (e) {
      sinon.assert.calledWith(subscribeCallback, username, true)
    }
    sinon.assert.calledOnce(subscribeCallback)
    subscribeCallback.reset()
  })

  When(/^the client is notified that client "(\w*)" logged out$/, (username) => {
    try {
      sinon.assert.calledWith(subscribeCallback, false, username)
    } catch (e) {
      sinon.assert.calledWith(subscribeCallback, username, false)
    }
    sinon.assert.calledOnce(subscribeCallback)
    subscribeCallback.reset()
  })

  When(/^the client is not notified that client "(\w*)" logged in$/, (username) => {
    sinon.assert.notCalled(subscribeCallback)
  })

