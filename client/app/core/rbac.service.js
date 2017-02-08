/** @ngInject */
export function RBACFactory(lodash) {
  var features = {};
  var navFeatures = {};
  var actionFeatures = {};

  var service = {
    set: set,
    has: has,
    all: all,
    activeNavigationFeatures: activeNavigationFeatures,
    getNavFeatures: getNavFeatures,
    getActionFeatures: getActionFeatures,
    setNavFeatures: setNavFeatures,
    setActionFeatures: setActionFeatures,
  };

  return service;

  function set(productFeatures) {
    features = productFeatures || {};
    actionFeatures = setRBACForActions(productFeatures);
    navFeatures = setRBACForNavigation(productFeatures);
  }

  function has(feature) {
    return feature in features;
  }

  function all() {
    return features;
  }

  function setRBACForNavigation(productFeatures) {
    var features = {
      dashboard: {show: entitledForDashboard(productFeatures)},
      services: {show: entitledForServices(productFeatures)},
      orders: {show: entitledForServices(productFeatures)},
      requests: {show: entitledForRequests(productFeatures)},
      catalogs: {show: entitledForServiceCatalogs(productFeatures)},
      dialogs: {show: entitledForService(productFeatures)},
      administration: {show: entitledForService(productFeatures)},
    };

    return features;
  }
  function setNavFeatures(features) {
    navFeatures = features;

    return navFeatures;
  }
  function setActionFeatures(features) {
    actionFeatures = features;

    return actionFeatures;
  }
  function getActionFeatures() {
    return actionFeatures;
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

    return features;
  }
  function getNavFeatures() {
    return navFeatures;
  }
  function entitledForServices(productFeatures) {
    var serviceFeature = lodash.find(actionFeatures, function(o) {
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

  function entitledForService(productFeatures) {
    return angular.isDefined(productFeatures.service_create);
  }

  function activeNavigationFeatures() {
    var activeNavFeatures = lodash.find(navFeatures, function(o) {
      return o.show === true;
    });

    return angular.isDefined(activeNavFeatures);
  }
}
