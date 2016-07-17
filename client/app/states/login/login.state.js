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
          layout: 'blank'
        }
      }
    };
  }

  /** @ngInject */
  function StateController($state, Text, API_LOGIN, API_PASSWORD, AuthenticationApi, CollectionsApi, Session, $rootScope, Notifications, Language) {
    var vm = this;

    vm.title = __('Login');
    vm.text = Text.login;

    vm.credentials = {
      login: API_LOGIN,
      password: API_PASSWORD
    };

    if (Session.privileges_error) {
      Notifications.error(__('User does not have privileges to login.'));
    }

    vm.onSubmit = onSubmit;

    function onSubmit() {
      // clearing a flag that *could* have been set before redirect to /login
      Session.timeout_notified = false;
      Session.privileges_error = false;

      return AuthenticationApi.login(vm.credentials.login, vm.credentials.password)
        .then(Session.loadUser)
        .then(Language.onLogin)
        .then(function() {
          if (Session.activeNavigationFeatures()) {
            if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
              $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
            }
            $state.go('dashboard');
          } else {
            Session.privileges_error = true;
            Notifications.error(__('User does not have privileges to login.'));
          }
        });
    }
  }
})();
