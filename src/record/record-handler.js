const Record = require('./record')
const Listener = require('../utils/listener')
const C = require('../constants/constants')
const Rx = require('rxjs')
const utils = require('../utils/utils')

const RecordHandler = function (options, connection, client) {
  this._options = options
  this._connection = connection
  this._client = client
  this._records = new Map()
  this._listeners = new Map()
  this._gc = []

  this._prune = this._prune.bind(this)
  this._prune()
}

RecordHandler.prototype._prune = function () {
  utils.requestIdleCallback(deadline => {
    for (let n = 0; n < this._gc.length; ++n) {
      const record = this._gc[n]

      if (record.usages === 0) {
        this._records.delete(record.name)
        this._gc[n] = this._gc[this._gc.length - 1]
        this._gc.pop()
        record._$destroy()
      }
    }

    setTimeout(this._prune, 10000)
  })
}

RecordHandler.prototype.getRecord = function (recordName) {
  let record = this._records.get(recordName)

  if (!record) {
    record = new Record(recordName, this._connection, this._client)
    this._records.set(recordName, record)
    this._gc.push(record)
  }

  record.usages += 1

  return record
}

RecordHandler.prototype.listen = function (pattern, callback) {
  if (typeof pattern !== 'string' || pattern.length === 0) {
    throw new Error('invalid argument pattern')
  }
  if (typeof callback !== 'function') {
    throw new Error('invalid argument callback')
  }

  const listener = this._listeners.get(pattern)

  if (listener && !listener.destroyPending) {
    return this._client._$onError(C.TOPIC.RECORD, C.EVENT.LISTENER_EXISTS, pattern)
  }

  if (listener) {
    listener.destroy()
  }

  this._listeners.set(pattern, new Listener(C.TOPIC.RECORD, pattern, callback, this._options, this._client, this._connection))
}

RecordHandler.prototype.unlisten = function (pattern) {
  if (typeof pattern !== 'string' || pattern.length === 0) {
    throw new Error('invalid argument pattern')
  }

  const listener = this._listeners.get(pattern)
  if (listener && !listener.destroyPending) {
    listener.sendDestroy()
  } else if (listener) {
    listener.destroy()
    this._listeners.delete(pattern)
  } else {
    this._client._$onError(C.TOPIC.RECORD, C.EVENT.NOT_LISTENING, pattern)
  }
}

RecordHandler.prototype.get = function (recordName, pathOrNil) {
  const record = this.getRecord(recordName)
  return record
    .whenReady()
    .then(() => record.get(pathOrNil))
    .then(val => {
      record.discard()
      return val
    })
    .catch(err => {
      record.discard()
      throw err
    })
}

RecordHandler.prototype.set = function (recordName, pathOrData, dataOrNil) {
  const record = this.getRecord(recordName)
  const promise = arguments.length === 2
    ? record.set(pathOrData)
    : record.set(pathOrData, dataOrNil)
  record.discard()

  return promise
}

RecordHandler.prototype.update = function (recordName, pathOrUpdater, updaterOrNil) {
  const path = arguments.length === 2 ? undefined : pathOrUpdater
  const updater = arguments.length === 2 ? pathOrUpdater : updaterOrNil

  const record = this.getRecord(recordName)
  return record
    .whenReady()
    .then(() => updater(record.get(path)))
    .then(val => {
      if (path) {
        record.set(path, val)
      } else {
        record.set(val)
      }
      record.discard()
      return val
    })
    .catch(err => {
      record.discard()
      throw err
    })
}

RecordHandler.prototype.observe = function (recordName) {
  return Rx.Observable
    .create(o => {
      try {
        const record = this.getRecord(recordName)
        const onValue = value => o.next(value)
        const onError = error => o.error(error)
        const onDestroy = () => o.complete()
        record.subscribe(onValue, true)
        record.on('error', onError)
        record.on('destroy', onDestroy)
        return () => {
          record.unsubscribe(onValue)
          record.off('error', onError)
          record.off('destroy', onDestroy)
          record.discard()
        }
      } catch (err) {
        o.next(err)
      }
    })
}

RecordHandler.prototype._$handle = function (message) {
  if (message.action === C.ACTIONS.ERROR && message.data[0] !== C.EVENT.MESSAGE_DENIED) {
    message.processedError = true
    this._client._$onError(C.TOPIC.RECORD, message.data[0], message.data[1])
    return
  }

  let recordName
  if (message.action === C.ACTIONS.ACK || message.action === C.ACTIONS.ERROR) {
    recordName = message.data[1]
  } else {
    recordName = message.data[0]
  }

  const record = this._records.get(recordName)
  if (record) {
    record._$onMessage(message)
  }

  const listener = this._listeners.get(recordName)
  if (listener) {
    if (message.action === C.ACTIONS.ACK && message.data[0] === C.ACTIONS.UNLISTEN && listener.destroyPending) {
      listener.destroy()
      this._listeners.delete(recordName)
    } else {
      listener._$onMessage(message)
    }
  }
}

module.exports = RecordHandler
