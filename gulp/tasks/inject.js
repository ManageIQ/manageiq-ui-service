'use strict';

var log = require('../utils/log');
var inject = require('../utils/inject');

module.exports = function(gulp, options) {
  var config = require('../config')[options.key || 'inject'];

  return task;

  function task() {
    if (options.verbose) {
      log('Injecting dependencies into the html');
    }

    return gulp.src(config.index)
      .pipe(inject(config.files, '', config.order))
      .pipe(gulp.dest(config.build))
      .pipe(gulp.dest(config.temp));
  }
};
