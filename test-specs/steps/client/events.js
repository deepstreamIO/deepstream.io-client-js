'use strict'

const sinon = require('sinon')
const config = require('../config')
const check = require('../helper').check
let lastEventName
let lastEventData
const listenCallback = sinon.spy()

module.exports = function () {
  this.When(/^the client publishes an event named "(\w*)" with data "(\w*)"$/, (eventName, eventData, callback) => {
    global.dsClient.event.emit(eventName, eventData)
    setTimeout(callback, config.messageWaitTime)
  })

  this.Then(/^the client received the event "(\w*)" with data "(\w*)"$/, (eventName, eventData, callback) => {
    check('last event name', eventName, lastEventName, callback, true)
    check('last event data', eventData, lastEventData, callback)
  })

  /**
  * Subscribes
  */
  this.When(/^the client subscribes to an event named "(\w*)"$/, (eventName, callback) => {
    global.dsClient.event.subscribe(eventName, (data) => {
      lastEventName = eventName
      lastEventData = data
    })
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client unsubscribes from an event named "(\w*)"$/, (eventName, callback) => {
    global.dsClient.event.unsubscribe(eventName)
    setTimeout(callback, config.messageWaitTime)
  })

  /**
  * Listen
  */
  this.When(/^the client listens to events matching "([^"]*)"$/, (pattern, callback) => {
    global.dsClient.event.listen(pattern, listenCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.Then(/^the client will be notified of new event match "([^"]*)"$/, (eventName) => {
    sinon.assert.calledWith(listenCallback, eventName, true)
  })

  this.Then(/^the client will be notified of event match removal "([^"]*)"$/, (eventName) => {
    sinon.assert.calledWith(listenCallback, eventName, false)
  })

  this.When(/^the client unlistens to events matching "([^"]*)"$/, (pattern, callback) => {
    global.dsClient.event.unlisten(pattern, listenCallback)
    setTimeout(callback, config.messageWaitTime)
  })
}
