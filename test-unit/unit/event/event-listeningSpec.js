'use strict'
/* global describe, it, expect, jasmine */

const RecordHandler = require('../../../src/record/record-handler')
const EventHandler = require('../../../src/event/event-handler')
const ClientMock = require('../../mocks/client-mock')
const ConnectionMock = require('../../mocks/message/connection-mock')
const msg = require('../../test-helper/test-helper').msg
const options = {}


describe('event listening', function () {

  let recordHandler,
    eventHandler,
    recordA,
    handleResponse,
    handleProvider,
    originalWarn,
    onDiscard = jasmine.createSpy('onDiscard'),
    connection = new ConnectionMock(),
    client = new ClientMock()

  function _handleResponse(topic, handler, data, remove) {
    handler._$handle({
      topic,
      action: !remove ? 'SP' : 'SR',
      data
    })
  }

  beforeEach(() => {
    eventHandler = new EventHandler(options, connection, client)
    handleResponse = _handleResponse.bind(this, 'E', eventHandler)
    originalWarn = console.warn
  })

  afterEach(() => {
    console.warn = originalWarn
  })

  it('provider accepts', (done) => {
    eventHandler.listen('a/.*', (data, isSubscribed, response) => {
      response.accept()
      expect(connection.lastSendMessage).toBe(msg('E|LA|a/.*|a/1+'))
      done()
    })
    handleResponse(['a/.*', 'a/1'])

  })

  it('provider rejects', (done) => {
    eventHandler.listen('b/.*', (data, isSubscribed, response) => {
      response.reject()
      expect(connection.lastSendMessage).toBe(msg('E|LR|b/.*|b/1+'))
      done()
    })
    handleResponse(['b/.*', 'b/1'])
  })

  it('provider accepts and then discards', (done) => {
    eventHandler.listen('b/.*', (data, isSubscribed, response) => {
      if (isSubscribed) {
        response.accept()
        expect(connection.lastSendMessage).toBe(msg('E|LA|b/.*|b/2+'))
				// simulate an unlisten
        handleResponse(['b/.*', 'b/2'], true)
      } else {
        done()
      }
    })
    handleResponse(['b/.*', 'b/2'])
  })

  it('provider accepts for c/*, but rejects for d/*', (done) => {

    eventHandler.listen('c/.*', (data, isSubscribed, response) => {
      response.accept()
      expect(connection.lastSendMessage).toBe(msg('E|LA|c/.*|c/1+'))
    })

    eventHandler.listen('d/.*', (data, isSubscribed, response) => {
      response.reject()
      expect(connection.lastSendMessage).toBe(msg('E|LR|d/.*|d/1+'))
      done()
    })


    handleResponse(['c/.*', 'c/1'])

    setTimeout(() => {
      handleResponse(['d/.*', 'd/1'])
    }, 1)
  })

})
