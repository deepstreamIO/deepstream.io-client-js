const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/deepstream.ts'],
  output: {
    path: __dirname,
    filename: './dist/deepstream.js',
    library: 'deepstream',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [{
      test: /\.ts$/, loaders: ['ts-loader'], exclude: /node_modules/
    }],
  },
  plugins: [
    new webpack.IgnorePlugin(/ws/),
    new webpack.IgnorePlugin(/node-localstorage/),
  ],
  node: {
    fs: 'empty',
    module: 'empty',
    url: 'empty',
  }
};
