'use strict'
/* global describe, it, expect, jasmine */

const utils = require('../../../src/utils/utils')

describe('deepEquals', () => {

  it('compares two primitive values', () => {
    let a = 'A',
      b = 'B'
    expect(utils.deepEquals(a, b)).toBe(false)
  })

  it('compares two different simple objects', () => {
    let a = { name: 'Wolfram' },
      b = { name: 'Egon' }
    expect(utils.deepEquals(a, b)).toBe(false)
  })

  it('compares two equal simple objects', () => {
    let a = { name: 'Wolfram' },
      b = { name: 'Wolfram' }
    expect(utils.deepEquals(a, b)).toBe(true)
  })

  it('compares two different arrays', () => {
    let a = ['a', 'b'],
      b = ['a', 'c']
    expect(utils.deepEquals(a, b)).toBe(false)
  })

  it('compares two equal arrays', () => {
    let a = ['a', 'b'],
      b = ['a', 'b']
    expect(utils.deepEquals(a, b)).toBe(true)
  })

  it('compares two different complex objects', () => {
    let a = { x: 'y', a: ['b', { q: 'f' }] },
      b = { x: 'y', a: ['b', { q: 'x' }] }
    expect(utils.deepEquals(a, b)).toBe(false)
  })

  it('compares two equal complex objects', () => {
    let a = { x: 'y', a: ['b', { q: 'f' }] },
      b = { x: 'y', a: ['b', { q: 'f' }] }
    expect(utils.deepEquals(a, b)).toBe(true)
  })

  it('a complex object and a primitive', () => {
    let a = { x: 'y', a: ['b', { q: 'f' }] },
      b = 44
    expect(utils.deepEquals(a, b)).toBe(false)
  })

  it('handles undefined', () => {
    let a, // jshint ignore:line
      b = { x: 'y', a: ['b', { q: 'f' }] }
    expect(utils.deepEquals(a, b)).toBe(false)
  })

  it('handles empty objects', () => {
    let a = {},
      b = { firstname: 'Wolfram' }
    expect(utils.deepEquals(a, b)).toBe(false)
  })

  it('finds additional paths on objB', () => {
    let a = { a: 'b' },
      b = { a: 'b', c: 'd' }
    expect(utils.deepEquals(a, b)).toBe(false)
  })
})

describe('deepCopy', () => {
  it('copies primitives', () => {
    expect(utils.deepCopy('bla')).toBe('bla')
    expect(utils.deepCopy(42)).toBe(42)
  })

  it('copies arrays', () => {
    let original = ['a', 'b', 2],
      copy = utils.deepCopy(original)

    expect(copy).toEqual(original)
    expect(copy).not.toBe(original)
  })

  it('copies objects', () => {
    let original = { firstname: 'Wolfram', lastname:' Hempel' },
      copy = utils.deepCopy(original)

    expect(copy).toEqual(original)
    expect(copy).not.toBe(original)
  })

  it('copies objects with null values', () => {
    let original = { firstname: 'Wolfram', lastname: null },
      copy = utils.deepCopy(original)

    expect(copy).toEqual(original)
    expect(copy).not.toBe(original)
  })

  it('copies null values', () => {
    const copy = utils.deepCopy(null)
    expect(copy).toBeNull()
  })

  it('copies nested values', () => {
    const original = { a: { b: 'c', d: 4 } }
    const copy = utils.deepCopy(original)
    expect(original).toEqual(copy)
    expect(original.a).not.toBe(copy.a)
  })

  it('copies nested arrays', () => {
    const original = { a: { b: 'c', d: ['a', { x: 'y' }] } }
    const copy = utils.deepCopy(original)
    expect(original).toEqual(copy)
    expect(original.a.d).not.toBe(copy.a.d)
    expect(Array.isArray(copy.a.d)).toBe(true)
    expect(copy.a.d[1]).toEqual({ x: 'y' })
    expect(original.a.d[1] === copy.a.d[1]).toBe(false)
  })

  // This is a JSON.stringify specific behaviour. Not too sure it's ideal,
  // but it is something that will break behaviour when changed, so let's
  // keep an eye on it
  it('converts undefined', () => {
    let copy = utils.deepCopy([undefined])
    expect(copy[0]).toBe(null)

    copy = utils.deepCopy({ x: undefined })
    expect(copy).toEqual({})
  })
})

describe('utils.trim removes whitespace', () => {
  it('removes various kinds of whitespace', () => {
    expect(utils.trim('a    ')).toEqual('a')
    expect(utils.trim('   b    ')).toEqual('b')
    expect(utils.trim('   c d    ')).toEqual('c d')
  })
})

// As these tests are only ever run in node, this is a bit pointless
describe('utils.isNode detects the environment', () => {
  it('has detected something', () => {
    expect(typeof utils.isNode).toBe('boolean')
  })
})

describe('utils.parseUrl adds all missing parts of the url', () => {
  it('accepts no protocol and default to ws', () => {
    expect(utils.parseUrl('localhost', '/deepstream'))
      .toBe('ws://localhost/deepstream')
  })

  it('accepts // as protocol', () => {
    expect(utils.parseUrl('//localhost:6020', '/deepstream'))
      .toBe('ws://localhost:6020/deepstream')
  })

  it('accepts ws protocols', () => {
    expect(utils.parseUrl('ws://localhost:6020', '/deepstream'))
      .toBe('ws://localhost:6020/deepstream')
    expect(utils.parseUrl('wss://localhost:6020', '/deepstream'))
      .toBe('wss://localhost:6020/deepstream')
  })

  it('rejects http protocols', () => {
    expect(() => {
      utils.parseUrl('http://localhost:6020', '/deepstream')
    }).toThrow(new Error('Only ws and wss are supported'))
    expect(() => {
      utils.parseUrl('https://localhost:6020', '/deepstream')
    }).toThrow(new Error('Only ws and wss are supported'))
  })

  it('accepts full url with protocol and path and doesn\'t change it', () => {
    expect(utils.parseUrl('ws://localhost:6020/anotherdeepstream'))
      .toBe('ws://localhost:6020/anotherdeepstream')
  })

  it('respects queries and hash', () => {
    expect(utils.parseUrl('localhost?query=value#login', '/deepstream'))
      .toBe('ws://localhost/deepstream?query=value#login')
  })
})

describe('utils.requestIdleTimeout', () => {
  it('callbacks asynchronously as soon as possible', (done) => {
    let syncronous = false

    utils.requestIdleCallback(() => {
      expect(syncronous).toBe(true)
      done()
    })

    syncronous = true
  }, 100)
})
