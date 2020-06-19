/** @ngInject */
export function SessionFactory ($http, $localStorage, $cookies, RBAC, Polling, $q) {
  const defaultAuthMode = 'database'
  const model = {
    token: null,
    user: {},
    authMode: defaultAuthMode
  };
  const validAuthModes = [defaultAuthMode, 'oidc']

  const service = {
    current: model,
    setAuthToken: setAuthToken,
    setAuthMode: setAuthMode,
    getAuthMode: getAuthMode,
    setGroup: setGroup,
    destroy: destroy,
    active: active,
    currentUser: currentUser,
    loadUser: loadUser,
    requestWsToken: requestWsToken,
    destroyWsToken: destroyWsToken,
    setPause: setPause,
    updateUserSession: updateUserSession,
    getUserAuthorizations: getUserAuthorizations,
  };

  destroy();

  return service;

  function setAuthToken (token) {
    model.token = token;
    $http.defaults.headers.common['X-Auth-Token'] = model.token;
    $localStorage.token = model.token;
  }

  function setAuthMode (authMode) {
    if (validAuthModes.includes(authMode)) {
      model.authMode = authMode
      $localStorage.authMode = model.authMode
    }
  }

  function getAuthMode () {
    if (validAuthModes.includes($localStorage.authMode)) {
      model.authMode = $localStorage.authMode
    }
    return model.authMode
  }

  function setGroup (group) {
    if (typeof group === 'object') {
      model.user.group = group.description;
      model.user.group_href = group.href;
      $localStorage.miqGroup = group.description;
      $localStorage.selectedMiqGroup = group.description;
    } else {
      $localStorage.miqGroup = group;
      $localStorage.selectedMiqGroup = group;
      model.user.group = group;
    }
  }

  function setPause (pauseLength) {
    $localStorage.pause = pauseLength * 1000;

    return $localStorage.pause;
  }

  function destroy () {
    model.token = null;
    model.user = {};
    model.authMode = defaultAuthMode;

    destroyWsToken();
    delete $http.defaults.headers.common['X-Auth-Token'];

    delete $localStorage.miqGroup;
    delete $localStorage.selectedMiqGroup;
    delete $localStorage.token;
    delete $localStorage.user;
    delete $localStorage.applianceInfo;
    delete $localStorage.pause;
    delete $localStorage.authMode;
  }

  function loadUser () {
    Polling.start('UserPolling', getUserAuthorizations, 300000); // every 5 minutes

    if (angular.isUndefined($localStorage.user)) {
      return getUserAuthorizations();
    }

    const response = angular.fromJson($localStorage.user);
    currentUser(response.identity);

    const miqGroup = angular.isUndefined($localStorage.selectedMiqGroup) ? response.identity.group : $localStorage.selectedMiqGroup;
    setGroup(miqGroup);

    RBAC.set(response.authorization.product_features);
    return $q.resolve(response);  // starts a promise chain, $q
  }

  function getUserAuthorizations () {
    const config = {
      headers: {
        'X-Auth-Skip-Token-Renewal': 'true',
      },
    };

    return $http.get('/api?attributes=authorization', config)
      .then(function (response) {
        $localStorage.user = angular.toJson(response.data);
        currentUser(response.data.identity);
        setGroup(response.data.identity.group);
        RBAC.set(response.data.authorization.product_features);

        return response.data;
      });
  }

  function requestWsToken (arg) {
    return $http.get('/api/auth?requester_type=ws')
      .then(function (response) {
        destroyWsToken();
        $cookies.put('ws_token', response.data.auth_token, {path: '/ws/notifications'});

        return arg;
      });
  }

  function destroyWsToken () {
    $cookies.remove('ws_token', {path: '/ws/notifications'});
  }

  function currentUser (user) {
    if (angular.isDefined(user)) {
      model.user = user;
    }

    return model.user;
  }

  function updateUserSession (data) {
    const userSession = JSON.parse($localStorage.user);
    Object.assign(userSession, data);
    $localStorage.user = JSON.stringify(userSession);
  }

  // Helpers

  function active () {
    // may not be current, but if we have one, we'll rely on API 401ing if it's not
    return angular.isString(model.token) ? model.token : false;
  }
}
