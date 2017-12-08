/* eslint-disable new-cap */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const S = require('./constants/selectors')
const TIME = require('./constants/time-intervals')

defineSupportCode(({ Given, When, Then }) => {

  Given('I connect all users', () => {
    client.elements('css selector', `${S.COMPONENTS.PRESENCE.AVAILABLE_USERS.LABEL.LIST} > div.col > button`, (result) => {
      result.value.forEach((_, n) => {
        const NTH_USER_BUTTON = S
          .COMPONENTS
          .PRESENCE
          .AVAILABLE_USERS
          .LABEL
          .OFFLINE_USER_BUTTON
          .replace('{n}', `${n + 1}`)

        client
          .click(NTH_USER_BUTTON)
          .pause(TIME.TINY)
      })
    })

    client.elements('css selector', `${S.COMPONENTS.PRESENCE.AVAILABLE_USERS.LABEL.LIST} > div.col`, (result) => {
      result.value.forEach((_, n) => {
        const NTH_USER_BUTTON = S
          .COMPONENTS
          .PRESENCE
          .AVAILABLE_USERS
          .LABEL
          .ONLINE_USER_BUTTON
          .replace('{n}', `${n + 1}`)

        client.expect
          .element(NTH_USER_BUTTON)
          .to.be.present
      })
    })

    return client
  })

  When('I query online status of everyone', () => {
    return client
      .click(S.COMPONENTS.PRESENCE.QUERY.EVERYONE.BUTTON)
      .pause(TIME.SHORT)
  })

  Then('Everyone is connected', () => {
    client.elements('css selector', `${S.COMPONENTS.PRESENCE.AVAILABLE_USERS.LABEL.LIST} > div.col`, (result) => {
      const expectedTextResult = JSON.stringify(
        ['open'].concat(result.value.map((x, index) => `user-${index + 1}`))
      )

      client.expect
        .element(S
          .COMPONENTS
          .PRESENCE
          .QUERY
          .EVERYONE
          .RESULT_FIELD
          .replace('{id}', '2')
        )
        .text.to.contain(expectedTextResult)
    })

    return client
  })

  Given('I connect users "{usersList}"', (usersList) => {
    const users = usersList.split(',').map(u => u.trim(' '))

    const OFFLINE_USER_BUTTON_WITH_ID = S.COMPONENTS.PRESENCE
      .AVAILABLE_USERS
      .LABEL
      .OFFLINE_USER_BUTTON_WITH_ID

    const ONLINE_USER_BUTTON_WITH_ID = S.COMPONENTS.PRESENCE
      .AVAILABLE_USERS
      .LABEL
      .ONLINE_USER_BUTTON_WITH_ID

    users.forEach((userName) => {
      const OFFLINE_BUTTON = OFFLINE_USER_BUTTON_WITH_ID.replace('{userName}', userName)
      const ONLINE_BUTTON = ONLINE_USER_BUTTON_WITH_ID.replace('{userName}', userName)

      client
        .click(OFFLINE_BUTTON)
        .pause(TIME.TINY)
        .expect
        .element(ONLINE_BUTTON)
        .to.be.present
    })

    return client
  })

  When('I query online status of "{usersList}"', (usersList) => {
    return client
      .setValue(S.COMPONENTS.PRESENCE.QUERY.SPECIFIC.INPUT_FIELD, usersList)
      .click(S.COMPONENTS.PRESENCE.QUERY.SPECIFIC.BUTTON)
      .pause(TIME.SHORT)
  })

  Then('Users "{onlineUsersList}" are online and "{offlineUsersList}" are offline', (onlineUsersList, offlineUsersList) => {
    const onlineUsersArr = onlineUsersList.split(',').map(u => u.trim(' '))
    const offlineUsersArr = offlineUsersList.split(',').map(u => u.trim(' '))

    const specificQueryResponse = onlineUsersArr
      .concat(offlineUsersArr)
      .reduce((acc, username) => {
        acc[username] = onlineUsersArr.indexOf(username) > -1
        return acc
      }, {})

    return client
      .expect
      .element(S
        .COMPONENTS
        .PRESENCE
        .QUERY
        .SPECIFIC
        .RESULT_FIELD
        .replace('{id}', '2')
      )
      .text.to.contain(JSON.stringify(specificQueryResponse))
  })

  Given('I subscribe for "{username}" online status', (username) => {
    client
      .setValue(S.COMPONENTS.PRESENCE.QUERY.SUBSCRIBE.FIELD, username)
      .click(S.COMPONENTS.PRESENCE.QUERY.SUBSCRIBE.BUTTON)
      .pause(TIME.TINY)

    client
      .expect
      .element(S
        .COMPONENTS
        .PRESENCE
        .QUERY
        .SUBSCRIBE
        .USERS
        .LABEL
        .replace('{username}', username)
      )
      .to.be.present

    client
      .expect
      .element(S
        .COMPONENTS
        .PRESENCE
        .QUERY
        .SUBSCRIBE
        .USERS
        .STATUS
        .replace('{username}', username)
      )
      .to.be.present

    return client
  })

  Then('The online status of the user "{username}" is now "{status}"', (username, status) => {
    client
      .expect
      .element(S
        .COMPONENTS
        .PRESENCE
        .QUERY
        .SUBSCRIBE
        .USERS
        .LABEL
        .replace('{username}', username)
      )
      .to.be.present

    client
      .expect
      .element(S
        .COMPONENTS
        .PRESENCE
        .QUERY
        .SUBSCRIBE
        .USERS
        .STATUS
        .replace('{username}', username)
      )
      .text.to.equal(status)

    return client
  })

  When('I disconnect users "{usersList}"', (usersList) => {
    const users = usersList.split(',').map(u => u.trim(' '))

    const OFFLINE_USER_BUTTON_WITH_ID = S.COMPONENTS.PRESENCE
      .AVAILABLE_USERS
      .LABEL
      .OFFLINE_USER_BUTTON_WITH_ID

    const ONLINE_USER_BUTTON_WITH_ID = S.COMPONENTS.PRESENCE
      .AVAILABLE_USERS
      .LABEL
      .ONLINE_USER_BUTTON_WITH_ID

    users.forEach((userName) => {
      const OFFLINE_BUTTON = OFFLINE_USER_BUTTON_WITH_ID.replace('{userName}', userName)
      const ONLINE_BUTTON = ONLINE_USER_BUTTON_WITH_ID.replace('{userName}', userName)

      client
        .click(ONLINE_BUTTON)
        .pause(TIME.TINY)
        .expect
        .element(OFFLINE_BUTTON)
        .to.be.present
    })

    return client
  })
})
