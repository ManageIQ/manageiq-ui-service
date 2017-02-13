/* eslint-disable arrow-parens */

/** @ngInject */
export function RBACFactory(lodash) {
  var features = {};
  var navFeatures = {};
  var actionFeatures = {};

  var service = {
    set: set,
    has: has,
    all: all,
    navigationEnabled: navigationEnabled,
    getNavFeatures: getNavFeatures,
    getActionFeatures: getActionFeatures,
    setNavFeatures: setNavFeatures,
    setActionFeatures: setActionFeatures,
  };

  return service;

  function set(productFeatures) {
    features = productFeatures || {};
    actionFeatures = setActions(productFeatures);
    navFeatures = setNavigation(productFeatures);
  }

  function has(feature) {
    return feature in features;
  }

  function all() {
    return features;
  }

  function setNavigation(productFeatures) {
    const features = {
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
  }
  function setActionFeatures(features) {
    actionFeatures = features;
  }
  function getActionFeatures() {
    return actionFeatures;
  }
  function setActions(productFeatures) {
    const features = {
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
    return actions.some(action => angular.isDefined(productFeatures[action]));
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

  function navigationEnabled() {
    var activeNavFeatures = lodash.find(navFeatures, function(o) {
      return o.show === true;
    });

    return angular.isDefined(activeNavFeatures);
  }
}
