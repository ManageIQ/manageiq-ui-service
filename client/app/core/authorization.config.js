/* eslint camelcase: "off" */

/** @ngInject */
export function authConfig($httpProvider) {
  $httpProvider.interceptors.push(interceptor);

  /** @ngInject */
  function interceptor($injector, $q, $window) {
    return {
      response: response,
      responseError: responseError,
    };

    function response(res) {
      if (401 === res.status) {
        endSession();

        return $q.reject(res);
      }

      return $q.resolve(res);
    }

    function responseError(rej) {
      if (401 === rej.status) {
        endSession();

        return $q.reject(rej);
      }

      return $q.reject(rej);
    }

    function endSession() {
      var $state = $injector.get('$state');
      var Session = $injector.get('Session');

      if ('login' !== $state.current.name) {
        Session.destroy();
        $window.location.href = $state.href('login') + "?timeout";
      }
    }
  }
}

/** @ngInject */
export function authInit($rootScope, $state, $log, Session, $sessionStorage, Language, ApplianceInfo, $window, RBAC) {
  $rootScope.$on('$stateChangeStart', changeStart);
  $rootScope.$on('$stateChangeError', changeError);
  $rootScope.$on('$stateChangeSuccess', changeSuccess);

  $sessionStorage.$sync();  // needed when called right on reload
  if ($sessionStorage.token) {
    syncSession();
  }
  function changeStart(event, toState, toParams, _fromState, _fromParams) {
    if (angular.isDefined(toState.data)) {
      if (angular.isDefined(toState.data.authorization) && !toState.data.authorization) {
        event.preventDefault();
        $state.transitionTo('dashboard');

        return;
      }
      if (!toState.data.requireUser) {
        return;
      }
    }
    if (Session.active()) {
      return;
    }

    // user is required and session not active - not going anywhere right away
    event.preventDefault();
    $sessionStorage.$sync();  // needed when called right on reload
    if (!$sessionStorage.token) {
      // no saved token, go directly to login
      $state.transitionTo('login');

      return;
    }
    syncSession().then(rbacReloadOrLogin(toState, toParams)).catch(badUser);
  }
  function syncSession() {
    return new Promise(function (resolve, _reject) {
      // trying saved token..
      Session.setAuthToken($sessionStorage.token);
      Session.setMiqGroup($sessionStorage.miqGroup);

      Session.loadUser()
        .then(function (response) {
          if (angular.isDefined(response)) {
            Language.onReload(response);
            ApplianceInfo.set(response);
            RBAC.setRole(response.identity.role);         
          }
          resolve();
        })
        .catch(badUser);
    });
  }
  function rbacReloadOrLogin(toState, toParams) {
    return function() {
      if (RBAC.navigationEnabled()) {
        $state.go(toState, toParams);
      } else {
        Session.privilegesError = true;
        $window.location.href = $state.href('login');
      }
    };
  }

  function badUser(error) {
    $log.error(__('Error retrieving user info'), [error]);
    $window.location.href = $state.href('login');
  }

  function changeError(event, toState, _toParams, _fromState, _fromParams, error) {
    // If a 401 is encountered during a state change, then kick the user back to the login
    if (401 || 403 === error.status) {
      event.preventDefault();
      if (Session.active()) {
        $state.transitionTo('logout');
      } else if ('login' !== toState.name) {
        $state.transitionTo('login');
      }
    }
  }

  function changeSuccess() {
    angular.element('html, body').animate({scrollTop: 0}, 200);
  }
}
