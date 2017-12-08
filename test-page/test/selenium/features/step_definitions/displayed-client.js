/* eslint-disable new-cap */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len*/

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const TIME = require('./constants/time-intervals')
const S = require('./constants/selectors')

defineSupportCode(({ Then }) => {

  Then('The "{componentName}" component is displayed for client component with id "{clientId}"', (componentName, clientId) => {
    const componentSelector = `${S.CLIENT_WITH_ID.replace('{clientId}', clientId)} > div > div > ${S.COMPONENTS.LIST[componentName]}`

    client.pause(TIME.TINY)

    client.expect
      .element(componentSelector)
      .to.be.visible

    return client
  })
})
