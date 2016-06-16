'use strict';

var log = require('../utils/log');
var merge = require('merge-stream');

module.exports = function(gulp, options) {
  var config = require('../config')[options.key || 'consoleCopy'];

  return task;

  function task() {
    if (options.verbose) {
      log('Copying console dependencies to build dir');
    }

    var merged = merge();
    config.forEach(function(config) {
      var stream = gulp.src(config.input)
        .pipe(gulp.dest(config.output));

      merged.add(stream);
    });

    return merged;
  }
};
