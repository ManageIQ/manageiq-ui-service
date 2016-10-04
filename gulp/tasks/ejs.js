'use strict';

var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var ejs = require("gulp-ejs");


module.exports = function(gulp, options) {
  var config = require('../config')[options.key || 'ejs'];

  return task;

  function task() {
    if (options.verbose) {
      log('Optimizing the js, css, and html');
    }

    return gulp.src(config.index)
      .pipe(plumber({errorHandler: options.onError}))
      .pipe(ejs({}).on('error', options.onError))
      .pipe(rename("index.html"))
      .pipe(gulp.dest(config.build));
  }
};
