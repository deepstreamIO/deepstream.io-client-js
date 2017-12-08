/* eslint-disable new-cap */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const S = require('./constants/selectors')
const TIME = require('./constants/time-intervals')

defineSupportCode(({ Given, When, Then }) => {

  Given('I create a record with name "{name}"', (name) => {
    return client
      .waitForElementVisible(S.COMPONENTS.RECORDS.ROOT, TIME.SHORT)
      .setValue(S.COMPONENTS.RECORDS.CREATE_RECORD_NAME_FIELD, name)
      .click(S.COMPONENTS.RECORDS.CREATE_RECORD_SUBMIT_BUTTON)
      .pause(TIME.SHORT)
  })

  Then('A record label with record name "{name}" is displayed', (name) => {
    const CREATED_RECORD_LABEL = S
      .COMPONENTS
      .RECORDS
      .CREATED_RECORD_LABEL
      .replace('{recordName}', name)

    client.expect
      .element(CREATED_RECORD_LABEL)
      .to.be.visible

    return client
  })

  Then('The subscribe button for record "{recordName}" is displayed', (recordName) => {
    const CREATED_RECORD_SUBSCRIBE_BUTTON = S
      .COMPONENTS
      .RECORDS
      .CREATED_RECORD_SUBSCRIBE_BUTTON
      .replace('{recordName}', recordName)

    client.pause(TIME.SHORT)

    client.expect
      .element(CREATED_RECORD_SUBSCRIBE_BUTTON)
      .to.be.visible

    return client
  })

  Given('I subscribe to record "{name}"', (name) => {
    const CREATED_RECORD_SUBSCRIBE_BUTTON = S
      .COMPONENTS
      .RECORDS
      .CREATED_RECORD_SUBSCRIBE_BUTTON
      .replace('{recordName}', name)

    return client
      .waitForElementVisible(CREATED_RECORD_SUBSCRIBE_BUTTON, TIME.TINY)
      .click(CREATED_RECORD_SUBSCRIBE_BUTTON)
      .pause(TIME.TINY)
  })

  Then('The unsubscribe button for record "{recordName}" is displayed', (recordName) => {
    const CREATED_RECORD_UNSUBSCRIBE_BUTTON = S
      .COMPONENTS
      .RECORDS
      .CREATED_RECORD_UNSUBSCRIBE_BUTTON
      .replace('{recordName}', recordName)

    return client
      .waitForElementVisible(
        CREATED_RECORD_UNSUBSCRIBE_BUTTON,
        TIME.TINY
      )
  })

  When('I set record "{recordName}" attribute "{attribute}" to value "{value}"', (recordName, attribute, value) => {
    const RECORDS = S.COMPONENTS.RECORDS

    const RECORD_SET_ATTRIBUTE_NAME_FIELD = RECORDS.SET.RECORD_ATTRIBUTE_NAME_FIELD.replace('{recordName}', recordName)
    const RECORD_SET_ATTRIBUTE_VALUE_FIELD = RECORDS.SET.RECORD_ATTRIBUTE_VALUE_FIELD.replace('{recordName}', recordName)
    const RECORD_SET_ATTRIBUTE_SUBMIT_BUTTON = RECORDS.SET.RECORD_ATTRIBUTE_SUBMIT_BUTTON.replace('{recordName}', recordName)

    return client
      .waitForElementVisible(RECORD_SET_ATTRIBUTE_NAME_FIELD, TIME.TINY)
      .waitForElementVisible(RECORD_SET_ATTRIBUTE_VALUE_FIELD, TIME.TINY)
      .setValue(RECORD_SET_ATTRIBUTE_NAME_FIELD, attribute)
      .setValue(RECORD_SET_ATTRIBUTE_VALUE_FIELD, value)
      .click(RECORD_SET_ATTRIBUTE_SUBMIT_BUTTON)
      .pause(TIME.SHORT)
  })

  Then('The record "{recordName}" receives as an update the value "{updateValue}"', (recordName, updateValue) => {
    const RECORD_SUBSCRIPTION_UPDATES_FIELD = S
      .COMPONENTS
      .RECORDS
      .SET
      .RECORD_SUBSCRIPTION_UPDATES_FIELD
      .replace('{recordName}', recordName)

    return client.expect
      .element(RECORD_SUBSCRIPTION_UPDATES_FIELD)
      .text.to.contain(updateValue)
  })

  Given('I unsubscribe from record "{name}"', (recordName) => {
    const CREATED_RECORD_UNSUBSCRIBE_BUTTON = S
      .COMPONENTS
      .RECORDS
      .CREATED_RECORD_UNSUBSCRIBE_BUTTON
      .replace('{recordName}', recordName)

    return client
      .waitForElementVisible(CREATED_RECORD_UNSUBSCRIBE_BUTTON, TIME.SHORT)
      .click(CREATED_RECORD_UNSUBSCRIBE_BUTTON)
      .pause(TIME.TINY)
  })

  Then('The record "{recordName}" does not receive any update', (recordName) => {
    const RECORD_SUBSCRIPTION_UPDATES_FIELD = S
      .COMPONENTS
      .RECORDS
      .SET
      .RECORD_SUBSCRIPTION_UPDATES_FIELD
      .replace('{recordName}', recordName)

    client.expect
      .element(RECORD_SUBSCRIPTION_UPDATES_FIELD)
      .to.not.be.present

    return client
  })

  Given('I check if record "{recordName}" exists', (recordName) => {
    return client
      .waitForElementVisible(S.COMPONENTS.RECORDS.HAS.RECORDNAME_FIELD, TIME.TINY)
      .setValue(S.COMPONENTS.RECORDS.HAS.RECORDNAME_FIELD, recordName)
      .click(S.COMPONENTS.RECORDS.HAS.SUBMIT_BUTTON)
      .pause(TIME.SHORT)
  })

  Then('I find that record "{recordName}" does not exist', (recordName) => {
    const HAS_STATUS_LABEL = S.COMPONENTS.RECORDS.HAS.STATUS_LABEL.replace('{recordName}', recordName)
    return client.expect
      .element(HAS_STATUS_LABEL)
      .text.to.equal('NO')
  })

  Then('I snapshot record "{recordName}"', (recordName) => {
    return client
      .setValue(S.COMPONENTS.RECORDS.SNAPSHOT.RECORD_NAME_FIELD, recordName)
      .click(S.COMPONENTS.RECORDS.SNAPSHOT.BUTTON)
      .pause(TIME.TINY)
  })

  Then('The value "{snapshotValue}" is displayed in the snapshot preview', (snapshotValue) => {
    client.pause(TIME.SHORT)

    client.expect
      .element(S.COMPONENTS.RECORDS.SNAPSHOT.PREVIEW_ELEMENT)
      .text.to.equal(snapshotValue)

    return client
  })

  Given('I start listening for records', () => {
    return client
      .waitForElementVisible(S.COMPONENTS.RECORDS.LISTENING.LISTEN_BUTTON, TIME.TINY)
      .click(S.COMPONENTS.RECORDS.LISTENING.LISTEN_BUTTON)
  })

  When('A timeout of "{timeout}" milliseconds have passed', (timeout) => {
    return client.pause(timeout)
  })
})
