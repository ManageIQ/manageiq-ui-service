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
      'blueprints.list': {
        url: '', // No url, this state is the index of projects
        templateUrl: 'app/states/blueprints/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Blueprint List')
      }
    };
  }

  /** @ngInject */
  function StateController($state) {
    /* jshint validthis: true */
    var vm = this;

    vm.title = __('Blueprint List');
  }
})();
