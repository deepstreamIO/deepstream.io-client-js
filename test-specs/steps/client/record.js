'use strict'

const sinon = require('sinon')
const config = require('../config')
const check = require('../helper').check

const records = {}
const subscribeCallback = sinon.spy()
const listenCallback = sinon.spy()
const snapshotCallback = sinon.spy()
const hasCallback = sinon.spy()

module.exports = function () {

  this.When(/^the client creates a record named "([^"]*)"$/, (recordName, callback) => {
    records[recordName] = global.dsClient.record.getRecord(recordName)
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client sets the record "([^"]*)" "([^"]*)" to "(.+)"$/, (recordName, path, value, callback) => {
    if (records[recordName].setCallback) { records[recordName].set(path, value, records[recordName].setCallback) } else { records[recordName].set(path, value) }
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client sets the record "([^"]*)" to (.+)$/, (recordName, value, callback) => {
    if (records[recordName].setCallback) { records[recordName].set(JSON.parse(value), records[recordName].setCallback) } else { records[recordName].set(JSON.parse(value)) }
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client requires write acknowledgement on record "([^"]*)"$/, (recordName) => {
    records[recordName].setCallback = sinon.spy()
  })

  this.When(/^the client is notified that the record "([^"]*)" was written without error$/, (recordName) => {
    sinon.assert.calledWith(records[recordName].setCallback, null)
    sinon.assert.calledOnce(records[recordName].setCallback)
    records[recordName].setCallback.reset()
  })

  this.When(/^the client is notified that the record "([^"]*)" was written with error "([^"]*)"$/, (recordName, errorMessage) => {
    sinon.assert.calledWith(records[recordName].setCallback, errorMessage)
    sinon.assert.calledOnce(records[recordName].setCallback)
    records[recordName].setCallback.reset()
  })

  this.Then(/^the client record "([^"]*)" data is (.*)$/, (recordName, data, callback) => {
    check('record data', records[recordName].get(), JSON.parse(data), callback)
  })

  this.When(/^the client discards the record named "([^"]*)"$/, (recordName, callback) => {
    records[recordName].discard()
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client deletes the record named "([^"]*)"$/, (recordName, callback) => {
    records[recordName].delete()
    setTimeout(callback, config.messageWaitTime)
  })

  /**
  * Listen
  */
  this.When(/^the client listens to a record matching "([^"]*)"$/, (pattern, callback) => {
    global.dsClient.record.listen(pattern, listenCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.Then(/^the client will be notified of new record match "([^"]*)"$/, (recordName) => {
    sinon.assert.calledWith(listenCallback, recordName, true)

  })

  this.Then(/^the client will be notified of record match removal "([^"]*)"$/, (recordName) => {
    sinon.assert.calledWith(listenCallback, recordName, false)
  })

  this.When(/^the client unlistens to a record matching "([^"]*)"$/, (pattern, callback) => {
    global.dsClient.record.unlisten(pattern, listenCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  /**
  * Subscribe
  */
  this.When(/^the client subscribes to "([^"]*)" for the record "([^"]*)"$/, (path, recordName, callback) => {
    records[recordName].subscribe(path, subscribeCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client unsubscribes to the entire record "([^"]*)" changes$/, (recordName, callback) => {
    records[recordName].unsubscribe(subscribeCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client unsubscribes to "([^"]*)" for the record "([^"]*)"$/, (path, recordName, callback) => {
    records[recordName].unsubscribe(path, subscribeCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.When(/^the client subscribes to the entire record "([^"]*)" changes$/, (recordName, callback) => {
    records[recordName].subscribe(subscribeCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.Then(/^the client will not be notified of the record change$/, () => {
    sinon.assert.notCalled(subscribeCallback)
  })

  this.Then(/^the client will be notified of the record change$/, () => {
    sinon.assert.calledOnce(subscribeCallback)
    // sinon.assert.calledWith( subscribeCallback, record.get() );
    subscribeCallback.reset()
  })

  this.Then(/^the client will be notified of the second record change$/, () => {
    sinon.assert.calledOnce(subscribeCallback)
    // sinon.assert.calledWith( subscribeCallback, 5 );
    subscribeCallback.reset()
  })

  this.Then(/^the client will be notified of the partial record change$/, () => {
    sinon.assert.calledOnce(subscribeCallback)
    // sinon.assert.calledWith( subscribeCallback, record.get() );
    subscribeCallback.reset()
  })

  /**
   * Snapshot
   */
  this.Given(/^the client requests a snapshot for the record "([^"]*)"$/, (recordName, callback) => {
    global.dsClient.record.snapshot(recordName, snapshotCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.Then(/^the client has no response for the snapshot of record "([^"]*)"$/, (recordName) => {
    sinon.assert.notCalled(snapshotCallback)
  })

  this.Then(/^the client is told the record "([^"]*)" encountered an error retrieving snapshot$/, (recordName) => {
    sinon.assert.calledWith(snapshotCallback, 'RECORD_NOT_FOUND')
    sinon.assert.calledOnce(snapshotCallback)
    snapshotCallback.reset()
  })

  this.Then(/^the client is provided the snapshot for record "([^"]*)" with data "(.*)"$/, (recordName, data) => {
    sinon.assert.calledWith(snapshotCallback, null, JSON.parse(data))
    sinon.assert.calledOnce(snapshotCallback)
    snapshotCallback.reset()
  })

  /**
   * Has
   */
  this.Given(/^the client checks if the server has the record "([^"]*)"$/, (recordName, callback) => {
    global.dsClient.record.has(recordName, hasCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  this.Then(/^the client is told the record "([^"]*)" exists$/, (recordName) => {
    sinon.assert.calledWith(hasCallback, null, true)
    sinon.assert.calledOnce(hasCallback)
    hasCallback.reset()
  })

  this.Then(/^the client is told the record "([^"]*)" doesn't exist$/, (recordName) => {
    sinon.assert.calledWith(hasCallback, null, false)
    sinon.assert.calledOnce(hasCallback)
    hasCallback.reset()
  })
}
