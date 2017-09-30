'use strict'

const http = require('http')
const ws = require('uws')
const config = require('../config')
const EventEmitter = require('events').EventEmitter

function WSServer(port) {
  this.server
  this.isReady = false
  this.lastSocket
  this.connections = []

  this.allMessages = []
  this.lastMessage = null
  this.emitter = new EventEmitter()

  this.port = port || config.testServerPort
}

WSServer.prototype.start = function () {
  if (this.server) {
    this.stop(this.start.bind(this))
  } else {
    this.start()
  }
}

WSServer.prototype.send = function (message) {
  this.lastSocket.send(message)
}

WSServer.prototype.whenReady = function (callback) {
  this.allMessages = []

  if (!this.server) {
    this.start()
  }

  if (this.isReady) {
    callback()
  } else {
    this.emitter.once('ready', callback)
  }
}

WSServer.prototype.start = function () {
  this.server = new ws.Server({
    server: this.httpServer,
    perMessageDeflate: false,
    path: '/deepstream',
    port: this.port
  }, this.onListening.bind(this))
  this.server.on('connection', this.bindSocket.bind(this))
}

WSServer.prototype.stop = function (callback) {
  this.isReady = false

  this.allMessages = []
  this.lastMessage = null

  this.connections.forEach((connection) => {
    connection.close()
  })

  this.server.close()
  this.server = null
  setTimeout(callback, 3000)
}

WSServer.prototype.bindSocket = function (socket) {
  this.lastSocket = socket
  socket.on('message', this.onIncomingMessage.bind(this))
  socket.on('close', this.onDisconnect.bind(this, socket))
  this.connections.push(socket)
}

WSServer.prototype.onDisconnect = function (socket) {
  this.connections.splice(this.connections.indexOf(socket), 1)
}

WSServer.prototype.onIncomingMessage = function (message) {
  const messages = message.split(String.fromCharCode(30))
  if (!messages[messages.length - 1]) {
    messages.splice(messages.length - 1, 1)
  }
  for (let i = 0; i < messages.length; i++) {
    this.allMessages.push(messages[i] + String.fromCharCode(30))
  }
  this.lastMessage = messages[messages.length - 1] + String.fromCharCode(30)
}

WSServer.prototype.onListening = function () {
  this.isReady = true
  this.emitter.emit('ready')
}

module.exports = WSServer
