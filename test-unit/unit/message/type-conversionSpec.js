'use strict'
/* global describe, it, expect, jasmine */

let messageBuilder = require('../../../src/message/message-builder'),
  messageParser = require('../../../src/message/message-parser')

describe('variable types are serialized and deserialized correctly', () => {

  it('processes strings correctly', () => {
    let input = 'Wolfram',
      typed = messageBuilder.typed(input)

    expect(typed).toBe('SWolfram')
    expect(messageParser.convertTyped(typed)).toBe(input)
  })

  it('processes objects correctly', () => {
    let input = { firstname: 'Wolfram' },
      typed = messageBuilder.typed(input)

    expect(typed).toBe('O{"firstname":"Wolfram"}')
    expect(messageParser.convertTyped(typed)).toEqual(input)
  })

  it('processes arrays correctly', () => {
    let input = ['a', 'b', 'c'],
      typed = messageBuilder.typed(input)

    expect(typed).toBe('O["a","b","c"]')
    expect(messageParser.convertTyped(typed)).toEqual(input)
  })

  it('processes integers correctly', () => {
    let input = 42,
      typed = messageBuilder.typed(input)

    expect(typed).toBe('N42')
    expect(messageParser.convertTyped(typed)).toBe(input)
  })

  it('processes floats correctly', () => {
    let input = 0.543,
      typed = messageBuilder.typed(input)

    expect(typed).toBe('N0.543')
    expect(messageParser.convertTyped(typed)).toBe(input)
  })

  it('processes null values correctly', () => {
    let input = null,
      typed = messageBuilder.typed(input)

    expect(typed).toBe('L')
    expect(messageParser.convertTyped(typed)).toBe(input)
  })

  it('processes Boolean true correctly', () => {
    let input = true,
      typed = messageBuilder.typed(input)

    expect(typed).toBe('T')
    expect(messageParser.convertTyped(typed)).toBe(input)
  })

  it('processes Boolean false correctly', () => {
    let input = false,
      typed = messageBuilder.typed(input)

    expect(typed).toBe('F')
    expect(messageParser.convertTyped(typed)).toBe(input)
  })

  it('processes undefined correctly', () => {
    const typed = messageBuilder.typed()

    expect(typed).toBe('U')
    expect(messageParser.convertTyped(typed)).toBe(undefined)
  })
})
