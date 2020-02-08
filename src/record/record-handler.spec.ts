import { expect } from 'chai'
import { assert, spy, match } from 'sinon'
import { getServicesMock, getRecordServices } from '../test/mocks'
import { RecordHandler } from './record-handler'

import { DefaultOptions } from '../client-options'
import { WriteAckCallback } from './record-core'
import { fail } from 'assert'
import { TOPIC, RECORD_ACTION, RecordData, RecordMessage } from '../constants'
import { PromiseDelay } from '../util/utils'

describe('Record handler', () => {
  const name = 'recordA'
  let options = Object.assign({}, DefaultOptions)

  let services: any
  let recordServices: any
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
    recordServices = getRecordServices(services)

    recordHandler = new RecordHandler(services, options, recordServices)
    handle = services.getHandle()
  })

  afterEach(() => {
    services.verify()
    recordServices.verify()
  })

  it('validates on has, head and snapshot', () => {
    expect(recordHandler.has.bind(recordHandler, '')).to.throw()
    expect(recordHandler.has.bind(recordHandler, '', () => {})).to.throw()

    expect(recordHandler.head.bind(recordHandler, '')).to.throw()
    expect(recordHandler.head.bind(recordHandler, '', () => {})).to.throw()

    expect(recordHandler.snapshot.bind(recordHandler, '')).to.throw()
    expect(recordHandler.snapshot.bind(recordHandler, '', () => {})).to.throw()
  })

  it('snapshots record remotely using callback and promise style', async () => {
    recordServices.readRegistryMock
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
        action: RECORD_ACTION.READ_RESPONSE,
        name,
        isError: false,
        parsedData: data
      })

      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, null, data)

      assert.calledOnce(resolveSpy)
      assert.calledWithExactly(resolveSpy, data)

      assert.notCalled(rejectSpy)
    })

    it('handles error messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.MESSAGE_DENIED,
        originalAction: RECORD_ACTION.READ,
        name,
        isError: true
      })

      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED], undefined)

      assert.notCalled(resolveSpy)

      assert.calledOnce(rejectSpy)
      assert.calledWithExactly(rejectSpy, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED])
    })
  })

  it('queries for the record version remotely using callback and promise', () => {
    recordServices.headRegistryMock
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
        action: RECORD_ACTION.HEAD_RESPONSE,
        name,
        isError: false,
        version
      })

      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, null, version)

      assert.calledOnce(resolveSpy)
      assert.calledWithExactly(resolveSpy, version)

      assert.notCalled(rejectSpy)
    })

    it('handles error messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.MESSAGE_DENIED,
        originalAction: RECORD_ACTION.HEAD,
        name,
        isError: true
      })

      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED], undefined)

      assert.notCalled(resolveSpy)

      assert.calledOnce(rejectSpy)
      assert.calledWithExactly(rejectSpy, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED])
    })
  })

  it('queries for record exists remotely using callback and promise', () => {
    recordServices.headRegistryMock
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
        action: RECORD_ACTION.HEAD_RESPONSE,
        name,
        isError: false,
        version
      })

      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, null, true)

      assert.calledOnce(resolveSpy)
      assert.calledWithExactly(resolveSpy, true)

      assert.notCalled(rejectSpy)
    })

    it('handles record not found error messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.HEAD_RESPONSE,
        originalAction: RECORD_ACTION.HEAD,
        version: -1,
        name
      })

      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, null, false)

      assert.calledOnce(resolveSpy)
      assert.calledWithExactly(resolveSpy, false)

      assert.notCalled(rejectSpy)
    })

    it('handles error messages', async () => {
      handle({
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.MESSAGE_DENIED,
        originalAction: RECORD_ACTION.HEAD,
        name,
        isError: true
      })

      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWithExactly(callbackSpy, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED], null)

      assert.notCalled(resolveSpy)

      assert.calledOnce(rejectSpy)
      assert.calledWithExactly(rejectSpy, RECORD_ACTION[RECORD_ACTION.MESSAGE_DENIED])
    })
  })

  describe('record setData online', () => {
      const topic = TOPIC.RECORD

      beforeEach(() => {
        services = getServicesMock()
        recordServices = getRecordServices(services)

        options = Object.assign({}, DefaultOptions)

        services.connection.isConnected = true
        recordHandler = new RecordHandler(services, options, recordServices)
        handle = services.getHandle()
      })

      afterEach(() => {
        services.verify()
        recordServices.verify()
      })

      it('sends update messages for entire data changes', () => {
        const data: RecordData = { firstname: 'Wolfram' }
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

      it('deletes value when sending undefined for a value', () => {
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

      it('throws error for invalid arguments', () => {
        expect(recordHandler.setData.bind(recordHandler)).to.throw()
        expect(recordHandler.setData.bind(recordHandler, name)).to.throw()
        // @ts-ignore
        expect(recordHandler.setData.bind(recordHandler, name, undefined)).to.throw()
        // @ts-ignore
        expect(recordHandler.setData.bind(recordHandler, name, undefined, () => {})).to.throw()

        expect(recordHandler.setData.bind(recordHandler, name, null)).to.throw()
        expect(recordHandler.setData.bind(recordHandler, name, null, () => {})).to.throw()

        expect(recordHandler.setData.bind(recordHandler, name, '', 'data')).to.throw()

        expect(recordHandler.setData.bind(recordHandler, name, 'Some String')).to.throw()

        // @ts-ignore
        expect(recordHandler.setData.bind(recordHandler, name, 100.24)).to.throw()
        expect(recordHandler.setData.bind(recordHandler, name, {}, { not: 'func' })).to.throw()
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
          recordServices.writeAckServiceMock
              .expects('send')
              .once()
              .withExactArgs({
                topic,
                action: RECORD_ACTION.CREATEANDUPDATE,
                name,
                path: undefined,
                parsedData: data,
                version: -1,
              }, cb)

          recordHandler.setData(name, data, cb)
        })

        it('sends update messages for path changes with ack callback', () => {
          recordServices.writeAckServiceMock
              .expects('send')
              .once()
              .withExactArgs({
                topic,
                action: RECORD_ACTION.CREATEANDPATCH,
                name,
                path,
                parsedData: data,
                version: -1
              }, cb)

          recordHandler.setData(name, path, data, cb)
        })

        it('sends update messages for entire data changes with ack promise', () => {
          recordServices.writeAckServiceMock
              .expects('send')
              .once()
              .withExactArgs({
                topic,
                action: RECORD_ACTION.CREATEANDUPDATE,
                name,
                path: undefined,
                parsedData: data,
                version: -1
              }, match.func)

          const promise = recordHandler.setDataWithAck(name, data) as Promise<string>
          expect(promise).is.a('promise')
        })

        it('sends update messages for path changes with ack promise', () => {
          recordServices.writeAckServiceMock
              .expects('send')
              .once()
              .withExactArgs({
                topic,
                action: RECORD_ACTION.CREATEANDPATCH,
                name,
                path,
                parsedData: data,
                version: -1
              }, match.func)

          const promise = recordHandler.setDataWithAck(name, path, data) as Promise<string>
          expect(promise).is.a('promise')
        })

        it('deletes value when sending undefined for a path with ack callback', () => {
          recordServices.writeAckServiceMock
              .expects('send')
              .once()
              .withExactArgs({
                topic,
                action: RECORD_ACTION.ERASE,
                name,
                path,
                version: -1,
                parsedData: undefined
              }, cb)

          recordHandler.setDataWithAck(name, path, undefined, cb)
        })

        it('deletes value when sending undefined for a path with ack promise', () => {
          recordServices.writeAckServiceMock
              .expects('send')
              .once()
              .withExactArgs({
                topic,
                action: RECORD_ACTION.ERASE,
                name,
                path,
                version: -1,
                parsedData: undefined
              }, match.func)

          const promise = recordHandler.setDataWithAck(name, path, undefined) as Promise<string>
          expect(promise).is.a('promise')
        })

      })

      describe ('clearing storage', () => {
        it ('calls callback with nothing when successful', done => {
          services.storageMock
            .expects('reset')
            .once()
            .callsArgWith(0, null)

          recordHandler.clearOfflineStorage(error => {
            expect(error).to.equal(null)
            done()
          })
        })

        it ('calls callback with error when unsuccessful', done => {
          services.storageMock
            .expects('reset')
            .once()
            .callsArgWith(0, 'failed')

          recordHandler.clearOfflineStorage(error => {
            expect(error).to.equal('failed')
            done()
          })
        })

        it ('returns promise that resolves when successful', async () => {
          services.storageMock
            .expects('reset')
            .once()
            .callsArgWith(0, null)

          await recordHandler.clearOfflineStorage()
        })

        it ('returns promise that rejects with error when unsuccessful', async () => {
          services.storageMock
            .expects('reset')
            .once()
            .callsArgWith(0, 'failed')

          try {
            await recordHandler.clearOfflineStorage()
          } catch (e) {
            expect(e).to.equal('failed')
            return
          }

          fail('The promise should have failed')
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
          originalAction: RECORD_ACTION.CREATEANDUPDATE,
          name,
          correlationId: '1',
          isError: true,
          isWriteAck: true
        }

        it('calls callbackAck with error', async () => {
          recordHandler.setDataWithAck(name, data, ackCallback)

          handle(errorMsg)
          await PromiseDelay(1)

          assert.calledOnce(ackCallback)
          assert.calledWithExactly(ackCallback, RECORD_ACTION[errorMsg.action], name)
        })

        it('rejects promise with error', async () => {
          const promise = recordHandler.setDataWithAck(name, path, undefined) as Promise<string>
          promise.then(ackResolve).catch(ackReject)

          handle(errorMsg)
          await PromiseDelay(1)

          assert.notCalled(ackResolve)

          assert.calledOnce(ackReject)
          assert.calledWithExactly(ackReject, RECORD_ACTION[errorMsg.action])
        })

        const createUpdateAckMsg: RecordMessage = {
          topic,
          action: RECORD_ACTION.WRITE_ACKNOWLEDGEMENT,
          originalAction: RECORD_ACTION.CREATEANDUPDATE,
          name,
          correlationId: '1',
          isWriteAck: true
        }

        it('calls callbackAck for setData without path', async () => {
          recordHandler.setDataWithAck(name, data, ackCallback)

          handle(createUpdateAckMsg)
          await PromiseDelay(1)

          assert.calledOnce(ackCallback)
          assert.calledWithExactly(ackCallback, null, name)
        })

        it('resolves promise for setData without path', async () => {
          const promise = recordHandler.setDataWithAck(name, data) as Promise<string>
          promise.then(ackResolve).catch(ackReject)

          handle(createUpdateAckMsg)
          await PromiseDelay(1)

          assert.calledOnce(ackResolve)
          assert.notCalled(ackReject)
        })

        const createPatchAckMsg: RecordMessage = {
          topic,
          action: RECORD_ACTION.WRITE_ACKNOWLEDGEMENT,
          originalAction: RECORD_ACTION.CREATEANDPATCH,
          name,
          correlationId: '1',
          isWriteAck: true
        }

        it('calls callbackAck for setData with path', async () => {
          recordHandler.setDataWithAck(name, path, data, ackCallback)

          handle(createPatchAckMsg)
          await PromiseDelay(1)

          assert.calledOnce(ackCallback)
          assert.calledWithExactly(ackCallback, null, name)
        })

        it('resolves promise for setData with path', async () => {
          const promise = recordHandler.setDataWithAck(name, path, data) as Promise<string>
          promise.then(ackResolve).catch(ackReject)

          handle(createPatchAckMsg)
          await PromiseDelay(1)

          assert.calledOnce(ackResolve)
          assert.notCalled(ackReject)
        })

        const eraseAckMsg: RecordMessage = {
          topic,
          action: RECORD_ACTION.WRITE_ACKNOWLEDGEMENT,
          originalAction: RECORD_ACTION.ERASE,
          name,
          correlationId: '1',
          isWriteAck: true
        }

        it('calls callbackAck for setData deleting values', async () => {
          recordHandler.setDataWithAck(name, path, undefined, ackCallback)

          handle(eraseAckMsg)
          await PromiseDelay(1)

          assert.calledOnce(ackCallback)
          assert.calledWithExactly(ackCallback, null, name)
        })

        it('resolves promise for setData deleting values', async () => {
          const promise = recordHandler.setDataWithAck(name, path, undefined) as Promise<string>
          promise.then(ackResolve).catch(ackReject)

          handle(eraseAckMsg)
          await PromiseDelay(1)

          assert.calledOnce(ackResolve)
          assert.notCalled(ackReject)
        })

      })
  })
})
