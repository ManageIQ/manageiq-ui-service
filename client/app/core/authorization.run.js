/** @ngInject */
import {createTransform, persistStore} from 'redux-persist'
import { asyncSessionStorage } from 'redux-persist/storages'

export function authInit($rootScope, $state, $log, Session, $sessionStorage, Language, ApplianceInfo, $window, $ngRedux, RBAC) {
  $rootScope.$on('$stateChangeStart', changeStart)
  $rootScope.$on('$stateChangeError', changeError)
  $rootScope.$on('$stateChangeSuccess', changeSuccess)
  $sessionStorage.$sync()  // needed when called right on reload
  function rehydrateStore (route) {
    return new Promise((resolve, reject) => {
      if ($rootScope.rehydrated) {
        resolve(route)
      } else {
       /*  let myTransform = createTransform(
          // transform state coming from redux on its way to being serialized and stored
          (inboundState, key) => specialSerialize(inboundState, key),
          // transform state coming from storage, on its way to be rehydrated into redux
          (outboundState, key) => specialDeserialize(outboundState, key)
        ) */

        persistStore($ngRedux, { storage: asyncSessionStorage }, () => {
          $rootScope.rehydrated = true
          console.log('scope is rehydrated')
          resolve(route)
        })
      }
    })
  }
  // when a change starts we need to
  /**
   *1. Figure out if we need to rehydrate redux store
   *2. see if they are logged in
   *3. redirect them where they need to go
   * 4. if they aren't logged in or something errors, send them to login
   */
  function changeStart (event, toState, toParams, _fromState, _fromParams) {
    const route = {toState: toState, toParams: toParams}
    if (!$rootScope.rehydrated) {
      rehydrateStore(route)
      .then(determineRoute)
      .then(() => {
        // if they made it this far, navigate where they need to go
        $state.go(toState, toParams)
      }).catch((err) => {
        console.log(err)
       // $state.go(toState, toParams)
      })
    }
/*     if (angular.isDefined(toState.data)) {
      if (angular.isDefined(toState.data.authorization) && !toState.data.authorization) {
        event.preventDefault()
        $state.transitionTo('dashboard')

        return
      }
      if (!toState.data.requireUser) {
        return
      }
    } */

    // user is required and session not active - not going anywhere right away
  /*   event.preventDefault()
    $sessionStorage.$sync()  // needed when called right on reload
    if (!$sessionStorage.token) {
      // no saved token, go directly to login
      $state.transitionTo('login')

      return
    }
    syncSession().then(rbacReloadOrLogin(toState, toParams)).catch(badUser)
 */
  }
  function determineRoute (route) {
    return new Promise((resolve, reject) => {
      if (angular.isDefined(route.toState.data) && !route.toState.data.requireUser) {
        resolve()
      }

      if (!Session.active()) {
        const err = {
          message: 'no valid token'
        }
        reject(err)
      } else { // when they have a valid session, lets make sure they can navigate to all pages
        if (!RBAC.navigationEnabled()) {
          const err = {
            message: 'insufficient privileges'
          }
          reject(err)
        } else {
          resolve()
        }
      }
    })
  }
  function syncSession () {
    return new Promise(function (resolve, reject) {
      // trying saved token..
    if (Session.active()) {
      console.log('session is active')
    }
    //  Session.setAuthToken($sessionStorage.token)
    //  Session.setGroup($sessionStorage.miqGroup)

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

/*   function rbacReloadOrLogin (toState, toParams) {
    return function () {
      if (RBAC.navigationEnabled()) {
        $state.go(toState, toParams)
      } else {
        Session.privilegesError = true
        $window.location.href = $state.href('login')
      }
    }
  } */

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
