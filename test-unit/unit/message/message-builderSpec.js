'use strict'
/* global describe, it, expect, jasmine */

let C = require('../../../src/constants/constants'),
  messageBuilder = require('../../../src/message/message-builder'),
  msg = require('../../test-helper/test-helper').msg

describe('messageBuilder composes valid deepstream messages', () => {

  it('creates a simple authentication ack message', () => {
    const message = messageBuilder.getMsg(C.TOPIC.AUTH, C.ACTIONS.ACK)
    expect(message).toBe(msg('A|A+'))
  })

  it('creates an event subscription message', () => {
    const message = messageBuilder.getMsg(C.TOPIC.EVENT, C.ACTIONS.SUBSCRIBE, ['someEvent'])
    expect(message).toBe(msg('E|S|someEvent+'))
  })

  it('creates an event message with serialized data', () => {
    const message = messageBuilder.getMsg(C.TOPIC.EVENT, C.ACTIONS.EVENT, ['someEvent', { some: 'data' }])
    expect(message).toBe(msg('E|EVT|someEvent|{"some":"data"}+'))
  })
})
