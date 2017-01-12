const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./webpack.dev.js');

// Use hashes in filenames for cache busting
config.output.chunkFilename = '[name].[hash].js';
config.output.filename = '[name].[hash].js';

// Source maps suitable for production use
config.devtool = 'source-map';

config.plugins.push(
  new webpack.NoErrorsPlugin(),

  new webpack.optimize.UglifyJsPlugin(),

  // Cleans previous build
  new CleanWebpackPlugin([config.output.path], {
    allowExternal: true,
  }),

  // Replace index.html with correct base href for production use
  new HtmlWebpackPlugin({
    base: '/ui/service/',
    template: '../client/index.ejs',
  })
);

module.exports = config;
