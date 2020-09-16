deepstream.io-client-js
=======================
[![Build Status](https://travis-ci.org/deepstreamIO/deepstream.io-client-js.svg?branch=master)](https://travis-ci.org/deepstreamIO/deepstream.io-client-js) [![Coverage Status](https://coveralls.io/repos/github/deepstreamIO/deepstream.io-client-js/badge.svg?branch=master)](https://coveralls.io/github/deepstreamIO/deepstream.io-client-js?branch=master) [![npm version](https://badge.fury.io/js/%40deepstream%2Fclient.svg)](https://badge.fury.io/js/%40deepstream%2Fclient)


The Browser / Node Client for [deepstream.io](http://deepstream.io/)

## Documentation

For API documentation see the [documentation page](http://deepstream.io/docs/)!

For tutorials see the [tutorial page](http://deepstream.io/tutorials/)!

## Usage with Typescript

This repository comes with the Typescript typings bundled. No need to download them separately!

Make sure the `src/client.d.ts` file is accessible to the Typescript compiler. Do this by making sure it's an included file in tsconfig.json by adding a `typeRoots` defininition. (Required Typescript 2.0 or higher.)

>  "typeRoots": [
     "./node_modules/deepstream.io-client.js/src/client.d.ts"
    ]

## Usage in browser
```
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
    <script src="https://cdn.deepstream.io/js/client/latest/ds.min.js" charset="utf-8">
    </script>
  </head>
  <body>
    <p>Welcome to Deepstream, the realtime server</p>
    <script type="text/javascript">
      var client = new window.DeepstreamClient('localhost:6020')
      client.login({}, function(success) {
        console.log('success', success)
      })
    </script>
  </body>
</html>
```
Please check [Javascript client documentation](https://deepstream.io/tutorials/getting-started/javascript/#getting-the-client) on how to use records, events, and make RPC calls.

## Install in react-native  

For usage in react-native the bundled client available at `dist/bundle/ds.min.js` must be used. In order to automatically change the main file in package.json to the bundle file install as: `DEEPSTREAM_ENV=react-native npm install @deepstream/client`.  
