'use strict';

var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var log = require('../utils/log');

module.exports = function(gulp, options) {
  var config = require('../config')[options.key || 'serve'];

  return task;

  function task() {
    serve(options.specRunner);
  }

  function getNodeOptions() {
    return {
      script: config.serverApp,
      delayTime: 1,
      env: {
        'PORT': config.serverPort,
        'NODE_ENV': 'dev'
      },
      watch: config.watch
    };
  }

  function runNodeInspector() {
    log('Running node-inspector.');
    log('Browse to http://localhost:8080/debug?port=5858');
    var exec = require('child_process').exec;
    exec('node-inspector');
  }

  /**
   * serve the code
   * --debug-brk or --debug
   * --nosync
   * @param  {Boolean} specRunner - server spec runner html
   */
  function serve(specRunner) {
    var debug = options.debug;
    var debugMode = options.debugBrk ? '--debug-brk' : options.debug ? '--debug' : '';
    var nodeOptions = getNodeOptions();

    if (debug) {
      runNodeInspector();
      nodeOptions.nodeArgs = [debugMode + '=5858'];
    }

    if (options.verbose) {
      console.log(nodeOptions);
    }

    return nodemon(nodeOptions)
      .on('restart', ['vet'], function(ev) {
        log('*** nodemon restarted');
        log('files changed:\n' + ev);
        setTimeout(function() {
          browserSync.notify('reloading now ...');
          browserSync.reload({stream: false});
        }, config.browserReloadDelay);
      })
      .on('start', function() {
        log('*** nodemon started');
        startBrowserSync(specRunner);
      })
      .on('crash', function() {
        log('*** nodemon crashed: script crashed for some reason');
      })
      .on('exit', function() {
        log('*** nodemon exited cleanly');
      });
  }

  /**
   * When files change, log it
   * @param  {Object} event - event that fired
   */
  function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');

    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
  }

  /**
   * Start BrowserSync
   * --nosync will avoid browserSync
   */
  function startBrowserSync(specRunner) {
    if (options.nosync || browserSync.active) {
      return;
    }

    var browserSyncOptions = config.browserSyncOptions;

    if (options.verbose) {
      log('Starting BrowserSync on ' + browserSyncOptions.proxy);
    }

    // Watches less, compiles it to css, browser-sync handles reload
    gulp.watch([config.sass], ['sass']).on('change', changeEvent);

    // Watches source JS files and rebuilds bundle on changes
    gulp.watch([config.js], ['compile']).on('change', changeEvent);

    browserSyncOptions.files = config.devFiles;


    if (specRunner) {
      options.startPath = config.specsFile;
    }

    browserSync(browserSyncOptions);
  }
};
