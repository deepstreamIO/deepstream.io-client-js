import { assert, spy } from 'sinon'
import { getServicesMock } from '../test/mocks'
import { EVENT, TOPIC, RECORD_ACTION, RecordMessage } from '../constants'

import { WriteAcknowledgementService } from './write-ack-service'
import { PromiseDelay } from '../util/utils'

describe('Write Ack Notifier', () => {
  const topic = TOPIC.RECORD
  const action = RECORD_ACTION.CREATEANDPATCH
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
    await PromiseDelay(1)

    assert.calledOnce(callbackSpy)
    assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE, name)
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
    await PromiseDelay(1)

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
      .withExactArgs(Object.assign({}, messageBody, { action, correlationId: '1', isWriteAck: true }))
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(Object.assign({}, messageBody, { action, correlationId: '2', isWriteAck: true  }))

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
      await PromiseDelay(1)

      assert.notCalled(callbackSpy)
    })

    it('calls ack callback when server sends ack message', async () => {
      writeAckService.recieve({
        topic,
        action: RECORD_ACTION.WRITE_ACKNOWLEDGEMENT,
        correlationId,
        originalAction: RECORD_ACTION.CREATEANDUPDATE,
        isWriteAck: true
      })
      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy)
    })

    it('doesn\'t call callback twice', async () => {
      const msg = {
        topic,
        action: RECORD_ACTION.WRITE_ACKNOWLEDGEMENT,
        correlationId,
        originalAction: RECORD_ACTION.CREATEANDUPDATE,
        isWriteAck: true
      }
      writeAckService.recieve(msg)
      writeAckService.recieve(msg)
      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy)
    })

    it('calls ack callback with error when server sends error message', async () => {
      const errorAction = RECORD_ACTION.MESSAGE_DENIED
      writeAckService.recieve({
        topic,
        action: errorAction,
        correlationId,
        originalAction: RECORD_ACTION.CREATEANDUPDATE,
        isAck: true,
        isError: true
      })
      await PromiseDelay(1)

      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy, RECORD_ACTION[errorAction])
    })

  })

})
