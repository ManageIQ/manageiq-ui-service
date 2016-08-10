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
        resolve: {
          blueprint: resolveBlueprint,
        }
      }
    };
  }
  /** @ngInject */
  function resolveBlueprint($stateParams, CollectionsApi) {
    var options = {attributes: ['bundle']};

    if ($stateParams.blueprintId) {
      return CollectionsApi.get('blueprints', $stateParams.blueprintId, options);
    } else {
      return null;
    }
  }

  /** @ngInject */
  function StateController($state, $stateParams, blueprint) {
    var vm = this;
    vm.title = 'Blueprint Designer';
    if (blueprint) {
      vm.blueprint = blueprint;
    }
  }
})();
