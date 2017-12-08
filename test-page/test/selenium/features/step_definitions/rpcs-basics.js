/* eslint-disable new-cap */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const S = require('./constants/selectors')
const TIME = require('./constants/time-intervals')

function provideRpc (clientId, rpcName) {
  const RPC_COMPONENT = S
    .COMPONENTS
    .RPCS
    .RELATIVE_ROOT
    .replace('{clientId}', clientId)

  const RPC_PROVIDE_BUTTON = `${RPC_COMPONENT} ${S.COMPONENTS.RPCS.PROVIDE_BUTTON.replace('{rpcName}', rpcName)}`
  const RPC_MAKE_BUTTON = `${RPC_COMPONENT} ${S.COMPONENTS.RPCS.MAKE_BUTTON.replace('{rpcName}', rpcName)}`
  const RPC_MAKE_DATA_FIELD = `${RPC_COMPONENT} ${S.COMPONENTS.RPCS.DATA_FIELD.replace('{rpcName}', rpcName)}`

  client
    .waitForElementVisible(RPC_COMPONENT, TIME.TINY)
    .waitForElementVisible(RPC_PROVIDE_BUTTON, TIME.TINY)
    .click(RPC_PROVIDE_BUTTON)
    .pause(TIME.TINY)

  client.expect
    .element(RPC_MAKE_BUTTON)
    .to.be.present

  client.expect
    .element(RPC_MAKE_DATA_FIELD)
    .to.be.present
}

function makeRpcWithData (clientId, rpcName, rpcData) {
  const RPC_COMPONENT = S
    .COMPONENTS
    .RPCS
    .RELATIVE_ROOT
    .replace('{clientId}', clientId)

  const RPC_MAKE_BUTTON = `${RPC_COMPONENT} ${S.COMPONENTS.RPCS.MAKE_BUTTON.replace('{rpcName}', rpcName)}`
  const RPC_DATA_FIELD = `${RPC_COMPONENT} ${S.COMPONENTS.RPCS.DATA_FIELD.replace('{rpcName}', rpcName)}`

  client
    .waitForElementVisible(RPC_DATA_FIELD, TIME.TINY)
    .setValue(RPC_DATA_FIELD, rpcData)

  client
    .waitForElementVisible(RPC_MAKE_BUTTON, TIME.TINY)
    .click(RPC_MAKE_BUTTON)
    .pause(TIME.TINY)
}

function receiveRpcResult (clientId, rpcName, rpcResult) {
  const RPC_COMPONENT = S
    .COMPONENTS
    .RPCS
    .RELATIVE_ROOT
    .replace('{clientId}', clientId)

  const RPC_RESPONSE_FIELD = `${RPC_COMPONENT} ${S.COMPONENTS.RPCS.RESPONSE_FIELD.replace('{rpcName}', rpcName)}`

  client.expect
    .element(RPC_RESPONSE_FIELD)
    .to.be.visible

  client.expect
    .element(RPC_RESPONSE_FIELD)
    .text.to.contain(rpcResult)
}

defineSupportCode(({ Given, When, Then }) => {

  Given('I fill the data field with "{data}" of rpc "{rpcName}"', (data, rpcName) => {
    const RPC_DATA_FIELD = S
      .COMPONENTS
      .RPCS
      .DATA_FIELD
      .replace('{rpcName}', rpcName)

    return client
      .waitForElementVisible(RPC_DATA_FIELD, TIME.TINY)
      .setValue(RPC_DATA_FIELD, data)
  })

  When('I make the rpc "{rpcName}"', (rpcName) => {
    const RPC_MAKE_BUTTON = S
      .COMPONENTS
      .RPCS
      .MAKE_BUTTON
      .replace('{rpcName}', rpcName)

    return client
      .waitForElementVisible(RPC_MAKE_BUTTON, TIME.TINY)
      .click(RPC_MAKE_BUTTON)
      .pause(TIME.TINY)
  })

  Then('I receive the response "{response}" of rpc "{rpcName}"', (response, rpcName) => {
    const RPC_RESPONSE_FIELD = S
      .COMPONENTS
      .RPCS
      .RESPONSE_FIELD
      .replace('{rpcName}', rpcName)

    client.expect
      .element(RPC_RESPONSE_FIELD)
      .to.be.visible

    client.expect
      .element(RPC_RESPONSE_FIELD)
      .text.to.contain(response)
  })

  When('Client with id "{clientId}" provides rpc "{rpcName}"', (clientId, rpcName) => {
    provideRpc(clientId, rpcName)

    return client
  })

  When('Client with id "{clientId}" tries to provide rpc "{rpcName}" and finds it already provided', (clientId, rpcName) => {
    provideRpc(clientId, rpcName)

    // const RPC_COMPONENT = S
    //   .COMPONENTS
    //   .RPCS
    //   .RELATIVE_ROOT
    //   .replace('{clientId}', clientId)

    // const RPC_LABEL = `${RPC_COMPONENT} ${S.COMPONENTS.RPCS.RPC_LABEL.replace(/{rpcName}/g, rpcName)}`

    // client.expect
    //   .element(RPC_LABEL)
    //   .attribute('data-rpc-status')
    //   .to.equal('RPC_ALREADY_PROVIDED')

    return client
  })

  When('Client with id "{clientId}" makes rpc "{rpcName}" with arguments "{rpcData}"', (clientId, rpcName, rpcData) => {
    makeRpcWithData(clientId, rpcName, rpcData)
    return client
  })

  Then('Client with id "{clientId}" receives results "{rpcResult}" from rpc "{rpcName}"', (clientId, rpcResult, rpcName) => {
    receiveRpcResult(clientId, rpcName, rpcResult)
    return client
  })
})
