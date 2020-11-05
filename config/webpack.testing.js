const path = require('path')

const config = require('./webpack.dev.js');

config.module.rules.push({
  test: /\.js$/,
  enforce: 'post',
  include: `${config.context}/app`,
  loader: '@jsdevtools/coverage-istanbul-loader',
  exclude: [
    /\.spec\.js$/,
    /node_modules/,
  ],
});

config.output.filename = '[name].js';
config.output.path = path.resolve(__dirname, '../dist');

module.exports = config;
