const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/deepstream.ts'],
  output: {
    path: __dirname,
    filename: './dist/bundle/ds.js',
    library: 'deepstream',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{
      test: /\.ts$/, loaders: ['ts-loader'], exclude: /node_modules/
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
