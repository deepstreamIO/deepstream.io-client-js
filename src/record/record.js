const jsonPath = require('./json-path')
const utils = require('../utils/utils')
const EventEmitter = require('component-emitter')
const C = require('../constants/constants')
const messageParser = require('../message/message-parser')
const xuid = require('xuid')
const invariant = require('invariant')
const lz = require('lz-string')

const Record = function (name, connection, client) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new Error('invalid argument name')
  }

  this.name = name
  this.usages = 0
  this.isDestroyed = false
  this.isSubscribed = false
  this.isReady = false
  this.hasProvider = false
  this.version = null

  this._connection = connection
  this._client = client
  this._eventEmitter = new EventEmitter()

  this._data = undefined
  this._patchQueue = []

  this._client.on('connectionStateChanged', () => this._handleConnectionStateChange())

  this._sendRead()
}

EventEmitter(Record.prototype)

Record.prototype.get = function (path) {
  invariant(this.usages !== 0, `"get" cannot use destroyed record ${this.name}`)

  return jsonPath.get(this._data, path)
}

Record.prototype.set = function (pathOrData, dataOrNil) {
  invariant(this.usages !== 0, `"set" cannot use destroyed record ${this.name}`)

  if (this.usages === 0) {
    return Promise.resolve()
  }

  const path = arguments.length === 1 ? undefined : pathOrData
  const data = arguments.length === 1 ? pathOrData : dataOrNil

  if (path === undefined && typeof data !== 'object') {
    throw new Error('invalid argument data')
  }
  if (path !== undefined && (typeof path !== 'string' || path.length === 0)) {
    throw new Error('invalid argument path')
  }

  if (path && this._patchQueue !== null) {
    this._patchQueue.push({ path, data })
  } else {
    this._patchQueue = null
  }

  const oldValue = this._data
  const newValue = jsonPath.set(oldValue, path, data)

  if (oldValue === newValue) {
    return Promise.resolve()
  }

  this._applyChange(newValue)

  if (this.isReady) {
    this._sendUpdate()
  }

  return Promise.resolve()
}

Record.prototype.subscribe = function (path, callback, triggerNow) {
  invariant(this.usages !== 0, `"subscribe" cannot use destroyed record ${this.name}`)

  if (this.usages === 0) {
    return
  }

  const args = this._normalizeArguments(arguments)

  if (args.path !== undefined && (typeof args.path !== 'string' || args.path.length === 0)) {
    throw new Error('invalid argument path')
  }
  if (typeof args.callback !== 'function') {
    throw new Error('invalid argument callback')
  }

  this._eventEmitter.on(args.path, args.callback)

  if (args.triggerNow && this._data) {
    args.callback(jsonPath.get(this._data, args.path))
  }
}

Record.prototype.unsubscribe = function (pathOrCallback, callback) {
  invariant(this.usages !== 0, `"unsubscribe" cannot use destroyed record ${this.name}`)

  if (this.usages === 0) {
    return
  }

  const args = this._normalizeArguments(arguments)

  if (args.path !== undefined && (typeof args.path !== 'string' || args.path.length === 0)) {
    throw new Error('invalid argument path')
  }
  if (args.callback !== undefined && typeof args.callback !== 'function') {
    throw new Error('invalid argument callback')
  }

  this._eventEmitter.off(args.path, args.callback)
}

Record.prototype.whenReady = function () {
  invariant(this.usages !== 0, `"whenReady" cannot use destroyed record ${this.name}`)

  if (this.usages === 0) {
    return Promise.reject(new Error('destroyed'))
  }

  this.usages += 1

  return new Promise((resolve, reject) => {
    if (this.isReady) {
      resolve()
    } else {
      this.once('ready', resolve)
    }
  }).then(() => {
    this.usages -= 1
  })
}

Record.prototype.discard = function () {
  invariant(this.usages !== 0, `"discard" cannot use destroyed record ${this.name}`)

  if (this.usages > 0) {
    this.usages -= 1
  }
}

Record.prototype._$destroy = function () {
  if (this.isSubscribed) {
    this._connection.sendMsg(C.TOPIC.RECORD, C.ACTIONS.UNSUBSCRIBE, [this.name])
    this.isSubscribed = false
  }

  this.usages = 0
  this.isDestroyed = true
  this._data = undefined
  this._patchQueue = []
  this._client.off('connectionStateChanged', this._handleConnectionStateChange)
  this._eventEmitter.off()

  this.off()
}

Record.prototype._$onMessage = function (message) {
  invariant(!this.isDestroyed, `"_$onMessage" cannot use destroyed record ${this.name}`)

  if (this.isDestroyed) {
    return
  }

  if (message.action === C.ACTIONS.UPDATE) {
    if (!this.isReady) {
      this._onRead(message)
    } else {
      this._onUpdate(message)
    }
    return
  }

  if (message.action === C.ACTIONS.SUBSCRIPTION_HAS_PROVIDER) {
    var hasProvider = messageParser.convertTyped(message.data[1], this._client)
    this.hasProvider = hasProvider
    this.emit('hasProviderChanged', hasProvider)
    return
  }
}

Record.prototype._sendRead = function () {
  if (this.isSubscribed) {
    return
  }
  this._connection.sendMsg(C.TOPIC.RECORD, C.ACTIONS.READ, [this.name])
  this.isSubscribed = true
}

Record.prototype._sendUpdate = function () {
  const start = this.version ? parseInt(this.version.split('-')[0]) : 0
  const version = `${start + 1}-${xuid()}`
  this._connection.sendMsg(C.TOPIC.RECORD, C.ACTIONS.UPDATE, [
    this.name,
    version,
    lz.compressToUTF16(JSON.stringify(this._data)),
    this.version
  ])
  this.version = version
}

Record.prototype._onUpdate = function (message) {
  const version = message.data[1]

  if (utils.compareVersions(this.version, version)) {
    return
  }

  this.version = version
  this._applyChange(jsonPath.set(this._data, undefined, JSON.parse(lz.decompressFromUTF16(message.data[2]))))
}

Record.prototype._onRead = function (message) {
  let oldValue = JSON.parse(lz.decompressFromUTF16(message.data[2]))
  let newValue = this._data || oldValue

  if (this._patchQueue) {
    newValue = oldValue
    for (let i = 0; i < this._patchQueue.length; i++) {
      newValue = jsonPath.set(newValue, this._patchQueue[i].path, this._patchQueue[i].data)
    }
    this._patchQueue = null
  }

  this.isReady = true
  this.version = message.data[1]
  this._applyChange(newValue)

  if (newValue !== oldValue) {
    this._sendUpdate()
  }

  this.emit('ready')
}

Record.prototype._applyChange = function (newData) {
  const oldData = this._data
  this._data = newData

  if (!this._eventEmitter._callbacks) {
    return
  }

  const paths = Object.keys(this._eventEmitter._callbacks)

  for (let i = 0; i < paths.length; i++) {
    const newValue = jsonPath.get(newData, paths[i])
    const oldValue = jsonPath.get(oldData, paths[i])

    if (newValue !== oldValue) {
      this._eventEmitter.emit(paths[i], newValue)
    }
  }
}

Record.prototype._handleConnectionStateChange = function (init) {
  const state = this._client.getConnectionState()

  if (state === C.CONNECTION_STATE.OPEN) {
    this._sendRead()
  } else if (state === C.CONNECTION_STATE.RECONNECTING) {
    this.isSubscribed = false
  }
}

Record.prototype._normalizeArguments = function (args) {
  const result = Object.create(null)

  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'string') {
      result.path = args[i]
    } else if (typeof args[i] === 'function') {
      result.callback = args[i]
    } else if (typeof args[i] === 'boolean') {
      result.triggerNow = args[i]
    }
  }

  return result
}

module.exports = Record
