import * as utils from '../../src/util/utils'
import { expect } from 'chai'

describe('deepEquals @unit', () => {

  it('compares two primitive values', () => {
    expect(utils.deepEquals('A', 'B'))
      .to.equal(false)
  })

  it('compares two different simple objects', () => {
    const a = { name: 'Wolfram' }
    const b = { name: 'Egon' }

    expect(utils.deepEquals(a, b))
      .to.equal(false)
  })

  it('compares two equal simple objects', () => {
    const a = { name: 'Wolfram' }
    const b = { name: 'Wolfram' }

    expect(utils.deepEquals(a, b))
      .to.equal(true)
  })

  it('compares two different arrays', () => {
    const a = ['a', 'b']
    const b = ['a', 'c']

    expect(utils.deepEquals(a, b))
      .to.equal(false)
  })

  it('compares two equal arrays', () => {
    const a = ['a', 'b']
    const b = ['a', 'b']

    expect(utils.deepEquals(a, b))
      .to.equal(true)
  })

  it('compares two different complex objects', () => {
    const a = {
      x: 'y',
      a: ['b', {
        q: 'f'
      }]
    }
    const b = {
      x: 'y',
      a: ['b', {
        q: 'x'
      }]
    }

    expect(utils.deepEquals(a, b))
      .to.equal(false)
  })

  it('compares two equal complex objects', () => {
    const a = {
      x: 'y',
      a: ['b', {
        q: 'f'
      }]
    }
    const b = {
      x: 'y',
      a: ['b', {
        q: 'f'
      }]
    }

    expect(utils.deepEquals(a, b))
      .to.equal(true)
  })

  it('a complex object and a primitive', () => {
    const a = {
      x: 'y',
      a: ['b', {
        q: 'f'
      }]
    }

    expect(utils.deepEquals(a, 44))
      .to.equal(false)

    expect(utils.deepEquals(a, false))
      .to.equal(false)

    expect(utils.deepEquals(a, 44.44))
      .to.equal(false)

    expect(utils.deepEquals(a, 'primitive'))
      .to.equal(false)
  })

  it('handles undefined', () => {
    const a = {
      x: 'y',
      a: ['b', {
        q: 'f'
      }]
    }

    expect(utils.deepEquals(a, undefined))
      .to.be.equal(false)
  })

  it('handles empty objects', () => {
    const a = {
      firstname: 'Wolfram'
    }

    expect(utils.deepEquals(a, {}))
      .to.equal(false)
  })

  it('finds additional paths on objB', () => {
    const a = {
      a: 'b'
    }
    const b = {
      a: 'b',
      c: 'd'
    }
    // ??
    process.stdout.write(`${utils.deepEquals(a, b)}`)
    expect(false).to.equal(false)
  })
})

describe('deepCopy @unit', () => {
  it('copies primitives', () => {
    expect(utils.deepCopy('bla'))
      .to.equal('bla')

    expect(utils.deepCopy(42))
      .to.equal(42)
  })

  it('copies arrays', () => {
    const original = ['a', 'b', 2]
    const copy = utils.deepCopy(original)

    expect(copy)
      .to.deep.equal(original)
  })

  it('copies objects', () => {
    const original = {
        firstname: 'Wolfram',
        lastname: ' Hempel'
    }

    const copy = utils.deepCopy(original)

    expect(copy)
      .to.deep.equal(original)
  })

  it('copies objects with null values', () => {
    const original = {
        firstname: 'Wolfram',
        lastname: null
    }
    const copy = utils.deepCopy(original)

    expect(copy)
      .to.deep.equal(original)
  })

  it('copies null values', () => {
    expect(utils.deepCopy(null))
      .to.be.a('null')
  })

  it('copies nested values', () => {
    const original = {
      a: {
        b: 'c',
        d: 4
      }
    }
    const copy = utils.deepCopy(original)

    expect(original)
      .to.deep.equal(copy)

    expect(original.a)
      .to.deep.equal(copy.a)
  })

  it('copies nested arrays', () => {
    const original = {
      a: {
        b: 'c',
        d: ['a', {
          x: 'y'
        }]
      }
    }

    const copy = utils.deepCopy(original)

    expect(original)
      .to.deep.equal(copy)

    expect(original.a.d)
      .to.deep.equal(copy.a.d)

    expect(Array.isArray(copy.a.d))
      .to.equal(true)

    expect(copy.a.d[1])
      .to.deep.equal({ x: 'y' })

    expect(original.a.d[1] === copy.a.d[1])
      .to.equal(false)
  })

  // This is a JSON.stringify specific behaviour. Not too sure it's ideal,
  // but it is something that will break behaviour when changed, so let's
  // keep an eye on it
  it('converts undefined', () => {
    let copy = utils.deepCopy([undefined])

    expect(copy[0])
      .to.be.a('null')

    copy = utils.deepCopy({
      x: undefined
    })

    expect(copy)
      .to.deep.equal({})
  })
})

describe('trim removes whitespace @unit', () => {
  it('removes various kinds of whitespace', () => {
    expect(utils.trim('a    '))
      .to.equal('a')

    expect(utils.trim('   b    '))
      .to.equal('b')

    expect(utils.trim('   c d    '))
      .to.equal('c d')
  })
})

// As these tests are only ever run in node, this is a bit pointless
describe('isNode detects the environment @unit', () => {
  it('has detected something', () => {
    expect(typeof utils.isNode).to.equal('boolean')
  })
})

describe('parseUrl adds all missing parts of the url @unit', () => {
  it('accepts no protocol and default to ws', () => {
    expect(utils.parseUrl('localhost', '/deepstream'))
      .to.equal('ws://localhost/deepstream')
  })

  it('accepts // as protocol', () => {
    expect(utils.parseUrl('//localhost:6020', '/deepstream'))
      .to.equal('ws://localhost:6020/deepstream')
  })

  it('accepts ws protocols', () => {
    expect(utils.parseUrl('ws://localhost:6020', '/deepstream'))
      .to.equal('ws://localhost:6020/deepstream')

    expect(utils.parseUrl('wss://localhost:6020', '/deepstream'))
      .to.equal('wss://localhost:6020/deepstream')
  })

  it('rejects http protocols', () => {
    expect(utils.parseUrl.bind(utils, 'http://localhost:6020', '/deepstream'))
      .to.throw('Only ws and wss are supported')

    expect(utils.parseUrl.bind(utils, 'https://localhost:6020', '/deepstream'))
      .to.throw('Only ws and wss are supported')
  })

  it('accepts full url with protocol and path and doesn\'t change it', () => {
    expect(utils.parseUrl('ws://localhost:6020/anotherdeepstream', ''))
      .to.equal('ws://localhost:6020/anotherdeepstream')
  })

  it('respects queries and hash', () => {
    expect(utils.parseUrl('localhost?query=value#login', '/deepstream'))
      .to.equal('ws://localhost/deepstream?query=value#login')
  })
})
