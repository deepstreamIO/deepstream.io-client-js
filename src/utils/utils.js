'use strict'
/* eslint-disable valid-typeof */
const C = require('../constants/constants')

/**
 * A regular expression that matches whitespace on either side, but
 * not in the center of a string
 *
 * @type {RegExp}
 */
const TRIM_REGULAR_EXPRESSION = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

/**
 * Used in typeof comparisons
 *
 * @type {String}
 */
const OBJECT = 'object'

/**
 * True if environment is node, false if it's a browser
 * This seems somewhat inelegant, if anyone knows a better solution,
 * let's change this (must identify browserify's pseudo node implementation though)
 *
 * @public
 * @type {Boolean}
 */
exports.isNode = typeof process !== 'undefined' && process.toString() === '[object process]'

/**
 * Provides as soon as possible async execution in a cross
 * platform way
 *
 * @param   {Function} fn the function to be executed in an asynchronous fashion
 *
 * @public
 * @returns {void}
 */
exports.nextTick = function (fn) {
  if (exports.isNode) {
    process.nextTick(fn)
  } else {
    setTimeout(fn, 0)
  }
}

/**
 * Removes whitespace from the beginning and end of a string
 *
 * @param   {String} inputString
 *
 * @public
 * @returns {String} trimmedString
 */
exports.trim = function (inputString) {
  if (inputString.trim) {
    return inputString.trim()
  }
  return inputString.replace(TRIM_REGULAR_EXPRESSION, '')
}

/**
 * Compares two objects for deep (recoursive) equality
 *
 * This used to be a significantly more complex custom implementation,
 * but JSON.stringify has gotten so fast that it now outperforms the custom
 * way by a factor of 1.5 to 3.
 *
 * In IE11 / Edge the custom implementation is still slightly faster, but for
 * consistencies sake and the upsides of leaving edge-case handling to the native
 * browser / node implementation we'll go for JSON.stringify from here on.
 *
 * Please find performance test results here
 *
 * http://jsperf.com/deep-equals-code-vs-json
 *
 * @param   {Mixed} objA
 * @param   {Mixed} objB
 *
 * @public
 * @returns {Boolean} isEqual
 */
exports.deepEquals = function (objA, objB) {
  if (objA === objB) {
    return true
  } else if (typeof objA !== OBJECT || typeof objB !== OBJECT) {
    return false
  }

  return JSON.stringify(objA) === JSON.stringify(objB)
}

/**
 * Similar to deepEquals above, tests have shown that JSON stringify outperforms any attempt of
 * a code based implementation by 50% - 100% whilst also handling edge-cases and keeping
 * implementation complexity low.
 *
 * If ES6/7 ever decides to implement deep copying natively (what happened to Object.clone?
 * that was briefly a thing...), let's switch it for the native implementation. For now though,
 * even Object.assign({}, obj) only provides a shallow copy.
 *
 * Please find performance test results backing these statements here:
 *
 * http://jsperf.com/object-deep-copy-assign
 *
 * @param   {Mixed} obj the object that should be cloned
 *
 * @public
 * @returns {Mixed} clone
 */
exports.deepCopy = function (obj) {
  if (typeof obj === OBJECT) {
    return JSON.parse(JSON.stringify(obj))
  }
  return obj
}

/**
 * Copy the top level of items, but do not copy its items recourisvely. This
 * is much quicker than deepCopy does not guarantee the object items are new/unique.
 * Mainly used to change the reference to the actual object itself, but not its children.
 *
 * @param   {Mixed} obj the object that should cloned
 *
 * @public
 * @returns {Mixed} clone
 */
exports.shallowCopy = function (obj) {
  if (Array.isArray(obj)) {
    return obj.slice(0)
  } else if (typeof obj === OBJECT) {
    const copy = Object.create(null)
    const props = Object.keys(obj)
    for (let i = 0; i < props.length; i++) {
      copy[props[i]] = obj[props[i]]
    }
    return copy
  }
  return obj
}

/**
 * Set timeout utility that adds support for disabling a timeout
 * by passing null
 *
 * @param {Function} callback        the function that will be called after the given time
 * @param {Number}   timeoutDuration the duration of the timeout in milliseconds
 *
 * @public
 * @returns {Number} timeoutId
 */
exports.setTimeout = function (callback, timeoutDuration) {
  if (timeoutDuration !== null) {
    return setTimeout(callback, timeoutDuration)
  }
  return -1

}

/**
 * Set Interval utility that adds support for disabling an interval
 * by passing null
 *
 * @param {Function} callback        the function that will be called after the given time
 * @param {Number}   intervalDuration the duration of the interval in milliseconds
 *
 * @public
 * @returns {Number} intervalId
 */
exports.setInterval = function (callback, intervalDuration) {
  if (intervalDuration !== null) {
    return setInterval(callback, intervalDuration)
  }
  return -1
}

/**
 * Used to see if a protocol is specified within the url
 * @type {RegExp}
 */
const hasUrlProtocol = /^wss:|^ws:|^\/\//

/**
 * Used to see if the protocol contains any unsupported protocols
 * @type {RegExp}
 */
const unsupportedProtocol = /^http:|^https:/

const URL = require('url')

/**
 * Take the url passed when creating the client and ensure the correct
 * protocol is provided
 * @param  {String} url Url passed in by client
 * @return {String} Url with supported protocol
 */
exports.parseUrl = function (initialURl, defaultPath) {
  let url = initialURl
  if (unsupportedProtocol.test(url)) {
    throw new Error('Only ws and wss are supported')
  }
  if (!hasUrlProtocol.test(url)) {
    url = `ws://${url}`
  } else if (url.indexOf('//') === 0) {
    url = `ws:${url}`
  }
  const serverUrl = URL.parse(url)
  if (!serverUrl.host) {
    throw new Error('invalid url, missing host')
  }
  serverUrl.protocol = serverUrl.protocol ? serverUrl.protocol : 'ws:'
  serverUrl.pathname = serverUrl.pathname ? serverUrl.pathname : defaultPath
  return URL.format(serverUrl)
}

exports.requestIdleCallback = (!exports.isNode &&
  window.requestIdleCallback &&
  window.requestIdleCallback.bind(window)) ||
  function (cb) {
    const start = Date.now()
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining () {
          return Math.max(0, 50 - (Date.now() - start))
        }
      })
    }, 1)
  }

exports.cancelIdleCallback = (!exports.isNode &&
  window.cancelIdleCallback &&
  window.cancelIdleCallback.bind(window)) ||
  function (id) {
    clearTimeout(id)
  }

/**
 * Returns true is the connection state is OPEN
 * @return {Boolean}
 */
exports.isConnected = function (client) {
  const connectionState = client.getConnectionState()
  return connectionState === C.CONNECTION_STATE.OPEN
}
