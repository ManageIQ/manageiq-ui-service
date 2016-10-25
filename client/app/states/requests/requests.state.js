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
      'requests': {
        parent: 'application',
        url: '',
        redirectTo: 'requests.requests',
      },
    };
  }
})();
