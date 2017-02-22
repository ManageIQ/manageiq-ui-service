/** @ngInject */
export function SessionFactory($http, $q, $sessionStorage, gettextCatalog, $window, $state, $cookies, lodash, RBAC, Polling) {
  var model = {
    token: null,
    user: {},
  };

  var service = {
    current: model,
    setAuthToken: setAuthToken,
    setMiqGroup: setMiqGroup,
    destroy: destroy,
    active: active,
    currentUser: currentUser,
    loadUser: loadUser,
    requestWsToken: requestWsToken,
    destroyWsToken: destroyWsToken,
    switchGroup: switchGroup,
  };

  destroy();

  return service;

  function setAuthToken(token) {
    model.token = token;
    $http.defaults.headers.common['X-Auth-Token'] = model.token;
    $sessionStorage.token = model.token;
  }

  function setMiqGroup(group) {
    $http.defaults.headers.common['X-Miq-Group'] = group;
    $sessionStorage.miqGroup = group || null;
  }

  function destroy() {
    model.token = null;
    model.user = {};
    destroyWsToken();
    delete $http.defaults.headers.common['X-Auth-Token'];
    delete $http.defaults.headers.common['X-Miq-Group'];
    delete $sessionStorage.miqGroup;
    delete $sessionStorage.token;
    delete $sessionStorage.user;
  }

  function loadUser() {
    Polling.start('UserPolling', getUserAuthorizations, 300000);
    var deferred = $q.defer();
    if (angular.isUndefined($sessionStorage.user)) {
      getUserAuthorizations().then(function (response) {
        deferred.resolve(response);
      });
    } else {
      var response = angular.fromJson($sessionStorage.user);
      currentUser(response.identity);
      setMiqGroup(response.identity.group);
      RBAC.set(response.authorization.product_features);
      deferred.resolve(response);
    }

    return deferred.promise;
  }

  function getUserAuthorizations() {
    return $http.get('/api?attributes=authorization')
      .then(function (response) {
        $sessionStorage.user = angular.toJson(response.data);
        currentUser(response.data.identity);
        setMiqGroup(response.data.identity.group);
        RBAC.set(response.data.authorization.product_features);

        return response.data;
      });
  }
  function requestWsToken(arg) {
    return $http.get('/api/auth?requester_type=ws')
    .then(function(response) {
      destroyWsToken();
      $cookies.put('ws_token', response.data.auth_token, { path: '/ws/notifications' });

      return arg;
    });
  }

  function destroyWsToken() {
    $cookies.remove('ws_token', { path: '/ws/notifications' });
  }

  function currentUser(user) {
    if (angular.isDefined(user)) {
      model.user = user;
    }

    return model.user;
  }

  function switchGroup(group) {
    $sessionStorage.miqGroup = group;

    // reload .. but on dashboard
    $window.location.href = $state.href('dashboard');
  }

  // Helpers

  function active() {
    // may not be current, but if we have one, we'll rely on API 401ing if it's not
    return angular.isString(model.token) ? model.token : false;
  }
}
