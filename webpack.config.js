const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const root = path.resolve(__dirname, './client');
const dist = path.resolve(__dirname, './dist');

module.exports = {
  context: root,
  entry: {
    app: './app.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: dist,
  },
  devServer: {
    contentBase: root,
    historyApiFallback: true,
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
      '/pictures': {
        target: 'http://localhost:3000',
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['ngtemplate-loader?module=app.core', 'html-loader?attrs=false'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader?presets[]=env'],
      },
      {
        test: /\.(png|jpg|gif|svg|woff|ttf|eot)/,
        use: ['url-loader?limit=20480'],
      },
      {
        test: /\.(css|s(a|c)ss)$/,

        // 'loader' must be used instead of 'use' until fixed in `extract-text-webpack-plugin`
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader?importLoaders=2', 'postcss-loader', 'sass-loader'],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new CopyWebpackPlugin([
      { from: `${root}/assets` },
    ]),
  ],
  performance: {
    hints: false,
  },
};
