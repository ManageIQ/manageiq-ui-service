'use strict'

const webpackConfig = require('./config/webpack.testing.js')

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',
    frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon', 'chai-sinon'],
    colors: true,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity,
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // list of files / patterns to load in the browser
    files: [
      {pattern: './client/app.js'},
      {pattern: './node_modules/angular-mocks/angular-mocks.js'},
      {pattern: './node_modules/bardjs/bard.js'},
      {pattern: './node_modules/sinon/pkg/sinon.js'},
      {pattern: './node_modules/karma-read-json/karma-read-json.js'},
      {pattern: './node_modules/bardjs/bard.js'},
      {pattern: './client/app/**/*.spec.js'},
      {pattern: './tests/**/*.js'},
      {pattern: './tests/**/*.json', included: false, served: true, nocache: false},
      {pattern: './client/assets/images/**/*', included: false, served: true, nocache: false}
    ],
    exclude: [
      './client/app/**/*.test.js'
    ],
    proxies: {
      '/images/': '/base/client/assets/images/'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './tests/**/*.js': ['babel'],
      './client/app/**/*.spec.js': ['babel'],
      './client/app.js': ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'coverage'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'clear-screen', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      dir: './reports/coverage',
      reports: [ 'html', 'lcovonly', 'text-summary' ],
      fixWebpackSourcePaths: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      }
    }
  })
}
