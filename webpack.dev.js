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
    fallback: {
      fs: false,
      module: false,
      url: false,
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
    new webpack.IgnorePlugin({resourceRegExp:/ws/}),
    new webpack.IgnorePlugin({resourceRegExp:/localstorage/}),
  ]
};
