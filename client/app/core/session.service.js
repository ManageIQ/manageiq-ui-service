/** @ngInject */
export function SessionFactory($http, $sessionStorage, gettextCatalog, $window, $state, $cookies, lodash, RBAC) {
  var model = {
    token: null,
    user: {},
  };

  var service = {
    current: model,
    create: create,
    destroy: destroy,
    active: active,
    currentUser: currentUser,
    loadUser: loadUser,
    requestWsToken: requestWsToken,
    destroyWsToken: destroyWsToken,
    switchGroup: switchGroup,
    activeNavigationFeatures: activeNavigationFeatures,
  };

  destroy();

  return service;

  function create(data) {
    model.token = data.auth_token;
    $http.defaults.headers.common['X-Auth-Token'] = model.token;
    $http.defaults.headers.common['X-Miq-Group'] = data.miqGroup || undefined;
    $sessionStorage.token = model.token;
    $sessionStorage.miqGroup = data.miqGroup || null;
  }

  function destroy() {
    model.token = null;
    model.user = {};
    destroyWsToken();
    delete $http.defaults.headers.common['X-Auth-Token'];
    delete $http.defaults.headers.common['X-Miq-Group'];
    delete $sessionStorage.miqGroup;
    delete $sessionStorage.token;
  }

  function loadUser() {
    return $http.get('/api?attributes=authorization')
      .then(function(response) {
        currentUser(response.data.identity);
        setRBAC(response.data.authorization.product_features);

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
    return model.token;
  }

  function setRBAC(productFeatures) {
    RBAC.set(productFeatures);

    // FIXME move these to the RBAC service as well
    $state.actionFeatures = setRBACForActions(productFeatures);
    $state.navFeatures = setRBACForNavigation(productFeatures);
  }

  function setRBACForNavigation(productFeatures) {
    var features = {
      dashboard: {show: entitledForDashboard(productFeatures)},
      services: {show: entitledForServices(productFeatures)},
      requests: {show: entitledForRequests(productFeatures)},
      marketplace: {show: entitledForServiceCatalogs(productFeatures)},
      designer: {show: entitledForServiceDesigner(productFeatures)},
      administration: {show: entitledForServiceDesigner(productFeatures)},
    };
    model.navFeatures = features;

    return model.navFeatures;
  }

  function setRBACForActions(productFeatures) {
    var features = {
      serviceView: {show: angular.isDefined(productFeatures.service_view)},
      serviceEdit: {show: angular.isDefined(productFeatures.service_edit)},
      serviceTag: {show: angular.isDefined(productFeatures.service_tag)},
      serviceDelete: {show: angular.isDefined(productFeatures.service_delete)},
      serviceReconfigure: {show: angular.isDefined(productFeatures.service_reconfigure)},
      serviceRetireNow: {show: angular.isDefined(productFeatures.service_retire_now)},
      serviceRetire: {show: angular.isDefined(productFeatures.service_retire)},
      serviceOwnership: {show: angular.isDefined(productFeatures.service_ownership)},
    };
    model.actionFeatures = features;

    return model.actionFeatures;
  }

  function entitledForServices(productFeatures) {
    var serviceFeature = lodash.find(model.actionFeatures, function(o) {
      return o.show === true;
    });

    return angular.isDefined(serviceFeature);
  }

  function isAnyActionAllowed(actions, productFeatures) {
    for (var i = 0; i <= actions.length; i++) {
      if (angular.isDefined(productFeatures[actions[i]])) {
        return true;
      }
    }

    return false;
  }

  function entitledForCatalogItems(productFeatures) {
    var actions = ["atomic_catalogitem_edit",
      "atomic_catalogitem_new",
      "catalog_items_view",
      "catalogitem_edit",
      "catalogitem_new"];

    return isAnyActionAllowed(actions, productFeatures);
  }

  function entitledForServiceCatalogs(productFeatures) {
    return angular.isDefined(productFeatures.svc_catalog_provision);
  }

  function entitledForRequests(productFeatures) {
    return angular.isDefined(productFeatures.miq_request_view);
  }

  function entitledForDashboard(productFeatures) {
    return entitledForServices(productFeatures)
      || entitledForRequests(productFeatures)
      || entitledForServiceCatalogs(productFeatures);
  }

  function entitledForServiceDesigner(productFeatures) {
    return angular.isDefined(productFeatures.service_create);
  }

  function activeNavigationFeatures() {
    var activeNavFeatures = lodash.find(model.navFeatures, function(o) {
      return o.show === true;
    });

    return angular.isDefined(activeNavFeatures);
  }
}
