/* eslint-disable new-cap */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const TIME = require('./constants/time-intervals')

defineSupportCode(({ When }) => {

  When('I click "{target}"', (target) => {
    return client
      .waitForElementVisible(target, TIME.TINY)
      .click(target)
      .pause(TIME.TINY)
  })

  When('I enter text "{text}" in field "{field}"', (text, field) => {
    return client
      .waitForElementVisible(field, TIME.TINY)
      .setValue(field, text)
  })
})
