'use strict';
/* eslint no-process-env: "off"*/
/* global process module*/
var spawn = require('child_process').spawn;
module.exports = function (gulp, options) {
  var manageiqDir = require('../config')[options.key || 'manageiqDir'];
  var manageiqPort = ( process.env.MANAGEIQPORT ? process.env.MANAGEIQPORT : 3000);

  return task;
  function task() {
    var cmd = spawn('rails', ['s', '-p', manageiqPort], { stdio: 'inherit', cwd: manageiqDir });
  }   
};
