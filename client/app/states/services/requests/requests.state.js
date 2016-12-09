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
      'services.requests': {
        parent: 'application',
        url: '/requests',
        templateUrl: 'app/states/services/requests/requests.html',
        controller: Controller,
        controllerAs: 'vm',
        title: N_('Requests'),
      },
    };
  }

  /** @ngInject */
  function Controller() {
    var vm = this;
  }
})();
