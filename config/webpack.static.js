const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const config = require('./webpack.dev.js')
var urlBase = '/ui/service'

if (process.env.BUILD_OUTPUT) {
  config.output.path = path.resolve(__dirname, process.env.BUILD_OUTPUT)
  urlBase = '/'
}

// Source maps suitable for production use
config.devtool = 'cheap-module-source-map'

// minify
config.mode = 'production';
config.optimization.minimize = true;

config.plugins.push(
  new webpack.NoEmitOnErrorsPlugin(),

  // Cleans previous build
  new CleanWebpackPlugin([config.output.path], {
    allowExternal: true
  }),

  // Replace index.html with correct base href for production use
  new HtmlWebpackPlugin({
    base: urlBase,
    template: '../client/index.ejs'
  }),

  new OptimizeCssAssetsWebpackPlugin()
)

module.exports = config
