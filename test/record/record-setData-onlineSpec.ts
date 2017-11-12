// import { expect } from 'chai'
// import { spy, assert } from 'sinon'
// import { getServicesMock } from '../mocks'
// import { EVENT } from '../../src/constants'
// import { TOPIC, RECORD_ACTIONS as RECORD_ACTION } from '../../binary-protocol/src/message-constants'

// import { DefaultOptions, Options } from '../../src/client-options'
// import { RecordHandler } from '../../src/record/record-handler'
// import { RecordSetArguments } from '../../src/util/utils'

// describe.skip('record setData online', () => {
//   let recordHandler: RecordHandler
//   let options: Options
//   let services: any
//   let name: string

//   beforeEach(() => {
//       services = getServicesMock()
//       options = Object.assign({}, DefaultOptions)
//       name = 'testRecord'

//       services.connection.isConnected = true
//       recordHandler = new RecordHandler(services, options)
//   })

//   afterEach(() => {
//       services.verify()
//   })

//   it('sends update messages for entire data changes', () => {
//     const data: any = { firstname: 'Wolfram' }
//     services.connectionMock
//       .expects('sendMessage')
//       .once()
//       .withExactArgs({
//           topic: TOPIC.RECORD,
//           action: RECORD_ACTION.CREATEANDUPDATE,
//           name,
//           parsedData: data,
//           version: -1
//       })

//     recordHandler.setData(name, data)
//   })

//   it('sends update messages for path changes ', () => {
//     const path = 'lastName'
//     const data = 'Hempel'

//     services.connectionMock
//       .expects('sendMessage')
//       .once()
//       .withExactArgs({
//           topic: TOPIC.RECORD,
//           action: RECORD_ACTION.CREATEANDPATCH,
//           name,
//           path,
//           parsedData: data,
//           version: -1
//       })

//     recordHandler.setData(name, path, data)
//   })

//   it('deletes value when sending undefined', () => {
//     const path = 'lastName'
//     const data = undefined

//     services.connectionMock
//       .expects('sendMessage')
//       .once()
//       .withExactArgs({
//           topic: TOPIC.RECORD,
//           action: RECORD_ACTION.ERASE,
//           name,
//           path,
//           version: -1
//       })

//     recordHandler.setData(name, path, data)
//   })

//   it('throws error for invalid arguments', () => {
//     expect(recordHandler.setData.bind(recordHandler)).to.throw()
//     expect(recordHandler.setData.bind(recordHandler, name)).to.throw()

//     const data = { some: 'data' }
//     expect(recordHandler.setData.bind(recordHandler, undefined, data)).to.throw()
//     expect(recordHandler.setData.bind(recordHandler, null, data)).to.throw()
//     expect(recordHandler.setData.bind(recordHandler, 123, data)).to.throw()
//     expect(recordHandler.setData.bind(recordHandler, {} , data)).to.throw()

//     expect(recordHandler.setData.bind(recordHandler, name, undefined)).to.throw()
//     expect(recordHandler.setData.bind(recordHandler, name, undefined, () => {})).to.throw()

//     expect(recordHandler.setData.bind(recordHandler, name, null)).to.throw()
//     expect(recordHandler.setData.bind(recordHandler, name, null, () => {})).to.throw()

//     expect(recordHandler.setData.bind(recordHandler, name, '', 'data')).to.throw()

//     expect(recordHandler.setData.bind(recordHandler, name, 'Some String')).to.throw()

//     expect(recordHandler.setData.bind(recordHandler, name, 100.24)).to.throw()
//     expect(recordHandler.setData.bind(recordHandler, name, {}, { not: 'func' })).to.throw()
//     expect(recordHandler.setData.bind(recordHandler, name, 'path', 'val', { not: 'func' })).to.throw()
//   })

//   it('sends update messages for entire data changes with callback', () => {
//     const data = { firstname: 'Wolfram' }
//     services.connectionMock
//       .expects('sendMessage')
//       .once()
//       .withExactArgs({
//         topic: TOPIC.RECORD,
//         action: RECORD_ACTION.CREATEANDUPDATE_WITH_WRITE_ACK,
//         name,
//         parsedData: data,
//         version: -1
//       })

//     recordHandler.setData(name, data, () => {})
//   })

//   it('sends update messages for path changes with callback', () => {
//     const path = 'lastName'
//     const data = 'Hempel'

//     services.connectionMock
//       .expects('sendMessage')
//       .once()
//       .withExactArgs({
//         topic: TOPIC.RECORD,
//         action: RECORD_ACTION.CREATEANDPATCH_WITH_WRITE_ACK,
//         name,
//         path,
//         parsedData: data,
//         version: -1
//       })

//     recordHandler.setData(name, path, data, () => {})
//   })

//   describe('with ack', () => {

//   })

// })
