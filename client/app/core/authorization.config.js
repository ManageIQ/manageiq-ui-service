/* eslint camelcase: "off" */

/** @ngInject */
export function authConfig ($httpProvider) {
  $httpProvider.interceptors.push(interceptor)

  /** @ngInject */
  function interceptor ($injector, $q, $window) {
    return {
      response: response,
      responseError: responseError
    }

    function response (res) {
      if (res.status === 401) {
        endSession()

        return $q.reject(res)
      }

      return $q.resolve(res)
    }

    function responseError (rej) {
      if (rej.status === 401) {
        endSession()

        return $q.reject(rej)
      }

      return $q.reject(rej)
    }

    function endSession () {
      var $state = $injector.get('$state')
      var Session = $injector.get('Session')

      if ($state.current.name !== 'login') {
        Session.destroy()
        $window.location.href = $state.href('login') + '?timeout'
      }
    }
  }
}

/** @ngInject */
export function authInit ($rootScope, $state, $log, Session, $sessionStorage, Language, $window, RBAC, ActionCable) {
  $rootScope.$on('$stateChangeStart', changeStart)
  $rootScope.$on('$stateChangeError', changeError)
  $rootScope.$on('$stateChangeSuccess', changeSuccess)

  $sessionStorage.$sync()  // needed when called right on reload
  if ($sessionStorage.token) {
    syncSession()
  }

  function changeStart (event, toState, toParams, _fromState, _fromParams) {
    if (angular.isDefined(toState.data)) {
      if (angular.isDefined(toState.data.authorization) && !toState.data.authorization) {
        event.preventDefault()
        const menuOptions = [
          {state: 'services', permission: RBAC.FEATURES.SERVICES.VIEW},
          {state: 'orders', permission: RBAC.FEATURES.ORDERS.VIEW},
          {state: 'catalogs', permission: RBAC.FEATURES.SERVICE_CATALOG.VIEW}
        ]
        const availableState = menuOptions.find((option) => {
          return RBAC.has(option.permission)
        })
        const nextState = (availableState ? availableState.state : 'login')

        $state.transitionTo(nextState)

        return
      }
      if (!toState.data.requireUser) {
        return
      }
    }
    if (Session.active()) {
      return
    }

    // user is required and session not active - not going anywhere right away
    event.preventDefault()
    $sessionStorage.$sync()  // needed when called right on reload
    if (!$sessionStorage.token) {
      // no saved token, go directly to login
      $state.transitionTo('login')
      return
    }

    syncSession()
    .then(rbacReloadOrLogin(toState, toParams))
    .catch(badUser)
  }

  function syncSession () {
    // trying saved token..
    Session.setAuthToken($sessionStorage.token)
    Session.setGroup($sessionStorage.miqGroup)

    return Session.loadUser()
    .then(function (response) {
      if (angular.isDefined(response)) {
        Language.onReload(response)
        RBAC.setRole(response.identity.role)
      }
    })
    .catch(badUser)
  }

  function rbacReloadOrLogin (toState, toParams) {
    return function () {
      if (RBAC.suiAuthorized()) {
        $state.go(toState, toParams)
      } else {
        Session.privilegesError = true
        $window.location.href = $state.href('login')
      }
    }
  }

  function badUser (error) {
    $log.error(__('Error retrieving user info'), [error])
    $window.location.href = $state.href('login')
  }

  function changeError (event, toState, _toParams, _fromState, _fromParams, error) {
    // If a 401 is encountered during a state change, then kick the user back to the login
    if (401 || error.status === 403) {
      event.preventDefault()
      if (Session.active()) {
        $state.transitionTo('logout')
      } else if (toState.name !== 'login') {
        $state.transitionTo('login')
      }
    }
  }

  function changeSuccess () {
    angular.element('html, body').animate({scrollTop: 0}, 200)
  }
}
