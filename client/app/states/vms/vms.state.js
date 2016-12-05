(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'vms': {
        parent: 'application',
        url: '/vms',
        redirectTo: 'services.explorer',
        template: '<ui-view></ui-view>',
      },
    };
  }
})();
