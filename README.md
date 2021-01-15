deepstream.io-client-js
=======================
[![Build Status](https://github.com/deepstreamIO/deepstream.io-client-js/workflows/build/badge.svg)](https://github.com/deepstreamIO/deepstream.io-client-js/actions?query=workflow%3Abuild) [![Coverage Status](https://coveralls.io/repos/github/deepstreamIO/deepstream.io-client-js/badge.svg?branch=master)](https://coveralls.io/github/deepstreamIO/deepstream.io-client-js?branch=master) [![npm version](https://badge.fury.io/js/%40deepstream%2Fclient.svg)](https://badge.fury.io/js/%40deepstream%2Fclient)


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

## Install in react-native  

For usage in react-native the bundled client available at `dist/bundle/ds.js` must be used. In order to automatically change the main file in package.json to the bundle file install as: `DEEPSTREAM_ENV=react-native npm install @deepstream/client`. Also the metro bundler must be configured. Check the [documentation](https://deepstream.io/tutorials/integrations/mobile/reactnative/) for more details
