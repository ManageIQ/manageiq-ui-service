'use strict';

var eslint = require('gulp-eslint');
var log = require('../utils/log');

module.exports = function(gulp, options) {
  var config = require('../config')[options.key || 'eslint'];

  return task;

  function task() {
    if (options.verbose) {
      log('Running ESLint');
    }

    return gulp.src(config.src)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  }
};
