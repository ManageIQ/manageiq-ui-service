'use strict';
/* eslint no-process-env: "off"*/
/* global process module*/

var access = require('gulp-accessibility');
module.exports = function (gulp, options) {
  return task;
  function task() {
    return gulp.src('./client/**/*.html')
            .pipe(access({
              force: true,
              accessibilityLevel: 'Section508',
            }))
            .on('error', console.log)
            .pipe(access.report({ reportType: 'txt' }))
            .pipe(gulp.dest('reports/txt'));
  }
};
