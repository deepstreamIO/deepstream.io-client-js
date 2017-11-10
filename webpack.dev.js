var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ['./src/client.ts'],
  output: {
    path: __dirname,
    filename: './dist/deepstream.js',
    library: 'deepstream',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    "ws": "WebSocket"
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
};