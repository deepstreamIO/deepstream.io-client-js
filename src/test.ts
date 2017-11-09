import { deepstream } from './client'

const client = deepstream('localhost:6020')
const client2 = deepstream('localhost:6020')
client2.login({ username: 'user1' })

setTimeout(() => {
    client.login({}, (success, data) => {
        client.presence.getAll(['user1'], (error, users) => {
            console.log(1, error, users)
        })
        client.presence.getAll(['user2'], (error, users) => {
            console.log(2, error, users)
        })
    })
})