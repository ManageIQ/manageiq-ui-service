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
      'services.explorer': {
        url: '',
        templateUrl: 'app/states/services/explorer/explorer.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Services Explorer'),
      },
    };
  }

  /** @ngInject */
  function StateController() {
    var vm = this;
  }
})();
