const jsonPath = require('./json-path')
const utils = require('../utils/utils')
const ResubscribeNotifier = require('../utils/resubscribe-notifier')
const EventEmitter = require('component-emitter')
const C = require('../constants/constants')
const messageParser = require('../message/message-parser')

const Record = function (name, recordOptions, connection, options, client) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new Error('invalid argument name')
  }

  this.name = name
  this.isDestroyed = false
  this.isDestroying = false
  this.hasProvider = false
  this.version = null

  this._recordOptions = recordOptions
  this._connection = connection
  this._client = client
  this._options = options
  this._eventEmitter = new EventEmitter()

  this._resubscribeNotifier = new ResubscribeNotifier(this._client, this._sendRead.bind(this))
  this._reset()
  this._sendRead()
}

EventEmitter(Record.prototype)

Record.prototype.get = function (path) {
  return jsonPath.get(this._data, path)
}

Record.prototype.set = function (pathOrData, data) {
  if (arguments.length === 1 && typeof pathOrData !== 'object') {
    throw new Error('invalid argument data')
  }
  if (arguments.length === 2 && (typeof pathOrData !== 'string' || pathOrData.length === 0)) {
    throw new Error('invalid argument path')
  }

  if (this._checkDestroyed('set')) {
    return this
  }

  const path = arguments.length === 1 ? undefined : pathOrData
  data = path ? data : pathOrData

  if (path && this._patchQueue) {
    this._patchQueue.push({ path, data })
  } else {
    this._patchQueue = undefined
  }

  const oldValue = this._data
  const newValue = jsonPath.set(oldValue, path, data)

  if (oldValue === newValue) {
    return this
  }

  this._applyChange(newValue)

  if (this.isReady) {
    this._dispatchUpdate()
  }

  return this
}

Record.prototype.subscribe = function (path, callback, triggerNow) {
  const args = this._normalizeArguments(arguments)

  if (args.path !== undefined && (typeof args.path !== 'string' || args.path.length === 0)) {
    throw new Error('invalid argument path')
  }
  if (typeof args.callback !== 'function') {
    throw new Error('invalid argument callback')
  }

  if (this._checkDestroyed('subscribe')) {
    return
  }

  this._eventEmitter.on(args.path, args.callback)

  if (args.triggerNow && this._data) {
    args.callback(this.get(args.path))
  }
}

Record.prototype.unsubscribe = function (pathOrCallback, callback) {
  const args = this._normalizeArguments(arguments)

  if (args.path !== undefined && (typeof args.path !== 'string' || args.path.length === 0)) {
    throw new Error('invalid argument path')
  }
  if (args.callback !== undefined && typeof args.callback !== 'function') {
    throw new Error('invalid argument callback')
  }

  if (this._checkDestroyed('unsubscribe')) {
    return
  }

  this._eventEmitter.off(args.path, args.callback)
}

Record.prototype.whenReady = function () {
  return new Promise((resolve) => {
    if (this.isReady) {
      resolve(this)
    } else {
      this.once('ready', () => resolve(this))
    }
  })
}

Record.prototype.discard = function () {
  if (this._checkDestroyed('discard')) {
    return
  }
  this.usages--
  this
    .whenReady()
    .then(() => {
      if (this.usages === 0 && !this.isDestroying) {
        this.isDestroying = true
        this._reset()
        this._discardTimeout = setTimeout(this._onTimeout.bind(this, C.EVENT.ACK_TIMEOUT), this._options.subscriptionTimeout)
        this._connection.sendMsg(C.TOPIC.RECORD, C.ACTIONS.UNSUBSCRIBE, [this.name])
      }
    })
}

Record.prototype._$onMessage = function (message) {
  if (message.action === C.ACTIONS.READ) {
    if (this._readTimeout) {
      clearTimeout(this._readTimeout)
      this._readTimeout = undefined
    }

    if (!this.isReady) {
      this._onRead(message)
    } else {
      this._applyUpdate(message)
    }
  } else if (message.action === C.ACTIONS.ACK) {
    this._processAckMessage(message)
  } else if (message.action === C.ACTIONS.UPDATE) {
    this._applyUpdate(message)
  } else if (message.data[0] === C.EVENT.MESSAGE_DENIED) {
    this._clearTimeouts()
  } else if (message.action === C.ACTIONS.SUBSCRIPTION_HAS_PROVIDER) {
    var hasProvider = messageParser.convertTyped(message.data[1], this._client)
    this.hasProvider = hasProvider
    this.emit('hasProviderChanged', hasProvider)
  }
}

Record.prototype._reset = function () {
  this._data = undefined
  this._patchQueue = []
  this.usages = 0
  this.isReady = false
}

Record.prototype._processAckMessage = function (message) {
  const acknowledgedAction = message.data[0]

  if (acknowledgedAction === C.ACTIONS.SUBSCRIBE) {
    clearTimeout(this._readAckTimeout)
  } else if (acknowledgedAction === C.ACTIONS.UNSUBSCRIBE) {
    this.emit('discard')
    this._destroy()
  }
}

Record.prototype._dispatchUpdate = function () {
  const start = this.version ? parseInt(this.version.split('-')[0], 10) : 0
  const version = `${start + 1}-${utils.getShortId()}`
  this._connection.sendMsg(C.TOPIC.RECORD, C.ACTIONS.UPDATE, [
    this.name,
    version,
    this._data,
    this.version
  ])
  this.version = version
}

Record.prototype._applyUpdate = function (message) {
  const version = message.data[1]

  if (utils.compareVersions(this.version, version)) {
    return
  }

  this.version = version
  this._applyChange(jsonPath.set(this._data, undefined, JSON.parse(message.data[2])))
}

Record.prototype._onRead = function (message) {
  const oldValue = JSON.parse(message.data[2])
  let newValue = this._data || oldValue

  if (this._patchQueue) {
    for (let i = 0; i < this._patchQueue.length; i++) {
      newValue = jsonPath.set(newValue, this._patchQueue[i].path, this._patchQueue[i].data)
    }
    this._patchQueue = undefined
  }

  this.isReady = true
  this.version = message.data[1]
  this._applyChange(newValue)

  if (newValue !== oldValue) {
    this._dispatchUpdate()
  }

  this.emit('ready')
}

Record.prototype._sendRead = function () {
  this._readAckTimeout = setTimeout(this._onTimeout.bind(this, C.EVENT.ACK_TIMEOUT), this._options.recordReadAckTimeout)
  this._readTimeout = setTimeout(this._onTimeout.bind(this, C.EVENT.RESPONSE_TIMEOUT), this._options.recordReadTimeout)
  this._connection.sendMsg(C.TOPIC.RECORD, C.ACTIONS.READ, [this.name])
}

Record.prototype._applyChange = function (newData) {
  if (this.isDestroyed) {
    return
  }

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
      this._eventEmitter.emit(paths[i], this.get(paths[i]))
    }
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

Record.prototype._clearTimeouts = function () {
  clearTimeout(this._readAckTimeout)
  clearTimeout(this._discardTimeout)
}

Record.prototype._checkDestroyed = function (methodName) {
  if (this.isDestroyed) {
    this.emit('error', 'Can\'t invoke \'' + methodName + '\'. Record \'' + this.name + '\' is already destroyed')
    return true
  }

  return false
}

Record.prototype._onTimeout = function (timeoutType) {
  this._clearTimeouts()
  this.emit('error', timeoutType)
}

Record.prototype._destroy = function () {
  this.isDestroying = false
  this._clearTimeouts()
  if (this.usages > 0) {
    this._sendRead()
  } else {
    this._eventEmitter.off()
    this._resubscribeNotifier.destroy()
    this.isDestroyed = true
    this._client = null
    this._eventEmitter = null
    this._connection = null
    this.emit('destroy')
  }
}

module.exports = Record
