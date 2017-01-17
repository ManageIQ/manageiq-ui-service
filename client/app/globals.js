/* eslint angular/window-service: "off" */
// overriden from gettext.config once the initialization is done
if (!window.__) {
  window.__ = function(str) {
    throw new Error([
      'Attempting to call gettext before the service was initialized.',
      'Maybe you\'re calling it in the .config phase? ("' + str + '")',
    ].join(' '));
  };
}

// N_ is OK anywhere
if (!window.N_) {
  window.N_ = function(str) {
    return str;
  };
}

if (!window.flowchart) {
  window.flowchart = {};
}

// Globals that are expected in application code and some libraries
window.$ = window.jQuery = require('jquery');
window._ = require('lodash');
window.moment = require('moment');
window.sprintf = require('sprintf-js').sprintf;
window.toastr = require('toastr');
