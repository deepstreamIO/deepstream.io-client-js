const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/deepstream'],
  output: {
    path: __dirname,
    filename: './dist/bundle/ds.js',
    library: 'DeepstreamClient',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      [path.resolve(__dirname, 'src/connection/socket-factory.ts')]:
        path.resolve(__dirname, 'src/connection/socket-factory-browser.ts')
    },
    fallback: {
      fs: false,
      module: false,
      url: false,
      buffer: require.resolve('buffer/')
    }
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }],
  },
  plugins: [
    new webpack.IgnorePlugin({resourceRegExp: /url/}),
    new webpack.IgnorePlugin({resourceRegExp:/node-localstorage/}),
    new webpack.ProvidePlugin({Buffer: ['buffer', 'Buffer']})
  ],
  ignoreWarnings: [
    {
      module: /node_modules\/protobufjs\/src\/util\/inquire\.js/,
      message: /Critical dependency: the request of a dependency is an expression/
    }
  ]
};