const config = require('./webpack.dev.js');

config.module.rules.push({
  test: /\.js$/,
  enforce: 'post',
  include: `${config.context}/app`,
  loader: 'istanbul-instrumenter-loader',
  exclude: [/\.config.js$/, /\.spec\.js$/, /node_modules/],
});

module.exports = config;
