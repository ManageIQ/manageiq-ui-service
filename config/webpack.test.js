const webpack = require('webpack');
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

module.exports = config;
