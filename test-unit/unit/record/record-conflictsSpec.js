'use strict'
/* global describe, it, expect, jasmine, beforeAll, afterAll */

let Record = require('../../../src/record/record.js')
let MockConnection = require('../../mocks/message/connection-mock')
let msg = require('../../test-helper/test-helper').msg
let ClientMock = require('../../mocks/client-mock')
let MERGE_STRATEGIES = require('../../../src/constants/merge-strategies.js')
let options = { recordReadAckTimeout: 100, recordReadTimeout: 200, mergeStrategy: MERGE_STRATEGIES.REMOTE_WINS }

describe('getting a merge conflict from the server', () => {
  let record
  let errorCallback
  let connection
  let setCallback
  let subscribeCallback

  function createRecord () {
    record = new Record('recordConflict', {}, connection, options, new ClientMock())
    record.on('error', errorCallback)
    record.subscribe(subscribeCallback)
    record._$onMessage({ topic: 'R', action: 'R', data: ['recordConflict', 3, '{}'] })
    return record
  }

  function createAnotherRecord () {
    record = new Record('recordConflict', {}, connection, options, new ClientMock())
    record.on('error', errorCallback)
    record.subscribe(subscribeCallback)
    record._$onMessage({ topic: 'R', action: 'R', data: ['recordConflict', 8, '{ "a": "a", "b": { "b1" : "b1" }, "c": "c" }'] })
    return record
  }

  beforeAll(() => {
    errorCallback = jasmine.createSpy('errorCallback')
    subscribeCallback = jasmine.createSpy('subscribeCallback')
    setCallback = jasmine.createSpy('setCallback')
    connection = new MockConnection()
  })

  it('throws an error when setMergeStrategy is called incorrectly', () => {
    expect(() => {
      createRecord().setMergeStrategy({})
    }).toThrow(new Error('Invalid merge strategy: Must be a Function'))
  })

  describe('when it recieves an update that isn\'t in sync', () => {
    describe('that is ahead of local and different', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        connection.lastSendMessage = null
        record._$onMessage({ topic: 'R', action: 'U', data: ['recordConflict', 5, '{ "reason": "skippedVersion" }'] })
      })

      it('does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).toHaveBeenCalledWith({ reason: 'skippedVersion' })
      })

      it('sends update to server', () => {
        expect(connection.lastSendMessage).toBe(null)
      })

      it('is same version as remote', () => {
        expect(record.version).toBe(5)
      })
    })

    describe('that is behind local and different', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        connection.lastSendMessage = null
        record._$onMessage({ topic: 'R', action: 'U', data: ['recordConflict', 2, '{ "otherReason": "behindVersion" }'] })
      })

      it('does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).toHaveBeenCalledWith({ otherReason: 'behindVersion' })
      })

      it('sends update to server', () => {
        expect(connection.lastSendMessage).toBe(null)
      })

      it('is same version ahead as remote', () => {
        expect(record.version).toBe(2)
      })
    })

    describe('that is ahead of local and identical', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        connection.lastSendMessage = null
        record._$onMessage({ topic: 'R', action: 'U', data: ['recordConflict', 5, '{}'] })
      })

      it('it does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).not.toHaveBeenCalled()
      })

      it('doesn\'t send update to server', () => {
        expect(connection.lastSendMessage).toBeNull()
      })

      it('is the same version as remote', () => {
        expect(record.version).toBe(5)
      })
    })

    describe('that is behind local and identical', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        connection.lastSendMessage = null
        record._$onMessage({ topic: 'R', action: 'U', data: ['recordConflict', 2, '{}'] })
      })

      it('it does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).not.toHaveBeenCalled()
      })

      it('doesn\'t send update to server', () => {
        expect(connection.lastSendMessage).toBeNull()
      })

      it('is the same version as remote', () => {
        expect(record.version).toBe(2)
      })
    })

    describe('that fails the merge', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        record.setMergeStrategy((record, remoteValue, remoteVersion, callback) => {
          callback('error occured merging')
        })
        record._$onMessage({ topic: 'R', action: 'U', data: ['recordConflict', 2, '{ "otherReason": "behindVersion" }'] })
      })

      afterAll(() => {
        record.setMergeStrategy(MERGE_STRATEGIES.REMOTE_WINS)
      })

      it('it throws an error', () => {
        expect(errorCallback.calls.count()).toBe(1)
        expect(errorCallback.calls.mostRecent().args).toEqual(['VERSION_EXISTS', 'received update for 2 but version is 3'])
      })
    })
  })

  describe('when it recieves a patch that isn\'t in sync', () => {
    it('requests a SNAPSHOT of the record to get the full remote state', () => {
      record = createAnotherRecord()
      record._$onMessage({ topic: 'R', action: 'P', data: ['recordConflict', 5, 'b.b1', 'SanotherValue'] })
      expect(connection.lastSendMessage).toBe(msg('R|SN|recordConflict+'))
    })

    describe('that is ahead of local and different', () => {
      beforeAll(() => {
        record = createAnotherRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        record._$onMessage({ topic: 'R', action: 'P', data: ['recordConflict', 5, 'b.b1', 'SanotherValue'] })
        record._$onMessage({ topic: 'R', action: 'R', data: ['recordConflict', 5, '{ "a": "a", "b": { "b1" : "anotherValue" }, "c": "c" }'] })
      })

      it('does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).toHaveBeenCalledWith({ a: 'a', b: { b1: 'anotherValue' }, c: 'c' })
      })

      it('sends update to server', () => {
        expect(connection.lastSendMessage).toBe(msg('R|SN|recordConflict+'))
      })

      it('is same version as remote', () => {
        expect(record.version).toBe(5)
      })
    })

    describe('that is behind local and different', () => {
      beforeAll(() => {
        record = createAnotherRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        record._$onMessage({ topic: 'R', action: 'P', data: ['recordConflict', 2, 'b.b1', 'SWhoAmI'] })
        record._$onMessage({ topic: 'R', action: 'R', data: ['recordConflict', 2, '{ "a": "a", "b": { "b1" : "WhoAmI" }, "c": "c" }'] })
      })

      it('does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).toHaveBeenCalledWith({ a: 'a', b: { b1: 'WhoAmI' }, c: 'c' })
      })

      it('sends update to server', () => {
        expect(connection.lastSendMessage).toBe(msg('R|SN|recordConflict+'))
      })

      it('is same version as remote', () => {
        expect(record.version).toBe(2)
      })
    })

    describe('that is ahead of local and identical', () => {
      beforeAll(() => {
        record = createAnotherRecord()
        connection.lastSendMessage = null
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        record._$onMessage({ topic: 'R', action: 'P', data: ['recordConflict', 15, 'b.b1', 'b1'] })
        record._$onMessage({ topic: 'R', action: 'R', data: ['recordConflict', 15, '{ "a": "a", "b": { "b1" : "b1" }, "c": "c" }'] })
      })

      it('it does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).not.toHaveBeenCalled()
      })

      it('doesn\'t send an update to server', () => {
        expect(connection.lastSendMessage).toBe(msg('R|SN|recordConflict+'))
      })

      it('is the same version as remote', () => {
        expect(record.version).toBe(15)
      })
    })

    describe('that is behind local and identical', () => {
      beforeAll(() => {
        record = createAnotherRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        record._$onMessage({ topic: 'R', action: 'P', data: ['recordConflict', 2, 'b.b1', 'b1'] })
        record._$onMessage({ topic: 'R', action: 'R', data: ['recordConflict', 2, '{ "a": "a", "b": { "b1" : "b1" }, "c": "c" }'] })
      })

      it('it does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).not.toHaveBeenCalled()
      })

      it('doesn\'t send an update to server', () => {
        expect(connection.lastSendMessage).toBe(msg('R|SN|recordConflict+'))
      })

      it('is the same version as remote', () => {
        expect(record.version).toBe(2)
      })
    })

    describe('that fails the merge', () => {
      beforeAll(() => {
        record = createAnotherRecord()
        errorCallback.calls.reset()
        record.setMergeStrategy((record, remoteValue, remoteVersion, callback) => {
          callback('error occured merging')
        })
        record._$onMessage({ topic: 'R', action: 'P', data: ['recordConflict', 2, 'b.b1', 'SWhoAmI'] })
        record._$onMessage({ topic: 'R', action: 'R', data: ['recordConflict', 2, '{ "a": "a", "b": { "b1" : "WhoAmI" }, "c": "c" }'] })
      })

      afterAll(() => {
        record.setMergeStrategy(MERGE_STRATEGIES.REMOTE_WINS)
      })

      it('it throws an error', () => {
        expect(errorCallback.calls.count()).toBe(1)
        expect(errorCallback.calls.mostRecent().args).toEqual(['VERSION_EXISTS', 'received update for 2 but version is 8'])
      })
    })
  })

  describe('when it recieves a VERSION_EXISTS error', () => {
    describe('that is ahead of local version and different', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        record._$onMessage({ topic: 'R', action: 'E', data: ['VERSION_EXISTS', 'recordConflict', 5, '{ "reason": "aheadVersion" }'] })
      })

      it('does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).toHaveBeenCalledWith({ reason: 'aheadVersion' })
      })

      it('is same version as remote', () => {
        expect(record.version).toBe(5)
      })
    })

    describe('that is behind local version and different', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        record._$onMessage({ topic: 'R', action: 'E', data: ['VERSION_EXISTS', 'recordConflict', 2, '{ "otherReason": "behindVersion" }'] })
      })

      it('does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).toHaveBeenCalledWith({ otherReason: 'behindVersion' })
      })

      it('is same version as remote', () => {
        expect(record.version).toBe(2)
      })
    })

    describe('that is ahead of local and identical', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        record._$onMessage({ topic: 'R', action: 'E', data: ['VERSION_EXISTS', 'recordConflict', 5, '{}'] })
      })

      it('it does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).not.toHaveBeenCalled()
      })

      it('is the same version as remote', () => {
        expect(record.version).toBe(5)
      })
    })

    describe('that is behind local and identical', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        subscribeCallback.calls.reset()
        record._$onMessage({ topic: 'R', action: 'E', data: ['VERSION_EXISTS', 'recordConflict', 0, '{}'] })
      })

      it('it does not throw an error', () => {
        expect(errorCallback.calls.count()).toBe(0)
      })

      it('sets the record', () => {
        expect(subscribeCallback).not.toHaveBeenCalled()
      })

      it('is the same version as remote', () => {
        expect(record.version).toBe(0)
      })
    })

    describe('that fails the merge', () => {
      beforeAll(() => {
        record = createRecord()
        errorCallback.calls.reset()
        record.setMergeStrategy((record, remoteValue, remoteVersion, callback) => {
          callback('error occured merging')
        })
        record._$onMessage({ topic: 'R', action: 'E', data: ['VERSION_EXISTS', 'recordConflict', 2, '{ "otherReason": "behindVersion" }'] })
      })

      afterAll(() => {
        record.setMergeStrategy(MERGE_STRATEGIES.REMOTE_WINS)
      })

      it('it throws an error', () => {
        expect(errorCallback.calls.count()).toBe(1)
        expect(errorCallback.calls.mostRecent().args).toEqual(['VERSION_EXISTS', 'received update for 2 but version is 3'])
      })
    })
  })

  describe('when it updates a record with a write acknowledgement', () => {
    beforeAll(() => {
      record = createAnotherRecord()
      setCallback.calls.reset()
      record.setMergeStrategy(MERGE_STRATEGIES.LOCAL_WINS)
      record.set({ name: 'Alex' }, setCallback)
    })

    describe('that is behind remote and different', () => {
      it('receives version exists error', () => {
        record._$onMessage({ topic: 'R', action: 'E', data: ['VERSION_EXISTS', 'recordConflict', 2, '{ "otherReason": "behindVersion" }', '{"writeSuccess": true}'] })
      })

      it('sends update to server', () => {
        expect(connection.lastSendMessage).toBe(msg('R|U|recordConflict|3|{"name":"Alex"}|{"writeSuccess": true}+'))
      })

      it('is now the correct version', () => {
        expect(record.version).toBe(3)
      })

      it('callback is called with successful write', () => {
        record._$onMessage({ topic: 'R', action: 'WA', data: ['conflictRecord', '[3]', 'L'] })

        expect(setCallback.calls.count()).toBe(1)
        expect(setCallback).toHaveBeenCalledWith(null)
      })
    })
  })
})
