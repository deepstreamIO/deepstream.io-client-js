'use strict'

const sinon = require('sinon')

exports.check = function (type, expected, actual, callback, dontCallbackOnSuccess) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    if (dontCallbackOnSuccess !== true && callback) {
      callback()
    }
    return
  }
  const error = new Error(`Expected ${type} to be ${JSON.stringify(expected)}, but it was ${JSON.stringify(actual)}`)
  if (callback) {
    callback(error)
  } else {
    return error
  }
}
