/* eslint-disable new-cap */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const S = require('./constants/selectors')
const TIME = require('./constants/time-intervals')

function subscribe (clientId, eventName) {
  const EVENTS_COMPONENT = S
    .COMPONENTS
    .EVENTS
    .RELATIVE_ROOT
    .replace('{clientId}', clientId)

  const EVENT_NAME_FIELD = `${EVENTS_COMPONENT} ${S.COMPONENTS.EVENTS.SUBSCRIBE.EVENT_NAME_FIELD}`
  const SUBSCRIBE_SUBMIT_BUTTON = `${EVENTS_COMPONENT} ${S.COMPONENTS.EVENTS.SUBSCRIBE.SUBMIT_BUTTON}`

  client
    .setValue(EVENT_NAME_FIELD, eventName)
    .click(SUBSCRIBE_SUBMIT_BUTTON)
    .pause(TIME.TINY)
}

function receiveEventWithData (clientId, eventName, eventData) {
  const EVENTS_COMPONENT = S
    .COMPONENTS
    .EVENTS
    .RELATIVE_ROOT
    .replace('{clientId}', clientId)

  const SUBSCRIBED_EVENT_LABEL = S
  .COMPONENTS
  .EVENTS
    .SUBSCRIBE
    .SUBSCRIBED_EVENTS
    .LABEL
    .replace('{eventName}', eventName)

  const CLIENT_SUBSCRIBED_EVENT_LABEL = `${EVENTS_COMPONENT} ${SUBSCRIBED_EVENT_LABEL}`

  const SUBSCRIBED_EVENT_UPDATES_FIELD = S
    .COMPONENTS
    .EVENTS
    .SUBSCRIBE
    .SUBSCRIBED_EVENTS
    .UPDATES_FIELD
    .replace('{eventName}', eventName)

  const CLIENT_SUBSCRIBED_EVENT_UPDATES_FIELD = `${EVENTS_COMPONENT} ${SUBSCRIBED_EVENT_UPDATES_FIELD}`

  client
    .waitForElementVisible(CLIENT_SUBSCRIBED_EVENT_LABEL, TIME.TINY)
    .expect
    .element(CLIENT_SUBSCRIBED_EVENT_LABEL)
    .to.be.present

  client
    .waitForElementVisible(CLIENT_SUBSCRIBED_EVENT_UPDATES_FIELD, TIME.TINY)
    .expect
    .element(CLIENT_SUBSCRIBED_EVENT_UPDATES_FIELD)
    .text.to.contain(`${eventData}`)
}

defineSupportCode(({ Given, When, Then }) => {

  Given('I start listening for events', () => {
    return client
      .click(S.COMPONENTS.EVENTS.LISTENING.LISTEN_BUTTON)
      .pause(TIME.TINY)
  })

  When('I subscribe to event "{eventName}"', (eventName) => {
    subscribe(1, eventName)
    return client
  })

  When('I emit event "{eventName}" with data "{data}"', (eventName, data) => {
    client.expect
      .element(S.COMPONENTS.EVENTS.EMIT.EVENT_NAME_FIELD)
      .to.be.present

    client.expect
      .element(S.COMPONENTS.EVENTS.EMIT.EVENT_DATA_FIELD)
      .to.be.present

    return client
      .setValue(S.COMPONENTS.EVENTS.EMIT.EVENT_NAME_FIELD, eventName)
      .setValue(S.COMPONENTS.EVENTS.EMIT.EVENT_DATA_FIELD, data)
      .click(S.COMPONENTS.EVENTS.EMIT.SUBMIT_BUTTON)
  })

  When('I receive update "{eventData}" in event "{eventName}"', (eventData, eventName) => {
    receiveEventWithData(1, eventName, eventData)
  })

  Given('Client with id "{clientId}" subscribes to event "{eventName}"', (clientId, eventName) => {
    subscribe(clientId, eventName)
    return client
  })

  Then('Client with id "{clientId}" receives event "{evetName}" with data "{eventData}"', (clientId, eventName, eventData) => {
    receiveEventWithData(clientId, eventName, eventData)
    return client
  })
})
