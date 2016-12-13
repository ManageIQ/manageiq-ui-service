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
  function Controller(RequestsState) {
    var vm = this;

    activate();

    function activate() {
      // if (angular.isUndefined(RequestsState.filterApplied)) {
      RequestsState.setFilters([{'id': 'approval_state', 'title': __('Request Status'), 'value': __('pending_approval')}]);
      RequestsState.filterApplied = true;
      // }
    }
  }
})();
