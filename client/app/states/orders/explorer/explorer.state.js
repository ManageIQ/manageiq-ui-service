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
        templateUrl: 'app/states/orders/explorer/explorer.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('My Orders'),
      },
    };
  }

  /** @ngInject */
  function StateController() {
    const vm = this;
  }
})();
