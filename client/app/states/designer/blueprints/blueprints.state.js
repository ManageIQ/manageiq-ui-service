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
      'designer.blueprints': {
        parent: 'application',
        url: '/designer/blueprints',
        redirectTo: 'designer.blueprints.list',
        template: '<ui-view></ui-view>',
      },
    };
  }
})();
