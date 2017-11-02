'use strict'

const cucumber = require('cucumber')
const Before = cucumber.Before
const After = cucumber.After
const Given = cucumber.Given
const When = cucumber.When
const Then = cucumber.Then

const config = require('../config')
const check = require('../helper').check

const WSServer = require('./ws-server')
const firstServer = new WSServer(config.firstTestServerPort)
const secondaryServer = new WSServer(config.secondaryTestServerPort)

let server = firstServer
let uid

const matchMessage = function (actualMessage, expectedMessage) {
  const expectedMessageCopy = expectedMessage
  if (server.allMessages.length === 0) {
    return 'Server did not recieve any messages'
  } else if (expectedMessage.indexOf('<UID>') === -1 && expectedMessage.indexOf('<FIRST_SERVER_URL>') === -1) {
    return check('last received message', expectedMessage, convertChars(actualMessage))
  }
  expectedMessage = expectedMessage.replace(/\|/g, '\\|')
  expectedMessage = expectedMessage.replace('+', '\\+')
  expectedMessage = expectedMessage.replace('<UID>', '([^\\|]*)')
  expectedMessage = expectedMessage.replace('<FIRST_SERVER_URL>', `ws://localhost:${config.testServerPort}/deepstream`)

  const match = convertChars(actualMessage).match(new RegExp(expectedMessage))
  if (match) {
    uid = match[1]
    return
  }
  return `${convertChars(actualMessage)} did not match ${expectedMessage}`


}

var convertChars = function (input) {
  return input
    .replace(new RegExp(String.fromCharCode(31), 'g'), '|')
    .replace(new RegExp(String.fromCharCode(30), 'g'), '+')
}


  Given(/the test server is ready/, (callback) => {
    server = firstServer
    server.whenReady(callback)
  })

  Given(/the second test server is ready/, (callback) => {
    secondaryServer.whenReady(callback)
  })

  Given(/the client is on the second server/, () => {
    server = secondaryServer
  })

  Given(/^the server resets its message count$/, (callback) => {
    server.lastMessage = null
    server.allMessages = []
    callback()
  })

  When(/^the server sends the message (.*)$/, (message, callback) => {
    if (message.indexOf('<UID>') !== -1 && uid) {
      message = message.replace('<UID>', uid)
    }

    if (message.indexOf('<SECOND_SERVER_URL>') !== -1) {
      message = message.replace('<SECOND_SERVER_URL>', `ws://localhost:${config.secondaryTestServerPort}/deepstream`)
    }

    message = message.replace(/\|/g, String.fromCharCode(31))
    message = message.replace(/\+/g, String.fromCharCode(30))

    server.send(message)
    setTimeout(callback, config

.messageWaitTime * 2)
  })

  When(/^the connection to the server is lost$/, (callback) => {
    server.stop(callback)
  })

  When(/^the connection to the server is reestablished$/, (callback) => {
    function hasAClient() {
      setTimeout(() => {
        if (server.connections.length > 0) {
          callback()
        } else {
          hasAClient()
        }
      }, 250)
    }
    server.whenReady(hasAClient, 100)
  })

  Then(/^no message was send to the server$/, (callback) => {
    check('last received message', null, convertChars(server.lastMessage), callback)
  })

  Then(/^the server has (\d*) active connections$/, (connectionCount, callback) => {
    check('active connections', Number(connectionCount), server.connections.length, callback)
  })

  Then(/^the second server has (\d*) active connections$/, (connectionCount, callback) => {
    check('active connections', Number(connectionCount), secondaryServer.connections.length, callback)
  })

  Then(/^the last message the server recieved is (.*)$/, (message, callback) => {
    callback(matchMessage(server.lastMessage, message))
  })

  Then(/^the server received the message (.*)$/, (message, callback) => {
    let matchFound = false
    for (let i = 0; i < server.allMessages.length && !matchFound; i++) {
      matchFound = !matchMessage(server.allMessages[i], message)
    }
    callback(!matchFound && (`No match for message ${message} found. Current messages: ${server.allMessages}`))
  })

  Then(/^the server didn't receive the message (.*)$/, (message, callback) => {
    let matchFound = false
    for (let i = 0; i < server.allMessages.length && !matchFound; i++) {
      matchFound = matchMessage(server.allMessages[i], message)
    }
    callback(!matchFound && (`Match for message ${message} found. Current messages: ${server.allMessages}`))
  })

  Then(/^the server has received (\d*) messages$/, (numberOfMessages, callback) => {
    check('number of received messages', Number(numberOfMessages), server.allMessages.length, callback)
  })

  Then(/^the server did not recieve any messages$/, (callback) => {
    check('number of received messages', 0, server.allMessages.length, callback)
  })


