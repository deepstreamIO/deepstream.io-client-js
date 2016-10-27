const URL = require('url')
const randomBytes = require('randombytes')

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ~abcdefghijklmnopqrstuvwxyz_'
const OBJECT = 'object'

const hasUrlProtocol = /^wss:|^ws:|^\/\//
const unsupportedProtocol = /^http:|^https:/

exports.isNode = typeof process !== 'undefined' && process.toString() === '[object process]'

exports.encode = function encode (number) {
  let str = ''

  for (let n = 0; number > 0; ++n) {
    str = ALPHABET[number & 0x3F] + str
    number = Math.floor(number / 64)
  }

  return str
}

exports.nuid = function () {
  let str = exports.encode(Date.now()) +
            exports.encode(parseInt(randomBytes(6).toString('hex'), 16))

  while (str.length < 14) {
    str = str + '0'
  }

  return str.substr(0, 14)
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
