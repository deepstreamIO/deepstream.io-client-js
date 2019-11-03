const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/deepstream-browser'],
  output: {
    path: __dirname,
    filename: './dist/bundle/ds.js',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }],
  },
  plugins: [
    new webpack.IgnorePlugin(/url/),
    new webpack.IgnorePlugin(/ws/),
  ],
  node: {
    fs: 'empty',
    module: 'empty',
    url: 'empty',
  }
};
