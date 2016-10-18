'use strict';

var spawn = require('child_process').spawn;
module.exports = function (gulp, options) {
    var manageiq_dir = require('../config')[options.key || 'manageiq_dir'];

    return task;

    function task() {

          var cmd = spawn('rails', ['s'], {stdio: 'inherit',cwd:manageiq_dir});
    }   
};