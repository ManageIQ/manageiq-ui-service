/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.services')
    .config(configure)
    .run(init);

  /** @ngInject */
  function configure($httpProvider) {
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
        var Notifications = $injector.get('Notifications');
        var Session = $injector.get('Session');

        if ('login' !== $state.current.name) {
          Session.destroy();
          $window.location.href = $state.href('login') + "?timeout";
        }
      }
    }
  }

  /** @ngInject */
  function init($rootScope, $state, Session, $sessionStorage, logger, Language, ServerInfo, ProductInfo, $window) {
    var unregisterStart = $rootScope.$on('$stateChangeStart', changeStart);
    var unregisterError = $rootScope.$on('$stateChangeError', changeError);
    var unregisterSuccess = $rootScope.$on('$stateChangeSuccess', changeSuccess);

    function changeStart(event, toState, toParams, fromState, fromParams) {
      if (toState.data && !toState.data.requireUser) {
        return;
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

      // trying saved token..
      Session.create({
        auth_token: $sessionStorage.token,
        miqGroup: $sessionStorage.miqGroup,
      });

      Session.loadUser()
        .then(Language.onReload)
        .then(ServerInfo.set)
        .then(ProductInfo.set)
        .then(rbacReloadOrLogin(toState, toParams))
        .catch(badUser);
    }

    function rbacReloadOrLogin(toState, toParams) {
      return function() {
        if (Session.activeNavigationFeatures()) {
          $state.go(toState, toParams);
        } else {
          Session.privilegesError = true;
          $window.location.href = $state.href('login');
        }
      };
    }

    function badUser(error) {
      logger.error(__('Error retrieving user info'), [error]);
      $window.location.href = $state.href('login');
    }

    function changeError(event, toState, toParams, fromState, fromParams, error) {
      // If a 401 is encountered during a state change, then kick the user back to the login
      if (401 === error.status) {
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
})();
