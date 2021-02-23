const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const config = require('./webpack.dev.js');
const manifest = require('./manifest.js');

// Source maps suitable for production use
config.devtool = 'cheap-module-source-map'

// minify
config.mode = 'production';
config.optimization.minimize = true;

config.plugins.push(
  new webpack.NoEmitOnErrorsPlugin(),

  // Cleans previous build
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: [config.output.path],
    dangerouslyAllowCleanPatternsOutsideProject: true,
    dry: false,
  }),

  // Replace index.html with correct base href for production use
  new HtmlWebpackPlugin({
    base: '/ui/service/',
    template: '../client/index.ejs',
    chunks: ['app']
  }),

  // Write out dependent modules list for audit purposes
  new StatsWriterPlugin({
    filename: "webpack_modules_manifest.json",
    fields: ["modules"],

    transform(data) {
      const modules = manifest.uniqueWebpackModules(data).map((path) => path.replace(/^\.\.\//, './'));
      return JSON.stringify(modules, null, 2);
    }
  }),

  // Write out dependent packages list for audit purposes
  new StatsWriterPlugin({
    filename: "webpack_packages_manifest.json",
    fields: ["modules"],

    transform(data) {
      const modules = manifest.uniqueWebpackModules(data).map((path) => path.replace(/^\.\.\//, './'));
      const packages = manifest.packagesFromModules(modules);
      return JSON.stringify(packages, null, 2);
    }
  })
)

module.exports = config
