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
      'designer.rules': {
        parent: 'application',
        url: '/designer/rules',
        templateUrl: 'app/states/designer/rules/rules.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Arbitration Rules'),
        resolve: {
          blueprints: resolveRules,
          profiles: resolveProfiles
        }
      }
    };
  }

  /** @ngInject */
  function resolveRules(CollectionsApi) {
    var options = {
      expand: 'resources',
      attributes: 'bundle'
    };

//    return CollectionsApi.query('arbitration_rules', options);
  }

  function resolveProfiles(CollectionsApi) {
    var options = {
      expand: 'resources',
      sort_by: 'name',
      sort_options: 'ignore_case'};

//    return CollectionsApi.query('arbitration_profiles', options);
  }

  /** @ngInject */
  function StateController($state, Notifications, $rootScope, Language) {
    /* jshint validthis: true */
    var vm = this;

    vm.title = __('Rules');

  }
})();
