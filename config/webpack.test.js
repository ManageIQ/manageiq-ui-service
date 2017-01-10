const webpack = require('webpack');
// const sinon = require('sinon/pkg/sinon-2.0.0-pre.5');
const config = require('./webpack.dev.js');

config.entry = {};
config.output = {};
config.module.rules.push({
  test: /\.js$/,
  enforce: 'post',
  include: `${config.context}/app`,
  loader: 'istanbul-instrumenter-loader',
  exclude: [/\.spec\.js$/, /node_modules/]
});
// config.plugins.push(
//   new webpack.DefinePlugin({
//     'sinon': sinon,
//   })
// );

module.exports = config;
