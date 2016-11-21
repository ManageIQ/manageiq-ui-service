(function() {
  'use strict';

  angular.module('app.components')
    .component('loading', {
      bindings: {
        status: '<',
      },
      template: '<div ng-if="$ctrl.status" class="drawer-pf-loading text-center">'
      + '<span class="spinner spinner-xs spinner-inline"></span> {{ "Loading More" | translate }}  </div>',
    });
})();
