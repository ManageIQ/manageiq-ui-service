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
      'designer': {
        parent: 'application',
        url: '',
        redirectTo: 'designer.blueprints',
      },
    };
  }
})();
