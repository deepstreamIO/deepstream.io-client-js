import { Promise as BBPromise } from 'bluebird'
import { expect } from 'chai'
import { assert, spy } from 'sinon'
import { getServicesMock } from '../mocks'
import { EVENT, CONNECTION_STATE } from '../../src/constants'
import { TOPIC, RECORD_ACTIONS, RecordMessage } from '../../binary-protocol/src/message-constants'

import { WriteAckNotifier } from '../../src/record/write-ack-notifier'

describe('Write Ack Notifier', () => {
  const topic = TOPIC.RECORD
  const action = RECORD_ACTIONS.CREATEANDPATCH_WITH_WRITE_ACK
  const name = 'record'

  let services: any
  let writeAckNotifier: WriteAckNotifier
  let callbackSpy: sinon.SinonSpy

  beforeEach(() => {
    services = getServicesMock()
    writeAckNotifier = new WriteAckNotifier(services)
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
    services.timeoutRegistryMock
      .expects('add')
      .never()

    writeAckNotifier.send({
      topic,
      action,
      name
    }, callbackSpy)
    await BBPromise.delay(1)

    assert.calledOnce(callbackSpy)
    assert.calledWithExactly(callbackSpy, EVENT.CLIENT_OFFLINE)
  })

  it.skip('calls callbacks with error message when connection is lost', () => {

  })

  it('sends correct messages with different correlationsId and register timeouts for each call', () => {
    const messageBody = {
      topic,
      action,
      name,
    }
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(Object.assign({}, messageBody, { correlationId: "1" }))
    services.connectionMock
      .expects('sendMessage')
      .once()
      .withExactArgs(Object.assign({}, messageBody, { correlationId: "2" }))

    writeAckNotifier.send(messageBody, () => {})
    writeAckNotifier.send(messageBody, () => {})
  })


  describe('receiving', async () => {
    const correlationId = "1"

    let message: RecordMessage

    beforeEach(() => {
      message = {
        topic,
        action,
        name
      }
      writeAckNotifier.send(Object.assign({}, message), callbackSpy)
    })

    it('logs error for unknown acknowledgements', () => {
      const msg = {
        topic,
        action,
        name,
        correlationId: "123"
      }
      services.loggerMock
        .expects('error')
        .once()
        .withExactArgs(msg, EVENT.UNSOLICITED_MESSAGE)

      writeAckNotifier.recieve(msg)

      assert.notCalled(callbackSpy)
    })

    it('calls ack callback when server sends ack message', () => {
      writeAckNotifier.recieve({
        topic,
        action: RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT,
        correlationId,
        originalAction: RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK
      })

      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy)
    })

    it('doesn\'t call callback twice', () => {
      const msg = {
        topic,
        action: RECORD_ACTIONS.WRITE_ACKNOWLEDGEMENT,
        correlationId,
        originalAction: RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK
      }
      writeAckNotifier.recieve(msg)
      writeAckNotifier.recieve(msg)

      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy)
    })

    it('calls ack callback with error when server sends error message', async () => {
      const action = RECORD_ACTIONS.MESSAGE_DENIED
      writeAckNotifier.recieve({
        topic,
        action,
        correlationId,
        originalAction: RECORD_ACTIONS.CREATEANDUPDATE_WITH_WRITE_ACK,
        isError: true
      })

      assert.calledOnce(callbackSpy)
      assert.calledWith(callbackSpy, RECORD_ACTIONS[action])
    })

  })

})
