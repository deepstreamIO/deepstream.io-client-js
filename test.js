const deepstream = require('./dist/src/client').default

const client = new deepstream('localhost:6020')

client.login({}, console.log)