const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

const config = require('./webpack.dev.js')

// Source maps suitable for production use
config.devtool = 'cheap-module-source-map'

config.plugins.push(
  new webpack.NoEmitOnErrorsPlugin(),

  new webpack.optimize.UglifyJsPlugin(),

  // Cleans previous build
  new CleanWebpackPlugin([config.output.path], {
    allowExternal: true
  }),

  // Replace index.html with correct base href for production use
  new HtmlWebpackPlugin({
    base: '/ui/service/',
    template: '../client/index.ejs',
    chunks: ['app']
  }),

  // Build the HTML required for the WebMKS console
  new HtmlWebpackPlugin({
    base: '/',
    filename: 'console/webmks.html',
    template: '../client/console/common.ejs',
    chunks: ['console_webmks']
  }),

  new OptimizeCssAssetsWebpackPlugin()
)

module.exports = config
