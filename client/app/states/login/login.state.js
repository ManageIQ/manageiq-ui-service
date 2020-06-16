import templateUrl from './login.html'

/** @ngInject */
export function LoginState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'login': {
      parent: 'blank',
      url: '/login',
      templateUrl,
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Login'),
      data: {
        layout: 'blank'
      }
    }
  }
}

/** @ngInject */
function StateController ($window, $state, $cookies, Text, RBAC, API_LOGIN, API_PASSWORD, AuthenticationApi, Session, $rootScope, Notifications, Language, ApplianceInfo, CollectionsApi) {
  const vm = this
  const oidc_access_token = {
    name: "miq_oidc_access_token"
  }

  getProductInfo()

  vm.text = Text.login
  vm.credentials = {
    login: API_LOGIN,
    password: API_PASSWORD
  }
  vm.onSubmit = onSubmit
  vm.spinner = false

  if ($window.location.href.includes('?timeout')) {
    Notifications.message('danger', '', __('Your session has timed out.'), true)
    Session.destroy()
  }

  if ($window.location.href.includes('?oidcInitiatedLogin')) {
    vm.oidcInitiatedLogin = true
  }

  if ($window.location.href.includes('?pause')) {
    const params = (new URL($window.document.location)).searchParams
    const pauseLength = params.get('pause')
    Session.setPause(pauseLength)
  }

  if (Session.privilegesError) {
    Notifications.error(__('User does not have privileges to login.'))
    Session.destroy()
  }

  function getExtAuthMode () {
    return ( (vm.authenticationInfo && vm.authenticationInfo.oidc_enabled) ? 'oidc' : null)
  }

  function initiateOidcLogin () {
    $window.location.href = '/ui/service/oidc_login?oidcInitiatedLogin'
  }

  function onSubmit () {
    return AuthenticateUser()
  }

  function AuthenticateUser() {
    Session.privilegesError = false
    vm.spinner = true

    let access_token = getExtAuthMode() == 'oidc' ? $cookies.get(oidc_access_token.name) : null

    return AuthenticationApi.globalLogin(getExtAuthMode(), vm.credentials.login, vm.credentials.password, access_token)
    .then(Session.loadUser)
    .then(Session.requestWsToken)
    .then((response) => {
      if (angular.isDefined(response)) {
        Language.onLogin(response)
        ApplianceInfo.set(response)
        RBAC.setRole(response.identity.role)
      }

      if (RBAC.suiAuthorized()) {
        if (angular.isDefined($rootScope.notifications) && $rootScope.notifications.data.length > 0) {
          $rootScope.notifications.data.splice(0, $rootScope.notifications.data.length)
        }
        // the starting screen logic lives in autohorization.config in changeStart
        $window.location.href = $state.href('dashboard')
      } else {
        Session.privilegesError = true
        Notifications.error(__('You do not have permission to view the Service UI. Contact your administrator to update your group permissions.'))
        Session.destroy()
      }
      if (getExtAuthMode() == 'oidc') {
        vm.oidcInitiatedLogin = false
      }
    })
    .catch((response) => {
      let message = __('Login failed.');
      let error = response.data && response.data.error && response.data.error.message;

      if (response.status === 401) {
        if (getExtAuthMode() === null) {
          vm.credentials.login = '';
          vm.credentials.password = '';
        }

        message = __('Login failed, possibly invalid credentials.');
      }

      if (!error && response.status >= 300) {
        error = `${response.status} ${response.statusText}`;
      }

      Notifications.message('danger', '', error ? `${message} (${error})` : message, false);

      Session.destroy();
    })
    .then(() => {
      vm.spinner = false
    })
  }

  function getProductInfo () {
    CollectionsApi.query('product_info').then((response) => {
      vm.brandInfo = response.branding_info
      $rootScope.favicon = vm.brandInfo.favicon
      vm.authenticationInfo = response.authentication
      if (vm.authenticationInfo.oidc_enabled) {
        if (vm.oidcInitiatedLogin) {
          return AuthenticateUser()
        } else {
          return new Promise( () => { initiateOidcLogin(); } )
        }
      }
    })
  }
}
