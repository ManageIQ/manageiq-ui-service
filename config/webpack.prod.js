const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

const { StatsWriterPlugin } = require('webpack-stats-plugin');
const fs = require('fs');
const sortBy = require('lodash/sortBy');

const config = require('./webpack.dev.js')

const uniqueWebpackModules = (data) => {
  // recursively flatten nested modules
  const transformModule  = m  => m.modules ? transformModules(m.modules) : m.name.split("!").pop();
  const transformModules = ms => ms.flatMap(m => transformModule(m));

  var modules = transformModules(data.modules);
  modules = [...new Set(modules)]; // uniq

  return modules;
}

const packagesFromModules = (modules) => {
  // find the package.json file for each module
  modules = modules.filter(m => m.includes("node_modules"));
  var packagePaths = modules.map(m => {
    var match = m.match(/(.*node_modules\/)([^/]+)(\/[^/]+)?/);
    var path = [
      `${match[1]}${match[2]}/package.json`,
      `${match[1]}${match[2]}${match[3]}/package.json`,
    ].find(p => fs.existsSync(p));

    if (path == null) {
      console.warn(`[webpack-manifest] WARN: Unable to find a package.json for ${m}`);
    }

    return path;
  })
  packagePaths = packagePaths.filter(p => p != null);
  packagePaths = [...new Set(packagePaths)]; // uniq

  // extract relevant package data from the package.json
  var packages = packagePaths.map(p => {
    var content = fs.readFileSync(p);
    var pkg = JSON.parse(content);
    return {
      name: pkg.name,
      license: pkg.license,
      version: pkg.version,
      location: p
    }
  });
  packages = sortBy(packages, ['name', 'version']);

  return packages;
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
    base: '/ui/service/',
    template: '../client/index.ejs',
    chunks: ['app']
  }),

  new OptimizeCssAssetsWebpackPlugin(),

  // Write out dependent modules list for audit purposes
  new StatsWriterPlugin({
    filename: "webpack_modules_manifest.json",
    fields: ["modules"],

    transform(data) {
      var modules = uniqueWebpackModules(data);
      return JSON.stringify(modules, null, 2);
    }
  }),

  // Write out dependent packages list for audit purposes
  new StatsWriterPlugin({
    filename: "webpack_packages_manifest.json",
    fields: ["modules"],

    transform(data) {
      var modules = uniqueWebpackModules(data);
      var packages = packagesFromModules(modules);
      return JSON.stringify(packages, null, 2);
    }
  })
)

module.exports = config
