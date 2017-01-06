// The webpack entrypoint
function requireAll(context) {
  context.keys().forEach(context);
}

// Globals that are expected in application code and some libraries
window.$ = window.jQuery = require('jquery');
window._ = require('lodash');
window.moment = require('moment');
window.sprintf = require('sprintf-js');
window.toastr = require('toastr');

// Vendor libraries
require('angular');
require('angular-animate');
require('angular-base64');
require('angular-cookies');
require('angular-drag-and-drop-lists');
require('angular-dragdrop');
require('angular-gettext');
require('angular-messages');
require('angular-mocks');
require('angular-resource');
require('angular-sanitize');
require('angular-svg-base-fix');
require('angular-ui-bootstrap');
require('angular-ui-router');
require('bootstrap');
require('bootstrap-combobox');
require('bootstrap-datepicker');
require('bootstrap-select');
require('bootstrap-switch');
require('bootstrap-touchspin');
require('c3');
require('components-jqueryui');
require('d3');
require('datatables');
require('datatables-colreorder');
require('eonasdan-bootstrap-datetimepicker');
require('es6-shim');
require('google-code-prettify/bin/prettify.min.js');
require('jquery-match-height');
require('moment-timezone');
require('ngprogress/build/ngProgress');
require('ngstorage');
require('patternfly-bootstrap-treeview/dist/bootstrap-treeview.min.js');
require('patternfly/dist/js/patternfly.js');

// Needs imports loader because it expects `this` to be `window`
require('imports-loader?this=>window!actioncable');

// Must be required last because of its dependencies
require('angular-patternfly/dist/angular-patternfly');

// Application files with strict ordering requirements
require('./app/globals.js');
require('./app/app.module.js');
requireAll(require.context('./app', true, /\.module\.js$/));
requireAll(require.context('./app', true, /^((?!module).)*\.js$/));

// Vendor styles
require('angular-patternfly/dist/styles/angular-patternfly.css');
require('bootstrap-select/dist/css/bootstrap-select.css');
require('bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css');
require('bootstrap-touchspin/src/jquery.bootstrap-touchspin.css');
require('c3/c3.css');
require('datatables/media/css/jquery.dataTables.css');
require('eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css');
require('google-code-prettify/bin/prettify.min.css');
require('ngprogress/ngProgress.css');
require('patternfly-bootstrap-treeview/dist/bootstrap-treeview.min.css');
require('patternfly/dist/css/patternfly-additions.css');
require('patternfly/dist/css/patternfly.css');

// Application styles
require('./assets/sass/styles.sass');

// Angular templates
requireAll(require.context('./app', true, /\.html$/));
