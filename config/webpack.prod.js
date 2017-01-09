const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./webpack.dev.js');

config.output.chunkFilename = '[name].[hash].js';
config.output.filename = '[name].[hash].js';

config.devtool = 'source-map';

config.plugins.push(
  new webpack.NoErrorsPlugin(),

  new CleanWebpackPlugin([config.output.path], {
    allowExternal: true,
  }),

  new HtmlWebpackPlugin({
    base: '/ui/service/',
    template: '../client/index.ejs',
  })
);

module.exports = config;
