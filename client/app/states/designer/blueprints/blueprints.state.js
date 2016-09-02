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
      'blueprints': {
        parent: 'application',
        url: '/blueprints',
        redirectTo: 'blueprints.list',
        template: '<ui-view></ui-view>'
      }
    };
  }
})();
