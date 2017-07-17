'use strict'

const Record = require('./record')
const AnonymousRecord = require('./anonymous-record')
const List = require('./list')
const Listener = require('../utils/listener')
const SingleNotifier = require('../utils/single-notifier')
const C = require('../constants/constants')
const messageParser = require('../message/message-parser')
const messageBuilder = require('../message/message-builder')
const EventEmitter = require('component-emitter2')

/**
 * A collection of factories for records. This class
 * is exposed as client.record
 *
 * @param {Object} options    deepstream options
 * @param {Connection} connection
 * @param {Client} client
 */
const RecordHandler = function (options, connection, client) {
  this._options = options
  this._connection = connection
  this._client = client
  this._records = {}
  this._lists = {}
  this._listener = {}
  this._writeCallbacks = {}
  this._destroyEventEmitter = new EventEmitter()

  this._hasRegistry = new SingleNotifier(
    client,
    connection,
    C.TOPIC.RECORD,
    C.ACTIONS.HAS,
    this._options.recordReadTimeout
  )
  this._snapshotRegistry = new SingleNotifier(
    client,
    connection,
    C.TOPIC.RECORD,
    C.ACTIONS.SNAPSHOT,
    this._options.recordReadTimeout
  )
}

/**
 * Returns an existing record or creates a new one.
 *
 * @param   {String} name              the unique name of the record
 * @param   {[Object]} recordOptions   A map of parameters for this particular record.
 *                                      { persist: true }
 *
 * @public
 * @returns {Record}
 */
RecordHandler.prototype.getRecord = function (name, recordOptions) {
  if (!this._records[name]) {
    this._records[name] = new Record(
      name,
      recordOptions || {},
      this._connection,
      this._options,
      this._client
    )
    this._records[name].on('error', this._onRecordError.bind(this, name))
    this._records[name].on('destroyPending', this._onDestroyPending.bind(this, name))
    this._records[name].on('delete', this._removeRecord.bind(this, name))
    this._records[name].on('discard', this._removeRecord.bind(this, name))
  }

  this._records[name].usages++

  return this._records[name]
}

/**
 * Returns an existing List or creates a new one. A list is a specialised
 * type of record that holds an array of recordNames.
 *
 * @param   {String} name       the unique name of the list
 * @param   {[Object]} options   A map of parameters for this particular list.
 *                              { persist: true }
 *
 * @public
 * @returns {List}
 */
RecordHandler.prototype.getList = function (name, options) {
  if (!this._lists[name]) {
    this._lists[name] = new List(this, name, options)
  } else {
    this._records[name].usages++
  }
  return this._lists[name]
}

/**
 * Returns an anonymous record. A anonymous record is effectively
 * a wrapper that mimicks the API of a record, but allows for the
 * underlying record to be swapped without loosing subscriptions etc.
 *
 * This is particularly useful when selecting from a number of similarly
 * structured records. E.g. a list of users that can be choosen from a list
 *
 * The only API difference to a normal record is an additional setName( name ) method.
 *
 *
 * @public
 * @returns {AnonymousRecord}
 */
RecordHandler.prototype.getAnonymousRecord = function () {
  return new AnonymousRecord(this)
}

/**
 * Allows to listen for record subscriptions made by this or other clients. This
 * is useful to create "active" data providers, e.g. providers that only provide
 * data for a particular record if a user is actually interested in it
 *
 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
 * @param   {Function} callback
 *
 * @public
 * @returns {void}
 */
RecordHandler.prototype.listen = function (pattern, callback) {
  if (typeof pattern !== 'string' || pattern.length === 0) {
    throw new Error('invalid argument pattern')
  }
  if (typeof callback !== 'function') {
    throw new Error('invalid argument callback')
  }

  if (this._listener[pattern] && !this._listener[pattern].destroyPending) {
    this._client._$onError(C.TOPIC.RECORD, C.EVENT.LISTENER_EXISTS, pattern)
    return
  }

  if (this._listener[pattern]) {
    this._listener[pattern].destroy()
  }

  this._listener[pattern] = new Listener(
    C.TOPIC.RECORD,
    pattern,
    callback,
    this._options,
    this._client,
    this._connection
  )
}

/**
 * Removes a listener that was previously registered with listenForSubscriptions
 *
 * @param   {String}   pattern  A combination of alpha numeric characters and wildcards( * )
 * @param   {Function} callback
 *
 * @public
 * @returns {void}
 */
RecordHandler.prototype.unlisten = function (pattern) {
  if (typeof pattern !== 'string' || pattern.length === 0) {
    throw new Error('invalid argument pattern')
  }

  const listener = this._listener[pattern]
  if (listener && !listener.destroyPending) {
    listener.sendDestroy()
  } else if (this._listener[pattern]) {
    this._listener[pattern].destroy()
    delete this._listener[pattern]
  } else {
    this._client._$onError(C.TOPIC.RECORD, C.EVENT.NOT_LISTENING, pattern)
  }
}

/**
 * Retrieve the current record data without subscribing to changes
 *
 * @param   {String}  name the unique name of the record
 * @param   {Function}  callback
 *
 * @public
 */
RecordHandler.prototype.snapshot = function (name, callback) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new Error('invalid argument: name')
  }

  if (typeof callback !== 'function') {
    throw new Error('invalid argument: callback')
  }

  if (this._records[name] && this._records[name].isReady) {
    callback(null, this._records[name].get())
  } else {
    this._snapshotRegistry.request(name, callback)
  }
}

/**
 * Allows the user to query to see whether or not the record exists.
 *
 * @param   {String}  name the unique name of the record
 * @param   {Function}  callback
 *
 * @public
 */
RecordHandler.prototype.has = function (name, callback) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new Error('invalid argument: name')
  }

  if (typeof callback !== 'function') {
    throw new Error('invalid argument: callback')
  }

  if (this._records[name]) {
    callback(null, true)
  } else {
    this._hasRegistry.request(name, callback)
  }
}

/**
 * Allows setting the data for a record without being subscribed to it. If
 * the client is subscribed to the record locally, the update will be proxied
 * through the record object like a normal call to Record.set. Otherwise a force
 * write will be performed that overwrites any remote data.
 *
 * @param {String} recordName the name of the record to write to
 * @param {String|Object} pathOrData either the path to write data to or the data to
 *                                   set the record to
 * @param {Object|Primitive|Function} dataOrCallback either the data to write to the
 *                                                   record or a callback function
 *                                                   indicating write success
 * @param {Function} callback if provided this will be called with the result of the
 *                            write
 */
RecordHandler.prototype.setData = function (recordName, pathOrData, dataOrCallback, callback) {
  let path
  let data
  let cb

  if (arguments.length === 4) {
    // setData(recordName, path, data, cb)
    path = pathOrData
    data = dataOrCallback
    cb = callback
  } else if (arguments.length === 3) {
    if (typeof dataOrCallback !== 'function') {
      // setData(recordName, path, data)
      path = pathOrData
      data = dataOrCallback
    } else {
      // setData(recordName, data, callback)
      path = null
      data = pathOrData
      cb = dataOrCallback
    }
  } else if (arguments.length === 2) {
    // setData(recordName, data)
    data = pathOrData
  }

  if (typeof recordName !== 'string' || recordName.length === 0) {
    throw new Error('invalid argument: recordName')
  }

  if (callback && typeof callback !== 'function') {
    throw new Error('invalid argument: callback')
  }

  if (path && (typeof path !== 'string' || path.length === 0)) {
    throw new Error('invalid argument: path')
  }

  if (!path && (data === null || typeof data !== 'object')) {
    throw new Error('invalid argument: data must be an object when no path is provided')
  }

  const record = this._records[recordName]
  if (record) {
    if (path && cb) {
      record.set(path, data, cb)
    } else if (path) {
      record.set(path, data)
    } else if (cb) {
      record.set(data, cb)
    } else {
      record.set(data)
    }
  } else {
    const recordData = path
      ? [recordName, -1, path, messageBuilder.typed(data)]
      : [recordName, -1, data]
    const config = {}
    if (cb) {
      config.writeSuccess = true
      this._writeCallbacks[recordName] = {}
      this._writeCallbacks[recordName][-1] = cb
    }
    recordData.push(config)
    this._connection.sendMsg(C.TOPIC.RECORD, C.ACTIONS.CREATEANDUPDATE, recordData)
  }
}

/**
 * Will be called by the client for incoming messages on the RECORD topic
 *
 * @param   {Object} message parsed and validated deepstream message
 *
 * @package private
 * @returns {void}
 */
RecordHandler.prototype._$handle = function (message) {
  let name

  if (message.action === C.ACTIONS.ERROR &&
    (message.data[0] !== C.EVENT.VERSION_EXISTS &&
      message.data[0] !== C.ACTIONS.SNAPSHOT &&
      message.data[0] !== C.ACTIONS.HAS &&
      message.data[0] !== C.EVENT.MESSAGE_DENIED
    )
  ) {
    message.processedError = true
    this._client._$onError(C.TOPIC.RECORD, message.data[0], message.data[1])
    return
  }

  if (message.action === C.ACTIONS.ACK || message.action === C.ACTIONS.ERROR) {
    name = message.data[1]

    /*
     * The following prevents errors that occur when a record is discarded or deleted and
     * recreated before the discard / delete ack message is received.
     *
     * A (presumably unsolvable) problem remains when a client deletes a record in the exact moment
     * between another clients creation and read message for the same record
     */
    if (message.data[0] === C.ACTIONS.DELETE ||
        message.data[0] === C.ACTIONS.UNSUBSCRIBE ||
       (message.data[0] === C.EVENT.MESSAGE_DENIED && message.data[2] === C.ACTIONS.DELETE)
      ) {
      this._destroyEventEmitter.emit(`destroy_ack_${name}`, message)

      if (message.data[0] === C.ACTIONS.DELETE && this._records[name]) {
        this._records[name]._$onMessage(message)
      }

      return
    }

    if (message.data[0] === C.ACTIONS.SNAPSHOT) {
      message.processedError = true
      this._snapshotRegistry.recieve(name, message.data[2])
      return
    }

    if (message.data[0] === C.ACTIONS.HAS) {
      message.processedError = true
      this._snapshotRegistry.recieve(name, message.data[2])
      return
    }

  } else {
    name = message.data[0]
  }

  let processed = false

  const record = this._records[name]
  if (record) {
    processed = true
    record._$onMessage(message)
  }

  if (message.action === C.ACTIONS.READ && this._snapshotRegistry.hasRequest(name)) {
    processed = true
    this._snapshotRegistry.recieve(name, null, JSON.parse(message.data[2]))

  } else if (message.action === C.ACTIONS.HAS && this._hasRegistry.hasRequest(name)) {
    processed = true
    this._hasRegistry.recieve(name, null, messageParser.convertTyped(message.data[1]))

  } else if (message.action === C.ACTIONS.WRITE_ACKNOWLEDGEMENT && !record) {
    processed = true
    Record._handleWriteAcknowledgements(message, this._writeCallbacks[name], this._client)

  } else if (message.action === C.ACTIONS.ACK && message.data[0] === C.ACTIONS.UNLISTEN &&
    this._listener[name] && this._listener[name].destroyPending
  ) {
    processed = true
    this._listener[name].destroy()
    delete this._listener[name]
  } else if (this._listener[name]) {
    processed = true
    this._listener[name]._$onMessage(message)
  } else if (message.action === C.ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED) {
    // An unlisten ACK was received before an PATTERN_REMOVED which is a valid case
    processed = true
  } else if (message.action === C.ACTIONS.SUBSCRIPTION_HAS_PROVIDER) {
    // record can receive a HAS_PROVIDER after discarding the record
    processed = true
  }

  if (!processed) {
    message.processedError = true
    this._client._$onError(C.TOPIC.RECORD, C.EVENT.UNSOLICITED_MESSAGE, name)
  }
}

/**
 * Callback for 'error' events from the record.
 *
 * @param   {String} recordName
 * @param   {String} error
 *
 * @private
 * @returns {void}
 */
RecordHandler.prototype._onRecordError = function (recordName, error) {
  this._client._$onError(C.TOPIC.RECORD, error, recordName)
}

/**
 * When the client calls discard or delete on a record, there is a short delay
 * before the corresponding ACK message is received from the server. To avoid
 * race conditions if the record is re-requested straight away the old record is
 * removed from the cache straight awy and will only listen for one last ACK message
 *
 * @param   {String} recordName The name of the record that was just deleted / discarded
 *
 * @private
 * @returns {void}
 */
RecordHandler.prototype._onDestroyPending = function (recordName) {
  if (!this._records[recordName]) {
    this._client._$onError(C.TOPIC.RECORD, 'Record attempted to be destroyed but does not exists', recordName)
    return
  }
  const onMessage = this._records[recordName]._$onMessage.bind(this._records[recordName])
  this._destroyEventEmitter.once(`destroy_ack_${recordName}`, onMessage)
  this._removeRecord(recordName)
}

/**
 * Callback for 'deleted' and 'discard' events from a record. Removes the record from
 * the registry
 *
 * @param   {String} recordName
 *
 * @returns {void}
 */
RecordHandler.prototype._removeRecord = function (recordName) {
  delete this._records[recordName]
  delete this._lists[recordName]
}

module.exports = RecordHandler
