import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import { assert, spy, match } from 'sinon'
import { getServicesMock, getSingleNotifierMock } from '../mocks'
import { TOPIC, RECORD_ACTIONS } from '../../binary-protocol/src/message-constants'
import { RecordHandler } from '../../src/record/record-handler'

import { DefaultOptions } from '../../src/client-options'

describe('Record handler', () => {
  const name = 'recordA'
  const options = Object.assign({}, DefaultOptions)

  let services: any
  let singleNotifierMock: any
  let callbackSpy: sinon.SinonSpy
  let resolveSpy: sinon.SinonSpy
  let rejectSpy: sinon.SinonSpy
  let recordHandler: RecordHandler
  let handle: Function

  beforeEach(() => {
    callbackSpy = spy()
    resolveSpy = spy()
    rejectSpy = spy()
    services = getServicesMock()
    singleNotifierMock = getSingleNotifierMock().singleNotifierMock

    recordHandler = new RecordHandler(services, options)
    handle = services.getHandle()
  })

  afterEach(() => {
    singleNotifierMock.verify()
    services.verify()
  })

  it('validates on has, head and snapshot', () => {
    expect(recordHandler.has.bind(recordHandler, '')).to.throw()
    expect(recordHandler.has.bind(recordHandler, '', () => {})).to.throw()
    expect(recordHandler.has.bind(recordHandler, 123, () => {})).to.throw()
    expect(recordHandler.has.bind(recordHandler, null, () => {})).to.throw()

    expect(recordHandler.has.bind(recordHandler, name, null)).to.throw()
    expect(recordHandler.has.bind(recordHandler, name, 123)).to.throw()
    expect(recordHandler.has.bind(recordHandler, name, [])).to.throw()
    expect(recordHandler.has.bind(recordHandler, name, {})).to.throw()

    expect(recordHandler.head.bind(recordHandler, '')).to.throw()
    expect(recordHandler.head.bind(recordHandler, '', () => {})).to.throw()
    expect(recordHandler.head.bind(recordHandler, 123, () => {})).to.throw()
    expect(recordHandler.head.bind(recordHandler, null, () => {})).to.throw()

    expect(recordHandler.head.bind(recordHandler, name, null)).to.throw()
    expect(recordHandler.head.bind(recordHandler, name, 123)).to.throw()
    expect(recordHandler.head.bind(recordHandler, name, [])).to.throw()
    expect(recordHandler.head.bind(recordHandler, name, {})).to.throw()

    expect(recordHandler.snapshot.bind(recordHandler, '')).to.throw()
    expect(recordHandler.snapshot.bind(recordHandler, '', () => {})).to.throw()
    expect(recordHandler.snapshot.bind(recordHandler, 123, () => {})).to.throw()
    expect(recordHandler.snapshot.bind(recordHandler, null, () => {})).to.throw()

    expect(recordHandler.snapshot.bind(recordHandler, name, null)).to.throw()
    expect(recordHandler.snapshot.bind(recordHandler, name, 123)).to.throw()
    expect(recordHandler.snapshot.bind(recordHandler, name, [])).to.throw()
    expect(recordHandler.snapshot.bind(recordHandler, name, {})).to.throw()
  })

  it('snapshots record remotely using callback and promise style', async () => {
    singleNotifierMock
      .expects('request')
      .twice()
      .withExactArgs(name, match.func)

    recordHandler.snapshot(name, callbackSpy)
    recordHandler.snapshot(name)
  })

  it('snapshots local records using callback and promise style', () => {
    /**
     * TODO
     */
  })

  describe('handling snapshot messages', () => {
    let data: any

    beforeEach(() => {
      data = { some: 'data' }
      recordHandler.snapshot(name, callbackSpy)
      const promise = recordHandler.snapshot(name)
      promise.then(resolveSpy).catch(rejectSpy)
    })

    it('handles success messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTIONS.READ_RESPONSE,
        name,
        isError: false,
        parsedData: data
      })

      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, null, data)

      assert.calledOnce(resolveSpy)
      assert.calledWithExactly(resolveSpy, data)

      assert.notCalled(rejectSpy)
    })

    it('handles error messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTIONS.MESSAGE_DENIED,
        originalAction: RECORD_ACTIONS.READ,
        name,
        isError: true
      })

      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, RECORD_ACTIONS[RECORD_ACTIONS.MESSAGE_DENIED], undefined)

      assert.notCalled(resolveSpy)

      assert.calledOnce(rejectSpy)
      assert.calledWithExactly(rejectSpy, RECORD_ACTIONS[RECORD_ACTIONS.MESSAGE_DENIED])
    })
  })

  it('queries for the record version remotely using callback and promise', () => {
    singleNotifierMock
      .expects('request')
      .twice()
      .withExactArgs(name, match.func)

    recordHandler.head(name, callbackSpy)

    const promise = recordHandler.head(name)
    promise.then(resolveSpy).catch(rejectSpy)
  })

  it('queries for the record version in local records using callback and promise', () => {
    /**
     * TODO
     */
  })

  describe('handling head messages from head calls', () => {
    let version: number

    beforeEach(() => {
      version = 1
      recordHandler.head(name, callbackSpy)
      const promise = recordHandler.head(name)
      promise.then(resolveSpy).catch(rejectSpy)
    })

    it('handles success messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTIONS.HEAD_RESPONSE,
        name,
        isError: false,
        version
      })

      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, null, version)

      assert.calledOnce(resolveSpy)
      assert.calledWithExactly(resolveSpy, version)

      assert.notCalled(rejectSpy)
    })

    it('handles error messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTIONS.MESSAGE_DENIED,
        originalAction: RECORD_ACTIONS.HEAD,
        name,
        isError: true
      })

      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, RECORD_ACTIONS[RECORD_ACTIONS.MESSAGE_DENIED], undefined)

      assert.notCalled(resolveSpy)

      assert.calledOnce(rejectSpy)
      assert.calledWithExactly(rejectSpy, RECORD_ACTIONS[RECORD_ACTIONS.MESSAGE_DENIED])
    })
  })

  it('queries for record exists remotely using callback and promise', () => {
    singleNotifierMock
      .expects('request')
      .twice()
      .withExactArgs(name, match.func)

    recordHandler.has(name, callbackSpy)
    const promise = recordHandler.has(name)
    promise.then(resolveSpy).catch(rejectSpy)
  })

  it('queries for record exists in local records using callback and promise', () => {
    /**
     * TODO
     */
  })

  describe('handling head messages from has calls', () => {
    let version: number

    beforeEach(() => {
      version = 1
      recordHandler.has(name, callbackSpy)
      const promise = recordHandler.has(name)
      promise.then(resolveSpy).catch(rejectSpy)
    })

    it('handles success messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTIONS.HEAD_RESPONSE,
        name,
        isError: false,
        version
      })

      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, null, true)

      assert.calledOnce(resolveSpy)
      assert.calledWithExactly(resolveSpy, true)

      assert.notCalled(rejectSpy)
    })

    it('handles record not found error messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTIONS.HEAD_RESPONSE,
        originalAction: RECORD_ACTIONS.HEAD,
        version: -1,
        name
      })

      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, null, false)

      assert.calledOnce(resolveSpy)
      assert.calledWithExactly(resolveSpy, false)

      assert.notCalled(rejectSpy)
    })

    it('handles error messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTIONS.MESSAGE_DENIED,
        originalAction: RECORD_ACTIONS.HEAD,
        name,
        isError: true
      })

      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, RECORD_ACTIONS[RECORD_ACTIONS.MESSAGE_DENIED], null)

      assert.notCalled(resolveSpy)

      assert.calledOnce(rejectSpy)
      assert.calledWithExactly(rejectSpy, RECORD_ACTIONS[RECORD_ACTIONS.MESSAGE_DENIED])
    })
  })

})
