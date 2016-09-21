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
      'administration': {
        parent: 'application',
        url: '',
        redirectTo: 'administration.profiles',
      },
    };
  }
})();
