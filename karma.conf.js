module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',
    frameworks: ['mocha', 'chai', 'sinon', 'chai-sinon'],
    colors: true,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Run chrome with --no-sandbox because in ACT we don't have sudo access
    browsers: ['CustomChromeHeadless'],
    customLaunchers: {
      CustomChromeHeadless: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    // list of files / patterns to load in the browser
    files: [
      {pattern: './dist/app.js'},
      {pattern: './node_modules/angular-mocks/angular-mocks.js'},
      {pattern: './node_modules/bardjs/bard.js'},
      {pattern: './node_modules/sinon/pkg/sinon.js'},
      {pattern: './node_modules/karma-read-json/karma-read-json.js'},
      {pattern: './client/app/**/*.spec.js'},
      {pattern: './tests/**/*.js'},
      {pattern: './tests/**/*.json', included: false, served: true, nocache: false},
      {pattern: './client/assets/images/**/*', included: false, served: true, nocache: false},
    ],

    plugins: [
      'karma-babel-preprocessor',
      'karma-chai',
      'karma-chai-sinon',
      'karma-chrome-launcher',
      'karma-coverage-istanbul-reporter',
      'karma-mocha',
      'karma-read-json',
      'karma-sinon',
    ],

    proxies: {
      '/images/': '/base/client/assets/images/',
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './tests/**/*.js': ['babel'],
      './client/app/**/*.spec.js': ['babel'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'coverage'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-istanbul'],

    coverageIstanbulReporter: {
      dir: './reports/coverage',
      fixWebpackSourcePaths: true,
      reports: ['text-summary', 'lcovonly'],
    },
  })
}
