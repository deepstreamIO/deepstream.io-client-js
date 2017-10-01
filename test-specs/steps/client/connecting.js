'use strict'

const cucumber = require('cucumber')
const Before = cucumber.Before
const After = cucumber.After
const Given = cucumber.Given
const When = cucumber.When
const Then = cucumber.Then

const deepstream = require('../../../src/client')
const config = require('../config')
const check = require('../helper').check
let lastAuthArgs

let errors
let catchError


Before((scenario) => {
  errors = []
  catchError = false
})

After((scenario) => {
  if (!catchError && errors.length > 0) {
    throw `Unexpected error occured during scenario. Errors: ${JSON.stringify(errors)}`
  }
})

Given(/^the client is initialised$/, (callback) => {
  if (global.dsClient) {
    global.dsClient.close()
    global.dsClient.removeListener('error')
  }
  global.dsClient = deepstream(`${config.testServerHost}:${config.testServerPort}`, {
    subscriptionTimeout: 100,
    recordReadAckTimeout: 200,
    recordReadTimeout: 400,
    recordDeleteTimeout: 100,
    rpcResponseTimeout: 200
  })
  global.dsClient.on('error', function () {
    errors.push(arguments)
  })
  setTimeout(callback, config.messageWaitTime)
})

Given(/^the client is initialised with a small heartbeat interval$/, (callback) => {
  if (global.dsClient) {
    global.dsClient.close()
    global.dsClient.removeListener('error')
  }
  global.dsClient = deepstream(`${config.testServerHost}:${config.testServerPort}`, {
    subscriptionTimeout: 100,
    recordReadAckTimeout: 200,
    recordReadTimeout: 260,
    recordDeleteTimeout: 100,
    rpcResponseTimeout: 200,
    heartbeatInterval: 500
  })
  global.dsClient.on('error', function () {
    errors.push(arguments)
  })
  setTimeout(callback, config.messageWaitTime)
})

When(/^some time passes$/, (callback) => {
  setTimeout(callback, 200)
})

When(/^two seconds later$/, (callback) => {
  setTimeout(callback, 2000)
})

When(/^the client logs in with username "(\w*)" and password "(\w*)"$/, (username, password, callback) => {
  global.dsClient.login({ username, password }, function () {
    lastAuthArgs = arguments
  })
  setTimeout(callback, config

.messageWaitTime)
})

Then(/^the last login was successful$/, (callback) => {
  check('last login result', true, lastAuthArgs[0], callback)
})

Then(/^the clients connection state is "(\w*)"$/, (connectionState, callback) => {
  check('connectionState', connectionState, global.dsClient.getConnectionState(), callback)
})

Then(/^the client throws a "(\w*)" error with message "(.*)"$/, (error, errorMessage, callback) => {
  catchError = true
  const lastErrorArgs = errors[errors.length - 1]

  if (errors.length === 0) {
    callback('No errors were thrown')
    return
  }

  error = check('last error', error, lastErrorArgs[1])
  errorMessage = check('last error message', errorMessage, lastErrorArgs[0])
  if (error || errorMessage) {
    callback(`${error} ${errorMessage}`)
    return
  }

  callback()
})

Then(/^the last login failed with error message "(.*)"$/, (errorMessage, callback) => {
  catchError = true
  // check( 'last auth error', error, lastAuthArgs[ 1 ], callback, true );
  check('last auth error message', errorMessage, lastAuthArgs[1], callback)
})
