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
      'orders': {
        parent: 'application',
        url: '/order-explorer',
        redirectTo: 'orders.explorer',
        template: '<ui-view></ui-view>',
      },
    };
  }
})();
