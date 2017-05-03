deepstream.io-client-js
=======================
[![Build Status](https://travis-ci.org/deepstreamIO/deepstream.io-client-js.svg?branch=master)](https://travis-ci.org/deepstreamIO/deepstream.io-client-js) [![Coverage Status](https://coveralls.io/repos/github/deepstreamIO/deepstream.io-client-js/badge.svg?branch=master)](https://coveralls.io/github/deepstreamIO/deepstream.io-client-js?branch=master) [![npm version](https://badge.fury.io/js/deepstream.io.svg)](http://badge.fury.io/js/deepstream.io-client-js) [![Bower version](https://badge.fury.io/bo/deepstream.io-client-js.svg)](http://badge.fury.io/bo/deepstream.io-client-js)
[![dependencies Status](https://david-dm.org/deepstreamIO/deepstream.io-client-js/status.svg)](https://david-dm.org/deepstreamIO/deepstream.io-client-js)
[![devDependencies Status](https://david-dm.org/deepstreamIO/deepstream.io-client-js/dev-status.svg)](https://david-dm.org/deepstreamIO/deepstream.io-client-js?type=dev)

The Browser / Node Client for [deepstream.io](http://deepstream.io/)

## Documentation

For API documentation see the [documentation page](http://deepstream.io/docs/)!

For tutorials see the [tutorial page](http://deepstream.io/tutorials/)!

## Usage with Typescript

This repository comes with the Typescript typings bundled. No need to download them separately!

1. Make sure the `src/client.d.ts` file is accessible to the Typescript compiler. Do this by making sure it's an included file in tsconfig.json by adding a `typeRoots` defininition. (Required Typescript 2.0 or higher.)

>  "typeRoots": [
     "./node_modules/deepstream.io-client.js/src/client.d.ts"
    ]

2. Import the module in ES6 style.

```typescript
import * as deepstream from 'deepstream.io-client-js';

const client = deepstream('http://localhost').login();
```
