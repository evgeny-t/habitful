var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');


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
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      }
    ]
  },
  output: {
    path: __dirname + '/src/public/',
    filename: 'client.min.js'
  },
  plugins: debug ? [
    new FaviconsWebpackPlugin('./assets/logo.png'),
  ] : [
    new FaviconsWebpackPlugin('./assets/logo.png'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.IgnorePlugin(/dummy\.js$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourcemap: false,
      compress: {
        warnings: false,
      },
    }),
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
