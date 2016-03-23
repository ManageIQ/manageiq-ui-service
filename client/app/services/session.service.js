(function() {
  'use strict';

  angular.module('app.services')
    .factory('Session', SessionFactory);

  /** @ngInject */
  function SessionFactory($http, moment, $sessionStorage, gettextCatalog, $window, $state, lodash) {
    var model = {
      token: null,
      user: {}
    };

    var service = {
      current: model,
      create: create,
      destroy: destroy,
      active: active,
      currentUser: currentUser,
      loadUser: loadUser,
      switchGroup: switchGroup,
      activeNavigationFeatures: activeNavigationFeatures
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

          var locale = response.data.settings && response.data.settings.locale;
          gettextCatalog.loadAndSet(locale);
        });
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
      $state.actionFeatures = setRBACForActions(productFeatures);
      $state.navFeatures = setRBACForNavigation(productFeatures);
    }

    function setRBACForNavigation(productFeatures) {
      var features = {
        dashboard:   {show: entitledForDashboard(productFeatures)},
        services:    {show: entitledForServices(productFeatures)},
        requests:    {show: entitledForRequests(productFeatures)},
        marketplace: {show: entitledForServiceCatalogs(productFeatures)},
        blueprints:  {show: false}
      };
      model.navFeatures = features;

      return model.navFeatures;
    }

    function setRBACForActions(productFeatures) {
      var features = {
        service_view:        {show: angular.isDefined(productFeatures.service_view)},
        service_edit:        {show: angular.isDefined(productFeatures.service_edit)},
        service_delete:      {show: angular.isDefined(productFeatures.service_delete)},
        service_reconfigure: {show: angular.isDefined(productFeatures.service_reconfigure)},
        service_retire_now:  {show: angular.isDefined(productFeatures.service_retire_now)},
        service_retire:      {show: angular.isDefined(productFeatures.service_retire)},
        service_ownership:   {show: angular.isDefined(productFeatures.service_ownership)}
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

    function entitledForServiceCatalogs(productFeatures) {
      return angular.isDefined(productFeatures.svc_catalog_provision);
    }

    function entitledForRequests(productFeatures) {
      return angular.isDefined(productFeatures.miq_request_view);
    }

    function entitledForDashboard(productFeatures) {
      return entitledForServices(productFeatures) ||
             entitledForRequests(productFeatures) ||
             entitledForServiceCatalogs(productFeatures);
    }

    function activeNavigationFeatures() {
      var activeNavFeatures = lodash.find(model.navFeatures, function(o) {
        return o.show === true;
      });

      return angular.isDefined(activeNavFeatures);
    }
  }
})();
