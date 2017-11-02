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

let rpc
let rpcCallback
let rpcProvideCallback


  When(/^the client requests RPC "(\w*)" with data "(\w*)"$/, (rpcName, rpcData, callback) => {
    rpcCallback = sinon.spy()
    global.dsClient.rpc.make(rpcName, rpcData, rpcCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client provides a RPC called "(\w*)"$/, (rpcName, callback) => {
    rpcProvideCallback = sinon.spy()
    global.dsClient.rpc.provide(rpcName, rpcProvideCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client stops providing a RPC called "(\w*)"$/, (rpcName, callback) => {
    global.dsClient.rpc.unprovide(rpcName, rpcProvideCallback)
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client responds to the RPC "(\w*)" with data "(\w*)"$/, (rpcName, rpcData, callback) => {
    rpc.send('ABC')
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client responds to the RPC "(\w*)" with the error "([^"]*)"$/, (rpcName, errorMessage, callback) => {
    rpc.error(errorMessage)
    setTimeout(callback, config.messageWaitTime)
  })

  When(/^the client rejects the RPC "(\w*)"$/, (rpcName, callback) => {
    rpc.reject()
    setTimeout(callback, config.messageWaitTime)
  })

  Then(/^the client recieves a request for a RPC called "(\w*)" with data "(\w*)"$/, (rpcName, rpcData) => {
    rpc = rpcProvideCallback.getCall(0).args[1]
    sinon.assert.calledOnce(rpcProvideCallback)
    sinon.assert.calledWith(rpcProvideCallback, rpcData)
    rpcProvideCallback.reset()
  })

  Then(/^the client recieves a successful RPC callback for "(\w*)" with data "(\w*)"$/, (rpcName, rpcData) => {
    sinon.assert.calledOnce(rpcCallback)
    sinon.assert.calledWith(rpcCallback, null, rpcData)
  })

  Then(/^the client recieves an error RPC callback for "(\w*)" with the message "([^"]*)"$/, (rpcName, errorMessage) => {
    sinon.assert.calledOnce(rpcCallback)
    sinon.assert.calledWith(rpcCallback, errorMessage)
  })

