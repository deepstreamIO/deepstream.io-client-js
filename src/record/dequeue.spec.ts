// tslint:disable:no-unused-expression
import { expect } from 'chai'
import { spy, match } from 'sinon'
import { getServicesMock, getRecordServices } from '../test/mocks'

import { DefaultOptions, Options } from '../client-options'
import { RecordCore } from './record-core'
import { Dequeue } from './dequeue'
import { TOPIC, RECORD_ACTION } from '../constants'

describe('Dequeue', () => {
  const name = 'someDq'
  let whenCompleted: sinon.SinonSpy
  let services: any
  let recordServices: any
  let options: Options
  let recordCore: RecordCore<Dequeue>
  let dq: Dequeue

  beforeEach(function () {
    whenCompleted = spy()
    services = getServicesMock()
    recordServices = getRecordServices(services)
    options = { ...DefaultOptions, recordDiscardTimeout: 20, recordReadTimeout: 20, subscriptionInterval: -1 }
    services.connection.isConnected = true

    // Swallow the SUBSCRIBECREATEANDREAD and any storage gets that happen on construction.
    services.connectionMock.expects('sendMessage').atLeast(0)
    services.storageMock.expects('get').atLeast(0).callsArgWith(1, name, -1, null)

    recordCore = new RecordCore<Dequeue>(name, services, options, recordServices, whenCompleted)
    recordCore.addReference(this)
    dq = new Dequeue(recordCore)

    // Land an initial READ_RESPONSE for an empty dequeue at version 1.
    recordServices.readRegistry.recieve({
      topic: TOPIC.RECORD,
      action: RECORD_ACTION.READ_RESPONSE,
      name,
      parsedData: { h: { p: '', n: '' } },
      version: 1
    })
  })

  afterEach(() => {
    services.verify()
  })

  function seedNonEmpty () {
    // Apply an UPDATE bringing the dq to one entry 'A' at node key '0'.
    recordCore.applyUpdate({
      topic: TOPIC.RECORD,
      action: RECORD_ACTION.UPDATE,
      name,
      version: 2,
      parsedData: {
        h: { n: '0', p: '0' },
        0: { d: 'A', p: '', n: '' }
      }
    } as any)
  }

  it('unshift on a non-empty dequeue sends ONE PATCH_MULTI message with all linked-list updates', () => {
    seedNonEmpty()

    const expectedPatches = [
      { path: '1', data: { d: 'B', p: '', n: '0' } },
      { path: '0.p', data: '1' },
      { path: 'h.n', data: '1' }
    ]

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs({
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.PATCH_MULTI,
        name,
        version: 3,
        parsedData: expectedPatches
      })

    dq.unshift('B')
    expect(dq.getEntries()).to.deep.equal(['B', 'A'])
  })

  it('push on a non-empty dequeue sends ONE PATCH_MULTI message', () => {
    seedNonEmpty()

    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(match({
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.PATCH_MULTI,
        name,
        version: 3
      }))

    dq.push('B')
    expect(dq.getEntries()).to.deep.equal(['A', 'B'])
  })

  it('unshift on an empty dequeue uses setEntries (single UPDATE, not PATCH_MULTI)', () => {
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(match({
        topic: TOPIC.RECORD,
        action: RECORD_ACTION.UPDATE,
        name,
        version: 2
      }))

    dq.unshift('A')
    expect(dq.getEntries()).to.deep.equal(['A'])
  })

  it('unshiftWithAck resolves on successful write ack', async () => {
    seedNonEmpty()

    recordServices.writeAckServiceMock
      .expects('send')
      .once()
      .callsArgWith(1, null, name)

    await dq.unshiftWithAck('B')
    expect(dq.getEntries()).to.deep.equal(['B', 'A'])
  })

  it('unshiftWithAck rejects when the server returns an error', async () => {
    seedNonEmpty()

    recordServices.writeAckServiceMock
      .expects('send')
      .once()
      .callsArgWith(1, 'INVALID_MESSAGE_DATA', name)

    let caught: any = null
    try {
      await dq.unshiftWithAck('B')
    } catch (err) {
      caught = err
    }
    expect(caught).to.equal('INVALID_MESSAGE_DATA')
  })

  it('bumps the record version exactly once per unshift', () => {
    seedNonEmpty()
    expect(dq.version).to.equal(2)

    services.connectionMock.expects('sendMessage').once()

    dq.unshift('B')
    expect(dq.version).to.equal(3)
  })

  it('applies an inbound PATCH_MULTI unshift broadcast by replaying the ops', () => {
    seedNonEmpty()

    recordCore.applyUpdate({
      topic: TOPIC.RECORD,
      action: RECORD_ACTION.PATCH_MULTI,
      name,
      version: 3,
      parsedData: [
        { path: '1', data: { d: 'B', p: '', n: '0' } },
        { path: '0.p', data: '1' },
        { path: 'h.n', data: '1' }
      ]
    } as any)

    expect(dq.getEntries()).to.deep.equal(['B', 'A'])
    expect(dq.version).to.equal(3)
  })
})
