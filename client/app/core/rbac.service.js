import constants from './product-features.constants.json'
const { productFeatures } = constants;

/** @ngInject */
export function RBACFactory (lodash) {
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
    suiAuthorized: suiAuthorized
  }

  function set (productFeatures) {
    features = productFeatures || {}
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

  function setRole (newRole) {
    currentRole = newRole
  }

  function suiAuthorized () {
    return hasAny([productFeatures.SERVICES.VIEW,
      productFeatures.ORDERS.VIEW,
      productFeatures.SERVICE_CATALOG.VIEW])
  }
}
