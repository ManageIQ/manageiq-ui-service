/** @ngInject */
export function RBACFactory (lodash) {
  var navFeatures = {}
  let features = {}
  let currentRole

  return {
    all: all,
    set: set,
    has: has,
    hasAny: hasAny,
    hasRole: hasRole,
    setRole: setRole,
    getNavFeatures: getNavFeatures,
    setNavFeatures: setNavFeatures,
    navigationEnabled: navigationEnabled
  }

  function set (productFeatures) {
    features = productFeatures || {}

    const navPermissions = {
      services: {show: angular.isDefined(productFeatures.service_view)},
      orders: {show: angular.isDefined(productFeatures.svc_catalog_provision)},
      catalogs: {show: angular.isDefined(productFeatures.catalog_items_view)}
    }
    setNavFeatures(navPermissions)
  }

  function has (feature) {
    return feature in features
  }

  function hasAny (permissions) {
    return permissions.some((feature) => angular.isDefined(features[feature]))
  }

  function hasRole (...roles) {
    return roles.some((role) => role === currentRole || role === '_ALL_')
  }

  function all () {
    return features
  }

  function setNavFeatures (features) {
    navFeatures = features
  }

  function setRole (newRole) {
    currentRole = newRole
  }

  function getNavFeatures () {
    return navFeatures
  }

  function navigationEnabled () {
    return lodash.some(navFeatures, (item) => item.show)
  }
}
