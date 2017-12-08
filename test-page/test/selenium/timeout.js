const {defineSupportCode} = require('cucumber')

defineSupportCode(({setDefaultTimeout}) => {
  setDefaultTimeout(30 * 1000)
})
