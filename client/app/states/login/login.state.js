/** @ngInject */
export function LoginState(routerHelper) {
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
function StateController(exception, $state, Text, API_LOGIN, API_PASSWORD, AuthenticationApi, Session, $rootScope, Notifications, Language, ServerInfo, ProductInfo, $window) {
  var vm = this;

  vm.text = Text.login;

  vm.credentials = {
    login: API_LOGIN,
    password: API_PASSWORD,
  };

  if ($window.location.href.includes("?timeout")) {
    Notifications.message('danger', '', __('Your session has timed out.'), true);
  }

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
      .then(Session.requestWsToken)
      .then(ServerInfo.set)
      .then(ProductInfo.set)
      .then(Language.onLogin)
      .then(function() {
        if (Session.activeNavigationFeatures()) {
          if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
            $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length);
          }

          // FIXME(#328) this should be $state.go('dashboard')
          var url = $state.href('dashboard');
          $window.document.location.href = url;
        } else {
          Session.privilegesError = true;
          Notifications.error(__('User does not have privileges to login.'));
        }
      })
      .catch(exception.catch('Login failed, possibly invalid credentials'));
  }
}
