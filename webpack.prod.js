const devConfig = require('./webpack.dev')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    ...devConfig,
    mode: 'production',
    optimization: {
        minimizer: [new TerserPlugin({
            terserOptions: {
            },
        })],
    },
    output: {
        ...devConfig.output,
        filename: './dist/bundle/ds.min.js'
    }
}