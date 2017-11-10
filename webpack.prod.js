var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ['./src/client.ts'],
  output: {
    path: __dirname,
    filename: './dist/deepstream.min.js',
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
    new webpack.IgnorePlugin(/ws/),
    new UglifyJSPlugin()
  ],
};