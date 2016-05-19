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
      'dialogs': {
        parent: 'application',
        url: '/dialogs',
        redirectTo: 'dialogs.list',
        template: '<ui-view></ui-view>'
      }
    };
  }
})();
