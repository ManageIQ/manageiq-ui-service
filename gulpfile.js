/* eslint-disable no-process-exit, angular/typecheck-function, angular/typecheck-object, global-require */

'use strict';

var args = require('yargs').argv;
var gulp = require('gulp');
var merge = require('merge');
var taskListing = require('gulp-task-listing');
var log = require('gulp-util').log;

/**
 * List the available gulp tasks
 */
gulp.task('help', taskListing);
gulp.task('default', ['help']);

/**
 * Individual component build tasks
 */
gulp.task('available-languages', task('available-languages'));
gulp.task('gettext-extract', task('gettext-extract'));
gulp.task('gettext-compile', task('gettext-compile'));

function errorHandler(error) {
  log('[Error!] ' + error.toString());
  if (process.argv.indexOf('--fail') !== -1) {
    process.exit(1);
  }
}

function argOptions() {
  return {
    rev: !!(args.rev || args.production),
    minify: !!(args.minify || args.production),
    production: !!args.production,
    verbose: !!(args.verbose || args.v),
    startServer: !!args.startServer,
    debug: !!(args.debug || args.debugBrk),
    debugBrk: !!args.debugBrk,
    nosync: !!args.nosync,
    type: args.type,
    version: args.version,
  };
}

function task(taskName, options) {
  var actualErrorHandler;

  if (typeof options !== 'object') {
    options = {};
  }

  if (typeof options.onError !== 'function') {
    options.onError = errorHandler;
  }
  actualErrorHandler = options.onError;
  options.onError = function() {
    actualErrorHandler.apply(this, arguments);
    this.emit('end');
  };

  return require('./gulp/tasks/' + taskName)(gulp, merge(argOptions(), options));
}
