'use strict'

const utils = require('../utils/utils')

const PARTS_REG_EXP = /([^.[\]\s]+)/g
const cache = Object.create(null)

/**
 * Returns the value of the path or
 * undefined if the path can't be resolved
 *
 * @public
 * @returns {Mixed}
 */
module.exports.get = function (data, path, deepCopy) {
  const tokens = tokenize(path)
  let value = data
  for (let i = 0; i < tokens.length; i++) {
    if (value === undefined) {
      return undefined
    }
    if (typeof value !== 'object') {
      throw new Error('invalid data or path')
    }
    value = value[tokens[i]]
  }

  return deepCopy !== false ? utils.deepCopy(value) : value
}

/**
 * Sets the value of the path. If the path (or parts
 * of it) doesn't exist yet, it will be created
 *
 * @param {Mixed} value
 *
 * @public
 * @returns {Mixed} updated value
 */
module.exports.set = function (data, path, value, deepCopy) {
  const tokens = tokenize(path)

  if (tokens.length === 0) {
    return patch(data, value, deepCopy)
  }

  const oldValue = module.exports.get(data, path, false)
  const newValue = patch(oldValue, value, deepCopy)

  if (newValue === oldValue) {
    return data
  }

  const result = utils.shallowCopy(data)

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

/**
 * Merge the new value into the old value
 * @param  {Mixed} oldValue
 * @param  {Mixed} newValue
 * @param  {boolean} deepCopy
 * @return {Mixed}
 */
function patch (oldValue, newValue, deepCopy) {
  let i
  let j
  if (oldValue === null || newValue === null) {
    return newValue
  } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    let arr
    for (i = 0; i < newValue.length; i++) {
      const value = patch(oldValue[i], newValue[i], false)
      if (!arr) {
        if (value === oldValue[i]) {
          continue
        }
        arr = []
        for (j = 0; j < i; ++j) {
          arr[j] = oldValue[j]
        }
      }
      arr[i] = value
    }
    arr = arr && deepCopy !== false ? utils.deepCopy(arr) : arr
    arr = arr || (oldValue.length === newValue.length ? oldValue : newValue)
    return arr
  } else if (!Array.isArray(newValue) && typeof oldValue === 'object' && typeof newValue === 'object') {
    let obj
    const props = Object.keys(newValue)
    for (i = 0; i < props.length; i++) {
      const value = patch(oldValue[props[i]], newValue[props[i]], false)
      if (!obj) {
        if (value === oldValue[props[i]]) {
          continue
        }
        obj = Object.create(null)
        for (j = 0; j < i; ++j) {
          obj[props[j]] = oldValue[props[j]]
        }
      }
      obj[props[i]] = newValue[props[i]]
    }
    obj = obj && deepCopy !== false ? utils.deepCopy(obj) : obj
    obj = obj || (Object.keys(oldValue).length === props.length ? oldValue : newValue)
    return obj
  } else if (newValue !== oldValue) {
    return deepCopy !== false ? utils.deepCopy(newValue) : newValue
  }

  return oldValue

}

/**
 * Parses the path. Splits it into
 * keys for objects and indices for arrays.
 *
 * @returns Array of tokens
 */
function tokenize (path) {
  if (cache[path]) {
    return cache[path]
  }

  const parts = String(path) !== 'undefined' ? String(path).match(PARTS_REG_EXP) : []

  if (!parts) {
    throw new Error(`invalid path ${path}`)
  }

  cache[path] = parts
  return cache[path]
}
