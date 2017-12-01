var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ['./src/deepstream.ts'],
  output: {
    path: __dirname,
    filename: './dist/deepstream.js',
    library: 'deepstream',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    loaders: [{
      test: /\.ts$/, loaders: ['babel-loader', 'ts-loader'], exclude: /node_modules/
    }],
  },
  plugins: [
    // new webpack.IgnorePlugin(/ws/),
  ],
  node: {
    fs: 'empty'
  }
};