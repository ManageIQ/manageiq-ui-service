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
      'login': {
        parent: 'blank',
        url: '/login',
        templateUrl: 'app/states/login/login.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Login'),
        data: {
          layout: 'blank',
        },
      },
    };
  }

  /** @ngInject */
  function StateController($state, Text, API_LOGIN, API_PASSWORD, AuthenticationApi, Session, $rootScope, Notifications, Language, ServerInfo, ProductInfo) {
    var vm = this;

    vm.text = Text.login;

    vm.credentials = {
      login: API_LOGIN,
      password: API_PASSWORD,
    };

    if (Session.privilegesError) {
      Notifications.error(__('User does not have privileges to login.'));
    }

    vm.onSubmit = onSubmit;

    function onSubmit() {
      // clearing a flag that *could* have been set before redirect to /login
      Session.timeoutNotified = false;
      Session.privilegesError = false;

      return AuthenticationApi.login(vm.credentials.login, vm.credentials.password)
        .then(Session.loadUser)
        .then(ServerInfo.set)
        .then(ProductInfo.set)
        .then(Language.onLogin)
        .then(function() {
          if (Session.activeNavigationFeatures()) {
            if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
              $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
            }
            $state.go('dashboard');
          } else {
            Session.privilegesError = true;
            Notifications.error(__('User does not have privileges to login.'));
          }
        });
    }
  }
})();
