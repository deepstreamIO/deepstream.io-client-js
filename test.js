const { deepstream } = require('./dist/src/client')
const { expect } = require('chai')

const numClients = 10
let count = 0
const clients = []

const presenceWatcher = deepstream('localhost:6020')
presenceWatcher.login({ username: 'presence-watcher' }, (success, clientData) => {
    presenceWatcher.presence.subscribe('user-1', (user, loggedIn) => {
        console.log('subscription user-1', user, loggedIn)
    })
    presenceWatcher.presence.subscribe('user-2', (user, loggedIn) => {
        console.log('subscription user-2', user, loggedIn)
    })
    presenceWatcher.presence.subscribe((username, login) => {
        console.log(username, 'logged',  login ? 'in' : 'out')
    })
})


setTimeout(() => {
    for (let i = 0; i < numClients; i++) {
        const client = deepstream('localhost:6020')
        client.login({ username: `user-${i + 1}`})
    }
}, 1000)
