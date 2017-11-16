import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import { assert, spy } from 'sinon'
import { getServicesMock } from '../mocks'
import { EVENT, CONNECTION_STATE } from '../../src/constants'
import { TOPIC, RECORD_ACTIONS, RecordMessage } from '../../binary-protocol/src/message-constants'

import { WriteAcknowledgementService } from '../../src/record/write-ack-service'

describe('Write Ack Notifier', () => {
  const topic = TOPIC.RECORD
  const action = RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK
  const name = 'record'

  let services: any
  let writeAckService: WriteAcknowledgementService
  let callbackSpy: sinon.SinonSpy

  beforeEach(() => {
    services = getServicesMock()
    writeAckService = new WriteAcknowledgementService(services)
    callbackSpy = spy()
  })

  afterEach(() => {
    services.verify()
  })

  it('cant\'t send request when client is offline', async () => {
    services.connection.isConnected = false
    services.connectionMock
      .expects('sendMessage')
      .never()

    writeAckService.send({
      topic,
      action,
      name
    }, callbackSpy)
    await BBPromise.delay(1)

    assert.calledOnce(callbackSpy)
    assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)
  })

  it('calls callbacks with error message when connection is lost', async () => {
    const messageBody = {
      topic,
      action,
      name
    }
    writeAckService.send(messageBody, callbackSpy)
    writeAckService.send(messageBody, callbackSpy)

    services.simulateConnectionLost()
    await BBPromise.delay(1)

    assert.calledTwice(callbackSpy)
    assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)
  })

  it('sends correct messages with different correlationsId for each call', () => {
    const messageBody = {
      topic,
      action,
      name,
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(Object.assign({}, messageBody, { correlationId: '1' }))
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(Object.assign({}, messageBody, { correlationId: '2' }))

    writeAckService.send(messageBody, () => {})
    writeAckService.send(messageBody, () => {})
  })

  describe('receiving', () => {
    const correlationId = '1'

    let message: RecordMessage

    beforeEach(() => {
      message = {
        topic,
        action,
        name
      }
      writeAckService.send(Object.assign({}, message), callbackSpy)
    })

    it('logs error for unknown acknowledgements', async () => {
      const msg = {
        topic,
        action,
        name,
        correlationId: '123'
      }

      const processed = writeAckService.recieve(msg)
      await BBPromise.delay(1)

      assert.notCalled(callbackSpy)
      expect(processed).to.be.false
    })

    it('calls ack callback when server sends ack message', async () => {
      const processed = writeAckService.recieve({
        topic,
        action: RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT,
        correlationId,
        originalAction: RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK
      })
      await BBPromise.delay(1)

      expect(processed).to.be.true
      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy)
    })

    it('doesn\'t call callback twice', async () => {
      const msg = {
        topic,
        action: RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT,
        correlationId,
        originalAction: RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK
      }
      const processed1 = writeAckService.recieve(msg)
      const processed2 = writeAckService.recieve(msg)
      await BBPromise.delay(1)

      expect(processed1).to.be.true
      expect(processed2).to.be.false
      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy)
    })

    it('calls ack callback with error when server sends error message', async () => {
      const errorAction = RECORD_ACTIONS.MESSAGE_DENIED
      const processed = writeAckService.recieve({
        topic,
        action: errorAction,
        correlationId,
        originalAction: RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK,
        isError: true
      })
      await BBPromise.delay(1)

      expect(processed).to.be.true
      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy, RECORD_ACTIONS[errorAction])
    })

  })

})
