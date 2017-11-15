import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import { spy, assert, match } from 'sinon'
import { getServicesMock, getWriteAckNotifierMock } from '../mocks'
import { EVENT } from '../../src/constants'
import { TOPIC, RECORD_ACTIONS as RECORD_ACTION, RecordMessage } from '../../binary-protocol/src/message-constants'

import { DefaultOptions, Options } from '../../src/client-options'
import { RecordHandler } from '../../src/record/record-handler'
import { WriteAckCallback } from '../../src/record/record-core'
import { RecordSetArguments } from '../../src/util/utils'

describe.only('record setData online', () => {
  const topic = TOPIC.RECORD
  const name = 'testRecord'

  let writeAckNotifierMock: any
  let recordHandler: RecordHandler
  let options: Options
  let services: any
  let handle: Function

  beforeEach(() => {
      services = getServicesMock()
      writeAckNotifierMock = getWriteAckNotifierMock().writeAckNotifierMock

      options = Object.assign({}, DefaultOptions)

      services.connection.isConnected = true
      recordHandler = new RecordHandler(services, options)
      handle = services.getHandle()
  })

  afterEach(() => {
      services.verify()
      writeAckNotifierMock.verify()
  })

  it('sends update messages for entire data changes', () => {
    const data: any = { firstname: 'Wolfram' }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
          topic,
          action: RECORD_ACTION.CREATEANDUPDATE,
          name,
          path: undefined,
          parsedData: data,
          version: -1
      })

    recordHandler.setData(name, data)
  })

  it('sends update messages for path changes ', () => {
    const path = 'lastName'
    const data = 'Hempel'

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
          topic,
          action: RECORD_ACTION.CREATEANDPATCH,
          name,
          path,
          parsedData: data,
          version: -1
      })

    recordHandler.setData(name, path, data)
  })

  it('deletes value when sending undefined for a path', () => {
    const path = 'lastName'
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic,
        action: RECORD_ACTION.ERASE,
        name,
        path,
        version: -1,
        parsedData: undefined
      })

    recordHandler.setData(name, path, undefined)
  })

  it.skip('updates existent local record', () => {

  })

  it('throws error for invalid arguments', () => {
    expect(recordHandler.setData.bind(recordHandler)).to.throw()
    expect(recordHandler.setData.bind(recordHandler, name)).to.throw()

    const data = { some: 'data' }
    expect(recordHandler.setData.bind(recordHandler, undefined, data)).to.throw()
    expect(recordHandler.setData.bind(recordHandler, null, data)).to.throw()
    expect(recordHandler.setData.bind(recordHandler, 123, data)).to.throw()
    expect(recordHandler.setData.bind(recordHandler, {} , data)).to.throw()

    expect(recordHandler.setData.bind(recordHandler, name, undefined)).to.throw()
    expect(recordHandler.setData.bind(recordHandler, name, undefined, () => {})).to.throw()

    expect(recordHandler.setData.bind(recordHandler, name, null)).to.throw()
    expect(recordHandler.setData.bind(recordHandler, name, null, () => {})).to.throw()

    expect(recordHandler.setData.bind(recordHandler, name, '', 'data')).to.throw()

    expect(recordHandler.setData.bind(recordHandler, name, 'Some String')).to.throw()

    expect(recordHandler.setData.bind(recordHandler, name, 100.24)).to.throw()
    expect(recordHandler.setData.bind(recordHandler, name, {}, { not: 'func' })).to.throw()
    expect(recordHandler.setData.bind(recordHandler, name, 'path', 'val', { not: 'func' })).to.throw()
  })

  describe('with ack', () => {
    let data: any
    let path: string
    let cb: WriteAckCallback

    beforeEach(() => {
      path = 'key'
      data = { some: 'value' }
      cb = () => {}
    })

    it('sends update messages for entire data changes with ack callback', () => {
      writeAckNotifierMock
        .expects('send')
        .once()
        .withExactArgs({
          topic,
          action: RECORD_ACTION.CREATEANDUPDATE_WITH_WRITE_ACK,
          name,
          path: undefined,
          parsedData: data,
          version: -1,
        }, cb)

      recordHandler.setData(name, data, cb)
    })

    it('sends update messages for path changes with ack callback', () => {
      writeAckNotifierMock
        .expects('send')
        .once()
        .withExactArgs({
          topic,
          action: RECORD_ACTION.CREATEANDPATCH_WITH_WRITE_ACK,
          name,
          path,
          parsedData: data,
          version: -1
        }, cb)

      recordHandler.setData(name, path, data, cb)
    })

    it('sends update messages for entire data changes with ack promise', () => {
      writeAckNotifierMock
        .expects('send')
        .once()
        .withExactArgs({
          topic,
          action: RECORD_ACTION.CREATEANDUPDATE_WITH_WRITE_ACK,
          name,
          path: undefined,
          parsedData: data,
          version: -1
        }, match.func)

      const promise = recordHandler.setDataWithAck(name, data) as Promise<string>
      expect(promise).is.a('promise')
    })

    it('sends update messages for path changes with ack promise', () => {
      writeAckNotifierMock
        .expects('send')
        .once()
        .withExactArgs({
          topic,
          action: RECORD_ACTION.CREATEANDPATCH_WITH_WRITE_ACK,
          name,
          path,
          parsedData: data,
          version: -1
        }, match.func)

      const promise = recordHandler.setDataWithAck(name, path, data) as Promise<string>
      expect(promise).is.a('promise')
    })

    it('deletes value when sending undefined for a path with ack callback', () => {
      writeAckNotifierMock
        .expects('send')
        .once()
        .withExactArgs({
          topic,
          action: RECORD_ACTION.ERASE_WITH_WRITE_ACK,
          name,
          path,
          version: -1,
          parsedData: undefined
        }, cb)

      recordHandler.setDataWithAck(name, path, undefined, cb)
    })

    it('deletes value when sending undefined for a path with ack promise', () => {
      writeAckNotifierMock
        .expects('send')
        .once()
        .withExactArgs({
          topic,
          action: RECORD_ACTION.ERASE_WITH_WRITE_ACK,
          name,
          path,
          version: -1,
          parsedData: undefined
        }, match.func)

      const promise = recordHandler.setDataWithAck(name, path, undefined) as Promise<string>
      expect(promise).is.a('promise')
    })

  })

  describe('handling acknowledgements', () => {
    const path = 'key'
    const data = { some: 'value' }

    let ackCallback: sinon.SinonSpy
    let ackResolve: sinon.SinonSpy
    let ackReject: sinon.SinonSpy

    beforeEach(() => {
      ackCallback = spy()
      ackResolve = spy()
      ackReject = spy()
    })

    const errorMsg: RecordMessage = {
      topic,
      action: RECORD_ACTION.MESSAGE_DENIED,
      originalAction: RECORD_ACTION.CREATEANDUPDATE_WITH_WRITE_ACK,
      name,
      correlationId: '1',
      isError: true
    }

    it('calls callbackAck with error', async () => {
      recordHandler.setDataWithAck(name, data, ackCallback)

      handle(errorMsg)
      await BBPromise.delay(1)

      assert.calledOnce(ackCallback)
      assert.calledWithExactly(ackCallback, RECORD_ACTION[errorMsg.action])
    })

    it('rejects promise with error', async () => {
      const promise = recordHandler.setDataWithAck(name, path, undefined) as Promise<string>
      promise.then(ackResolve).catch(ackReject)

      handle(errorMsg)
      await BBPromise.delay(1)

      assert.notCalled(ackResolve)

      assert.calledOnce(ackReject)
      assert.calledWithExactly(ackReject, RECORD_ACTION[errorMsg.action])
    })

    const createUpdateAckMsg: RecordMessage = {
      topic,
      action: RECORD_ACTION.WRITE_ACKNOWLEDGEMENT,
      originalAction: RECORD_ACTION.CREATEANDUPDATE_WITH_WRITE_ACK,
      name,
      correlationId: '1'
    }

    it('calls callbackAck for setData without path', async () => {
      recordHandler.setDataWithAck(name, data, ackCallback)

      handle(createUpdateAckMsg)
      await BBPromise.delay(1)

      assert.calledOnce(ackCallback)
      assert.calledWithExactly(ackCallback, null)
    })

    it('resolves promise for setData without path', async () => {
      const promise = recordHandler.setDataWithAck(name, data) as Promise<string>
      promise.then(ackResolve).catch(ackReject)

      handle(createUpdateAckMsg)
      await BBPromise.delay(1)

      assert.calledOnce(ackResolve)
      assert.notCalled(ackReject)
    })

    const createPatchAckMsg: RecordMessage = {
      topic,
      action: RECORD_ACTION.WRITE_ACKNOWLEDGEMENT,
      originalAction: RECORD_ACTION.CREATEANDPATCH_WITH_WRITE_ACK,
      name,
      correlationId: '1'
    }

    it('calls callbackAck for setData with path', async () => {
      recordHandler.setDataWithAck(name, path, data, ackCallback)

      handle(createPatchAckMsg)
      await BBPromise.delay(1)

      assert.calledOnce(ackCallback)
      assert.calledWithExactly(ackCallback, null)
    })

    it('resolves promise for setData with path', async () => {
      const promise = recordHandler.setDataWithAck(name, path, data) as Promise<string>
      promise.then(ackResolve).catch(ackReject)

      handle(createPatchAckMsg)
      await BBPromise.delay(1)

      assert.calledOnce(ackResolve)
      assert.notCalled(ackReject)
    })

    const eraseAckMsg: RecordMessage = {
      topic,
      action: RECORD_ACTION.WRITE_ACKNOWLEDGEMENT,
      originalAction: RECORD_ACTION.ERASE_WITH_WRITE_ACK,
      name,
      correlationId: '1'
    }

    it('calls callbackAck for setData deleting values', async () => {
      recordHandler.setDataWithAck(name, path, undefined, ackCallback)

      handle(eraseAckMsg)
      await BBPromise.delay(1)

      assert.calledOnce(ackCallback)
      assert.calledWithExactly(ackCallback, null)
    })

    it('resolves promise for setData deleting values', async () => {
      const promise = recordHandler.setDataWithAck(name, path, undefined) as Promise<string>
      promise.then(ackResolve).catch(ackReject)

      handle(eraseAckMsg)
      await BBPromise.delay(1)

      assert.calledOnce(ackResolve)
      assert.notCalled(ackReject)
    })

  })
})
