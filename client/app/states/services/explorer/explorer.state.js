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
        url: '', // No url, this state is the index of projects
        templateUrl: 'app/states/services/explorer/explorer.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Services Explorer'),
        resolve: {
          services: resolveServices,
        },
      },
    };
  }

  /** @ngInject */
  function resolveServices(CollectionsApi) {
    var options = {
      expand: false,
      filter: ['service_id=nil'],
    };

    return CollectionsApi.query('services', options);
  }

  /** @ngInject */
  function StateController() {
    var vm = this;

  }
})();
