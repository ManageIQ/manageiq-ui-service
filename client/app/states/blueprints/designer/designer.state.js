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
      'blueprints.designer': {
        url: '/:blueprintId',
        templateUrl: 'app/states/blueprints/designer/designer.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Blueprint Designer',
        'okToNavAway': false
      }
    };
  }

  /** @ngInject */
  function StateController($state, $stateParams) {
    var vm = this;
    vm.title = 'Blueprint Designer';
    vm.blueprintId = $stateParams.blueprintId;
  }
})();
