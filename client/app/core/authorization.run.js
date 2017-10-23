/* eslint-disable no-useless-return */
/** @ngInject */

export function authInit ($rootScope, $state, $log, Session, $sessionStorage, Language, ApplianceInfo, $window, RBAC, Redux, $ngRedux) {
  $rootScope.$on('$stateChangeStart', changeStart)
  $rootScope.$on('$stateChangeError', changeError)
  $rootScope.$on('$stateChangeSuccess', changeSuccess)

  $sessionStorage.$sync()  // needed when called right on reload
  if ($sessionStorage.token) {
    syncSession()
  }

  function changeStart (event, toState, toParams, _fromState, _fromParams) {
    Redux.loadRedux().then(() => {
      // first lets see if they are logged in and session is valid
      event.preventDefault()
      let nextState = ''
      if (!Session.active()) {
        nextState = 'login'
        return
      }
      const isAuthorized = authorizedForState(toState) // assumes they are logged in and authorized to see the page
      if (!isAuthorized) {
        nextState = 'dashboard'
        // transition them to login if the state they trying to go to is login
      }
      if (nextState) {
        $state.transitionTo(nextState)
        return
      } else {
        return
      }
    })
  }
  function authorizedForState (toState) {
    let authorized = true
    if (angular.isDefined(toState.data)) {
      if (angular.isDefined(toState.data.authorization) && !toState.data.authorization) {
        authorized = false
      }
    }
    return authorized
  }
  function syncSession () {
    return new Promise(function (resolve, reject) {
      // trying saved token..
      Session.setAuthToken($sessionStorage.token)
      Session.setGroup($sessionStorage.miqGroup)

      Session.loadUser()
        .then(function (response) {
          if (angular.isDefined(response)) {
            Language.onReload(response)
            ApplianceInfo.set(response)
            RBAC.setRole(response.identity.role)
          }
          resolve()
        })
        .catch(badUser)
    })
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
    angular.element('html, body').animate({ scrollTop: 0 }, 200)
  }
}
