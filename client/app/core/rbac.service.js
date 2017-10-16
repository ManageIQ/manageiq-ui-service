import { productFeatures } from './product-features.constants.json'
/** @ngInject */
export function RBACFactory (lodash) {
  var navFeatures = {}
  let features = {}
  let currentRole

  return {
    all: all,
    set: set,
    has: has,
    FEATURES: productFeatures,
    hasAny: hasAny,
    hasRole: hasRole,
    setRole: setRole,
    getNavFeatures: getNavFeatures,
    setNavFeatures: setNavFeatures,
    navigationEnabled: navigationEnabled
  }

  function set (productFeatures) {
    const vm = this
    features = productFeatures || {}
    const navPermissions = {
      services: {show: vm.has(vm.FEATURES.SERVICES.VIEW)},
      orders: {show: vm.has(vm.FEATURES.ORDERS.VIEW)},
      catalogs: {show: vm.has(vm.FEATURES.SERVICE_CATALOG.VIEW)}
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
