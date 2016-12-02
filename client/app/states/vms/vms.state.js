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
        template: '<ui-view></ui-view>',
      },
    };
  }
})();
