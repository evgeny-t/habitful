var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  devtool: debug ? 'inline-sourcemap' : null,
  entry: './js/client.js',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }
    ]
  },
  output: {
    path: __dirname + '/src/public/',
    filename: 'client.min.js'
  },
  plugins: debug ? [ ] : [
    new webpack.IgnorePlugin(/dummy\.js$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/sse/*': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/auth/*': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  }
};
