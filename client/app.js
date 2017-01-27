/* eslint-disable angular/window-service */

// The webpack entrypoint
function requireAll(context) {
  context.keys().forEach(context);
}

// Globals that are expected in application code and some libraries
window.$ = window.jQuery = require('jquery');
window._ = require('lodash');
window.moment = require('moment');
window.sprintf = require('sprintf-js').sprintf;

// Vendor libraries, order matters
require('moment-timezone');
require('es6-shim');
require('angular');
require('angular-animate');
require('angular-cookies');
require('angular-resource');
require('angular-messages');
require('angular-sanitize');
require('angular-base64');
require('angular-ui-bootstrap');
require('angular-gettext');
require('bootstrap');
require('bootstrap-combobox');
require('bootstrap-datepicker');
require('bootstrap-select');
require('bootstrap-touchspin');
require('angular-svg-base-fix');
require('angular-ui-router');
require('patternfly/dist/js/patternfly.js');
require('manageiq-ui-components/dist/js/ui-components.js');
require('ngprogress/build/ngprogress.min.js');
require('ngstorage');

// Needs imports loader because it expects `this` to be `window`
require('imports-loader?this=>window!actioncable');

// Must be required last because of its dependencies
require('angular-patternfly/dist/angular-patternfly');

// Application scripts, order matters
require('./app/app.module.js');

// Vendor styles, order matters
require('bootstrap-select/dist/css/bootstrap-select.css');
require('bootstrap-touchspin/src/jquery.bootstrap-touchspin.css');
require('patternfly/dist/css/patternfly.css');
require('patternfly/dist/css/patternfly-additions.css');
require('angular-patternfly/dist/styles/angular-patternfly.css');
require('manageiq-ui-components/dist/css/ui-components.css');
require('ngprogress/ngProgress.css');

// Application styles
require('./assets/sass/styles.sass');

// Angular templates
requireAll(require.context('./app', true, /\.html$/));

// Skin overrides
try {
  requireAll(require.context('./skin', true, /\.(js|css)$/));
} catch (e) {
  // Skin dependencies are not linked
}
