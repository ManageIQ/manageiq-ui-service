'use strict';

var args = require('yargs').argv;
var gulp = require('gulp');
var merge = require('merge');
var taskListing = require('gulp-task-listing');
var browserSync = require('browser-sync');
var log = require('gulp-util').log;

/**
 * List the available gulp tasks
 */
gulp.task('help', taskListing);
gulp.task('default', ['help']);

/**
 * Check the code for errors
 */
gulp.task('eslint', task('eslint'));
gulp.task('sasslint', task('sasslint'));
gulp.task('vet', ['eslint', 'sasslint']);
gulp.task('accessibility', [], task('accessibility'));

/**
 * Cleans the build output
 */
gulp.task('clean', task('clean'));
gulp.task('clean-styles', task('clean', {key: 'cleanStyles'}));
gulp.task('clean-fonts', task('clean', {key: 'cleanFonts'}));
gulp.task('clean-images', task('clean', {key: 'cleanImages'}));
gulp.task('clean-code', task('clean', {key: 'cleanCode'}));

/**
 * Individual component build tasks
 */
gulp.task('templatecache', task('templatecache'));
gulp.task('sass', task('sass'));
gulp.task('ejs', task('ejs'));
gulp.task('bundle', task('bundle'));
gulp.task('inject', ['bundle'], task('inject'));
gulp.task('fonts', task('fonts'));
gulp.task('images', task('images'));
gulp.task('available-languages', task('available-languages'));
gulp.task('gettext-extract', task('gettext-extract'));
gulp.task('gettext-compile', task('gettext-compile'));
gulp.task('build-copy', task('build-copy'));

/**
 * Build tasks
 */
gulp.task('compile', ['inject', 'sass', 'templatecache', 'fonts', 'images', 'available-languages'], task('compile'));
gulp.task('compileEjs', ['compile'], task('ejs', {key: 'ejs'}));
gulp.task('optimize', ['compileEjs'], task('optimize'));
gulp.task('build', ['optimize', 'build-copy'], task('build'));

/**
 * Testing tasks
 */
gulp.task('test', ['templatecache','vet'], task('test', {singleRun: true}));
gulp.task('testonly', ['templatecache'], task('test', {singleRun: true}));
gulp.task('autotest', task('test', {singleRun: false}));

/**
 * Serves up injected html for dev, builds for everything else.
 */
gulp.task('start-manageiq-server', ['serve'], task('manageiq-server'));
gulp.task('serve', ['compile', 'available-languages'], task('serve', {
  specRunner: false
}));

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */

gulp.task('bump', task('bump'));

function errorHandler(error) {
  browserSync.notify(error.message, 3000);
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
    version: args.version
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
