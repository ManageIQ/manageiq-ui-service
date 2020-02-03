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
function StateController ($window, $state, Text, RBAC, API_LOGIN, API_PASSWORD, AuthenticationApi, Session, $rootScope, Notifications, Language, ApplianceInfo, CollectionsApi) {
  const vm = this

  getBrand()

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

  if ($window.location.href.includes('?pause')) {
    const params = (new URL($window.document.location)).searchParams
    const pauseLength = params.get('pause')
    Session.setPause(pauseLength)
  }

  if (Session.privilegesError) {
    Notifications.error(__('User does not have privileges to login.'))
    Session.destroy()
  }

  function onSubmit () {
    Session.privilegesError = false
    vm.spinner = true

    return AuthenticationApi.login(vm.credentials.login, vm.credentials.password)
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
    })
    .catch((response) => {
      if (response.status === 401) {
        vm.credentials.login = ''
        vm.credentials.password = ''
        const message = response.data.error.message
        Notifications.message('danger', '', __('Login failed, possibly invalid credentials. ') + `(${message})`, false)
      }
      Session.destroy()
    })
    .then(() => {
      vm.spinner = false
    })
  }

  function getBrand () {
    CollectionsApi.query('product_info').then((response) => {
      vm.brandInfo = response.branding_info
      $rootScope.favicon = vm.brandInfo.favicon
    })
  }
}
