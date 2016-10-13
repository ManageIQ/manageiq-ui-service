'use strict';

var sassLint = require('gulp-sass-lint');
var log = require('../utils/log');

module.exports = function(gulp, options) {
  var config = require('../config')[options.key || 'sasslint'];

  return task;

  function task() {
    if (options.verbose) {
      log('Running sassLint');
    }

    return gulp.src(config.src)
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError());
  }
};
