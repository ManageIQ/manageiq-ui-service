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
      'logout': {
        url: '/logout',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Logout'),
      },
    };
  }

  /** @ngInject */
  function StateController($state, Session, $window) {
    activate();

    function activate() {
      Session.destroy();
      $window.location.href = $state.href('login');
    }
  }
})();
