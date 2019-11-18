/* eslint-disable angular/window-service */
import * as numeral from 'numeral'

// The webpack entrypoint
function requireAll (context) {
  context.keys().forEach(context)
}

// Globals that are expected in application code and some libraries
window.$ = window.jQuery = require('jquery')
window._ = require('lodash')
window.moment = require('moment')
window.sprintf = require('sprintf-js').sprintf
window.c3 = require('c3/c3')
window.d3 = require('d3/d3')
window.numeral = numeral

// Libraries: core
require('jquery-ui-bundle')
require('moment-timezone')
require('es6-shim')
require('array-includes').shim()
require('object.values').shim()
require('angular')
require('angular-animate')
require('angular-cookies')
require('angular-resource')
require('angular-messages')
require('angular-sanitize')
require('angular-gettext')
require('angular-ui-bootstrap')
require('@uirouter/angularjs')
require('@uirouter/angularjs/release/stateEvents')
require('ngstorage')

// Libraries: ui-components
require('bootstrap')
require('bootstrap-select')
require('bootstrap-datepicker')
require('angular-bootstrap-switch')
require('angular-ui-sortable')
require('bootstrap-combobox')
require('ui-select')
require('@manageiq/ui-components/dist/js/ui-components')

// Libraries: angular-patternfly
require('angular-dragdrop')
require('angular-drag-and-drop-lists/angular-drag-and-drop-lists')
require('patternfly/dist/js/patternfly')
require('angular-patternfly/dist/angular-patternfly')

// Libraries: misc
require('ngprogress/build/ngprogress')
require('patternfly-timeline/dist/timeline')

// eslint-disable-next-line import/no-webpack-loader-syntax
require('imports-loader?this=>window!actioncable')

// Application scripts, order matters
require('./app/app.module.js')

// Vendor styles, order matters
require('angular-patternfly/dist/styles/angular-patternfly.css')
require('@manageiq/ui-components/dist/css/ui-components.css')
require('ngprogress/ngProgress.css')
require('ui-select/dist/select.css')
require('patternfly-timeline/dist/timeline.css')

// Application styles
require('./assets/sass/styles.sass')

// Angular templates
requireAll(require.context('./app', true, /\.html$/))

// Skin overrides, require all js and css files within `client/skin`
requireAll(require.context('./', true, /skin\/.*\.(js|css)$/))
