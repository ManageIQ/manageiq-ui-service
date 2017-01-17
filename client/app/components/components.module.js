import 'angular-drag-and-drop-lists';
import 'angular-dragdrop';
import 'angular-ui-bootstrap';
import 'angular-svg-base-fix';

import 'bootstrap';
import 'bootstrap-datepicker';
import 'bootstrap-select';
import 'bootstrap-select/dist/css/bootstrap-select.css';

import 'patternfly-bootstrap-treeview/dist/bootstrap-treeview.min.js';
import 'patternfly/dist/js/patternfly.js';
import 'manageiq-ui-components/dist/js/ui-components.js';
import 'angular-patternfly/dist/angular-patternfly';

import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';
import 'patternfly-bootstrap-treeview/dist/bootstrap-treeview.min.css';
import 'angular-patternfly/dist/styles/angular-patternfly.css';
import 'manageiq-ui-components/dist/css/ui-components.css';

angular.module('app.components', [
  'app.core',
  'ui.bootstrap',
  'patternfly',
  'svgBaseFix',
  'dndLists',
  'flowChart',
  'ngDragDrop',
]);
