const deepstreamEnv = process.env.DEEPSTREAM_ENV

if (deepstreamEnv !== 'react-native') {
  return
}

const saveFile = require('fs').writeFileSync
const reactNativeMainPath = 'dist/bundle/ds.js'

const basePath = require.main.filename.split('scripts/postinstall')[0]
const pkgJsonPath =  basePath + 'package.json'
const pkgJsonPathDist = basePath + 'dist/package.json'

const json = require(pkgJsonPath)
const jsonDist = require(pkgJsonPathDist)

json.main = reactNativeMainPath
jsonDist.main = reactNativeMainPath

saveFile(pkgJsonPath, JSON.stringify(json, null, 2))
saveFile(pkgJsonPathDist, JSON.stringify(jsonDist, null, 2))
