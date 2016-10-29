const utils = require('../utils/utils')
const PARTS_REG_EXP = /([^\.\[\]\s]+)/g

const cache = Object.create(null)

module.exports.get = function (data, path) {
  const tokens = module.exports.tokenize(path)

  data = data || Object.create(null)

  for (let i = 0; i < tokens.length; i++) {
    if (data === undefined) {
      return undefined
    }
    if (typeof data !== 'object') {
      throw new Error('invalid data or path')
    }
    data = data[tokens[i]]
  }

  return data
}

module.exports.set = function (data, path, value) {
  const tokens = module.exports.tokenize(path)

  if (tokens.length === 0) {
    return module.exports.patch(data, value)
  }

  const oldValue = module.exports.get(data, path)
  const newValue = module.exports.patch(oldValue, value)

  if (newValue === oldValue) {
    return data
  }

  const result = utils.shallowCopy(data || Object.create(null))

  let node = result
  for (let i = 0; i < tokens.length; i++) {
    if (i === tokens.length - 1) {
      node[tokens[i]] = newValue
    } else if (node[tokens[i]] !== undefined) {
      node = node[tokens[i]] = utils.shallowCopy(node[tokens[i]])
    } else if (tokens[i + 1] && !isNaN(tokens[i + 1])) {
      node = node[tokens[i]] = []
    } else {
      node = node[tokens[i]] = Object.create(null)
    }
  }

  return result
}

module.exports.patch = function (oldValue, newValue) {
  if (utils.deepEquals(oldValue, newValue)) {
    return oldValue
  } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    const arr = []
    for (let i = 0; i < newValue.length; i++) {
      arr[i] = module.exports.patch(oldValue[i], newValue[i])
    }
    return arr
  } else if (!Array.isArray(newValue) && typeof oldValue === 'object' && typeof newValue === 'object') {
    const props = Object.keys(newValue)
    const obj = Object.create(null)
    for (let i = 0; i < props.length; i++) {
      obj[props[i]] = module.exports.patch(oldValue[props[i]], newValue[props[i]])
    }
    return obj
  } else {
    return newValue
  }
}

module.exports.tokenize = function (path) {
  if (cache[path]) {
    return cache[path]
  }

  const parts = path && String(path) !== 'undefined' ? String(path).match(PARTS_REG_EXP) : []

  if (!parts) {
    throw new Error('invalid path ' + path)
  }

  cache[path] = parts.map((part) => !isNaN(part) ? parseInt(part, 10) : part)

  return cache[path]
}
