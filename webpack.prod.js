const devConfig = require('./webpack.dev');

module.exports = {
    ...devConfig,
    mode: 'production',
    output: {
        ...devConfig.output,
        filename: './dist/bundle/ds.min.js'
    }
}