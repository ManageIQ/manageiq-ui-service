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
      'orders.explorer': {
        url: '',
        template: '<order-explorer></order-explorer>',
        title: N_('My Orders'),
      },
    };
  }
})();
