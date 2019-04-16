import { Promise as BBPromise } from 'bluebird'
import { assert, spy } from 'sinon'
import { getServicesMock } from '../test/mocks'
import { EVENT } from '../constants'
import { TOPIC, RECORD_ACTIONS as RA, RecordMessage } from '../../binary-protocol/src/message-constants'

import { WriteAcknowledgementService } from './write-ack-service'

describe('Write Ack Notifier', () => {
  const topic = TOPIC.RECORD
  const action = RA.CREATEANDPATCH
  const ackAction = RA.CREATEANDPATCH_WITH_WRITE_ACK
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
      .withExactArgs(Object.assign({}, messageBody, { action: ackAction, correlationId: '1' }))
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(Object.assign({}, messageBody, { action: ackAction, correlationId: '2' }))

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

      writeAckService.recieve(msg)
      await BBPromise.delay(1)

      assert.notCalled(callbackSpy)
    })

    it('calls ack callback when server sends ack message', async () => {
      writeAckService.recieve({
        topic,
        action: RA.WRITE_ACKNOWLEDGEMENT,
        correlationId,
        originalAction: RA.CREATEANDUPDATE_WITH_WRITE_ACK
      })
      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy)
    })

    it('doesn\'t call callback twice', async () => {
      const msg = {
        topic,
        action: RA.WRITE_ACKNOWLEDGEMENT,
        correlationId,
        originalAction: RA.CREATEANDUPDATE_WITH_WRITE_ACK
      }
      writeAckService.recieve(msg)
      writeAckService.recieve(msg)
      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy)
    })

    it('calls ack callback with error when server sends error message', async () => {
      const errorAction = RA.MESSAGE_DENIED
      writeAckService.recieve({
        topic,
        action: errorAction,
        correlationId,
        originalAction: RA.CREATEANDUPDATE_WITH_WRITE_ACK,
        isError: true
      })
      await BBPromise.delay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy, RA[errorAction])
    })

  })

})
