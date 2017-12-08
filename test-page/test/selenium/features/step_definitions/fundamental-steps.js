/* eslint-disable new-cap */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const S = require('./constants/selectors')
const TIME = require('./constants/time-intervals')
const USER = require('./constants/standard-user')

function addClientFromPage (address) {
  client
    .waitForElementVisible(S.ADD_CLIENT_INPUT, TIME.SHORT) // 'input#input-add-client'
    .waitForElementVisible(S.ADD_CLIENT_BUTTON, TIME.SHORT) // 'button#btn-add-client'
    .setValue(S.ADD_CLIENT_INPUT, address)
    .click(S.ADD_CLIENT_BUTTON)
    .pause(TIME.TINY)
}

function loginWithCredentialsFromPage (clientId, { username, password }) {
  const AUTHENTICATION_COMPONENT = S
    .COMPONENTS
    .AUTHENTICATION
    .RELATIVE_ROOT
    .replace('{clientId}', clientId)

  const AUTHENTICATION_FORM = `${AUTHENTICATION_COMPONENT} > div > div > ${S.COMPONENTS.AUTHENTICATION.FORM}`
  const AUTHENTICATION_USERNAME_FIELD = `${AUTHENTICATION_FORM} ${S.COMPONENTS.AUTHENTICATION.USERNAME_FIELD}`
  const AUTHENTICATION_PASSWORD_FIELD = `${AUTHENTICATION_FORM} ${S.COMPONENTS.AUTHENTICATION.PASSWORD_FIELD}`
  const AUTHENTICATION_LOGIN_BUTTON = `${AUTHENTICATION_FORM} ${S.COMPONENTS.AUTHENTICATION.LOGIN_BUTTON}`

  client
    .waitForElementVisible(AUTHENTICATION_COMPONENT, TIME.TINY)
    .waitForElementVisible(AUTHENTICATION_FORM, TIME.TINY)
    .setValue(AUTHENTICATION_USERNAME_FIELD, username)
    .setValue(AUTHENTICATION_PASSWORD_FIELD, password)
    .click(AUTHENTICATION_LOGIN_BUTTON)
    .pause(TIME.SHORT)
}

defineSupportCode(({ Given, Then }) => {
  Given('I am on the test-page', () => {
    return client.url(client.launchUrl)
      .waitForElementVisible('#app', TIME.EPIC)
  })

  Given('I add a client with address "{address}"', (address) => {
    // return client
    //   .waitForElementVisible(S.ADD_CLIENT_INPUT, TIME.SHORT) // 'input#input-add-client'
    //   .waitForElementVisible(S.ADD_CLIENT_BUTTON, TIME.SHORT) // 'button#btn-add-client'
    //   .setValue(S.ADD_CLIENT_INPUT, address)
    //   .click(S.ADD_CLIENT_BUTTON)
    //   .pause(TIME.TINY)

    addClientFromPage(address)
    return client
  })

  Then('A client component is displayed with id "{id}"', (id) => {
    return client
      .assert.visible(`div${S.COMPONENTS.CLIENT}#client-${id}`, TIME.SHORT)
  })

  Given('I login with username "{username}" and password "{password}"', (username, password) => {
    // return client
    //   .waitForElementVisible(S.COMPONENTS.AUTHENTICATION.ROOT, TIME.TINY)
    //   .waitForElementVisible(S.COMPONENTS.AUTHENTICATION.FORM, TIME.TINY)
    //   .setValue(S.COMPONENTS.AUTHENTICATION.USERNAME_FIELD, username)
    //   .setValue(S.COMPONENTS.AUTHENTICATION.PASSWORD_FIELD, password)
    //   .click(S.COMPONENTS.AUTHENTICATION.LOGIN_BUTTON)
    //   .pause(TIME.SHORT)
    loginWithCredentialsFromPage(1, { username, password })

    return client
  })

  Given('I login with standard user', () => {
    return client
      .waitForElementVisible(S.COMPONENTS.AUTHENTICATION.ROOT, TIME.TINY)
      .setValue(S.COMPONENTS.AUTHENTICATION.USERNAME_FIELD, USER.USERNAME)
      .setValue(S.COMPONENTS.AUTHENTICATION.PASSWORD_FIELD, USER.PASSWORD)
      .click(S.COMPONENTS.AUTHENTICATION.LOGIN_BUTTON)
  })

  Given('Client with id "{clientId}" and name "{username}" logs in to server "{address}"', (clientId, username, address) => {
    addClientFromPage(address)
    loginWithCredentialsFromPage(clientId, { username, password: '' })

    return client
  })

  Then('Connection state becomes "{state}"', (state) => {
    client
      .waitForElementVisible(S.COMPONENTS.CONNECTION.ROOT, TIME.TINY)
      .pause(TIME.TINY)

    client.expect
      .element(S.COMPONENTS.CONNECTION.STATE_BUTTON)
      .to.be.visible

    client.expect
      .element(S.COMPONENTS.CONNECTION.STATE_BUTTON)
      .text.to.equal(state)

    return client
  })
})
