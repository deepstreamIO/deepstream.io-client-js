const URL = require('url')

const OBJECT = 'object'
const FUNCTION = 'function'

const hasUrlProtocol = /^wss:|^ws:|^\/\//
const unsupportedProtocol = /^http:|^https:/

const NODE_ENV = process.env.NODE_ENV

exports.isNode = typeof process !== 'undefined' && process.toString() === '[object process]'

exports.deepFreeze = function (o) {
  if (NODE_ENV === 'production') {
    return o
  }

  Object.freeze(o)

  Object
    .getOwnPropertyNames(o)
    .forEach(function (prop) {
      if (o.hasOwnProperty(prop) &&
          o[prop] !== null &&
          (typeof o[prop] === OBJECT || typeof o[prop] === FUNCTION) &&
          !Object.isFrozen(o[prop])) {
        exports.deepFreeze(o[prop])
      }
    })

  return o
}

exports.compareVersions = function (a, b) {
  if (!a) {
    return false
  }
  if (!b) {
    return true
  }
  const [av, ar] = a.split('-')
  const [bv, br] = b.split('-')
  return parseInt(av, 10) > parseInt(bv, 10) || (av === bv && ar >= br)
}

exports.nextTick = function (fn) {
  if (exports.isNode) {
    process.nextTick(fn)
  } else {
    setTimeout(fn, 0)
  }
}

exports.deepEquals = function (objA, objB) {
  if (objA === objB) {
    return true
  } else if (typeof objA !== OBJECT || typeof objB !== OBJECT) {
    return false
  } else {
    return JSON.stringify(objA) === JSON.stringify(objB)
  }
}

exports.deepCopy = function (obj) {
  if (typeof obj === OBJECT) {
    return JSON.parse(JSON.stringify(obj))
  } else {
    return obj
  }
}

exports.shallowCopy = function (obj) {
  if (Array.isArray(obj)) {
    return obj.slice(0)
  }

  if (typeof obj === OBJECT) {
    const copy = Object.create(null)
    const props = Object.keys(obj)
    for (let i = 0; i < props.length; i++) {
      copy[props[i]] = obj[props[i]]
    }
    return copy
  }

  return obj
}

exports.setTimeout = function (callback, timeoutDuration) {
  if (timeoutDuration !== null) {
    return setTimeout(callback, timeoutDuration)
  } else {
    return -1
  }
}

exports.setInterval = function (callback, intervalDuration) {
  if (intervalDuration !== null) {
    return setInterval(callback, intervalDuration)
  } else {
    return -1
  }
}

exports.parseUrl = function (url, defaultPath) {
  if (unsupportedProtocol.test(url)) {
    throw new Error('Only ws and wss are supported')
  }
  if (!hasUrlProtocol.test(url)) {
    url = 'ws://' + url
  } else if (url.indexOf('//') === 0) {
    url = 'ws:' + url
  }
  const serverUrl = URL.parse(url)
  if (!serverUrl.host) {
    throw new Error('invalid url, missing host')
  }
  serverUrl.protocol = serverUrl.protocol ? serverUrl.protocol : 'ws:'
  serverUrl.pathname = serverUrl.pathname ? serverUrl.pathname : defaultPath
  return URL.format(serverUrl)
}

exports.requestIdleCallback = !exports.isNode && window.requestIdleCallback && window.requestIdleCallback.bind(window) ||
  function (cb) {
    const start = Date.now()
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start))
        }
      })
    }, 1)
  }

exports.cancelIdleCallback = !exports.isNode && window.cancelIdleCallback && window.cancelIdleCallback.bind(window) ||
  function (id) {
    clearTimeout(id)
  }
