'use strict';

var log = require('../utils/log');
var order = require('gulp-order');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp, options) {
  var config = require('../config')[options.key || 'bundle'];

  return task;

  function task() {
    if (options.verbose) {
      log('Building application JS bundle');
    }

    return gulp.src(config.files)
      .pipe(order(config.ordering))
      .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.temp));
  }
};
